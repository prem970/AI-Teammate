import { getContainer, queryAll } from "./client";
import type { HumanActionType, EscalationPackage } from "../opsTypes";

/**
 * Persist a HIL decision audit row and optionally notify CS resume webhook.
 * Does not invent refunds — only records human decision + optional notify.
 */
export async function emitHilDecisionSignal(input: {
  escalation: EscalationPackage;
  action: HumanActionType;
  decidedBy: string;
  notes: string;
  refundAmount?: number;
}): Promise<{ auditWritten: boolean; notifyStatus: "sent" | "skipped" | "failed"; notifyDetail?: string }> {
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  let auditWritten = false;

  const auditContainer = getContainer("audit_events");
  if (auditContainer) {
    try {
      const workflowId = input.escalation.workflowId || `HIL-${input.escalation.escalationId}`;
      await auditContainer.items.upsert({
        id: `audit-hil-${input.escalation.escalationId}-${Date.now()}`,
        workflowId,
        eventType: "hil_decision",
        customerId: input.escalation.customerId,
        escalationId: input.escalation.escalationId,
        action: input.action,
        decidedBy: input.decidedBy,
        notes: input.notes,
        refundAmount: input.refundAmount ?? null,
        statusAfter: input.escalation.status,
        createdAt: now,
        source: "ops_console",
      });
      auditWritten = true;
    } catch {
      auditWritten = false;
    }
  }

  const payload = {
    event: "hil_decision",
    source: "ops_console",
    escalation_id: input.escalation.escalationId,
    customer_id: input.escalation.customerId,
    workflow_id: input.escalation.workflowId || null,
    order_id: input.escalation.orderId || null,
    action: input.action,
    status: input.escalation.status,
    decided_by: input.decidedBy,
    notes: input.notes,
    refund_amount: input.refundAmount ?? null,
    recommended_action: input.escalation.recommendedAction,
    issue: input.escalation.issue,
    policy_id: input.escalation.policyId,
    resolution_decision: input.escalation.resolutionDecision || null,
    timestamp: now,
    // Instruction for CS Orchestrator / resume workflow
    resume_hint:
      input.action === "return_to_agent"
        ? "Human returned case to agent — continue workflow with decision notes; do not re-create escalation for same issue."
        : input.action === "approve"
          ? "Human approved recommended action — proceed only with approved steps; do not invent extra refunds."
          : input.action === "reject"
            ? "Human rejected recommendation — inform customer of outcome; do not execute refund."
            : "Human updated HIL package — read status and resolution_decision before acting.",
  };

  const resumeUrl =
    (process.env.N8N_HIL_RESUME_URL || "").trim() ||
    (process.env.N8N_CS_ORCHESTRATOR_URL || "").trim();

  if (!resumeUrl) {
    return { auditWritten, notifyStatus: "skipped", notifyDetail: "No N8N_HIL_RESUME_URL or N8N_CS_ORCHESTRATOR_URL" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    const res = await fetch(resumeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Client-Application": "Autonomous-AI-OS-Ops-HIL",
        "X-Event-Type": "hil_decision",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const text = await res.text();
    if (!res.ok) {
      return {
        auditWritten,
        notifyStatus: "failed",
        notifyDetail: `HTTP ${res.status}: ${text.slice(0, 300)}`,
      };
    }
    return {
      auditWritten,
      notifyStatus: "sent",
      notifyDetail: text.slice(0, 300) || `HTTP ${res.status}`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "notify failed";
    return { auditWritten, notifyStatus: "failed", notifyDetail: msg };
  }
}

export async function listOpenEscalationsForCustomer(customerId: string) {
  const rows = await queryAll<Record<string, unknown>>(
    "escalations",
    "SELECT * FROM c WHERE c.customerId = @id",
    [{ name: "@id", value: customerId }]
  );
  return rows.filter((r) => {
    const s = String(r.status || "").toLowerCase();
    return !s.includes("resolv") && !s.includes("closed");
  });
}
