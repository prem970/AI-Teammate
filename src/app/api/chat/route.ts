import { NextRequest, NextResponse } from "next/server";
import { ChatApiRequest } from "@/lib/types";
import {
  listCustomerEscalations,
  findCustomerEscalationsMatching,
  getActivePolicyById,
  isCosmosLive,
} from "@/lib/cosmos/repository";
import { detectHilFromToolCalls } from "@/lib/hilDetect";
import {
  buildRefundCreditGrounding,
  ensurePolicyChangeInReply,
  isRefundBankCreditQuestion,
  type PolicyChatGrounding,
} from "@/lib/policyChatGrounding";
import { stripOrchestratorTraceForDisplay } from "@/lib/stripOrchestratorTrace";
import { formatOrchestratorError } from "@/lib/orchestratorErrors";

/** Allow long orchestrator runs (n8n often 60–120s+). Hosting may still cap lower. */
export const maxDuration = 300;
export const runtime = "nodejs";

/** Cloudflare on n8n.cloud cuts at ~120s; keep client wait slightly above that. */
const ORCHESTRATOR_TIMEOUT_MS = 240_000;

function isOpenCustomerStatus(status: string): boolean {
  return status !== "RESOLVED";
}

function mapOpen(e: {
  escalationId: string;
  issue: string;
  status: string;
  recommendedAction: string;
  relatedOrderId?: string;
  policyId: string;
}) {
  return {
    escalationId: e.escalationId,
    issue: e.issue,
    status: e.status,
    recommendedAction: e.recommendedAction,
    relatedOrderId: e.relatedOrderId,
    policyId: e.policyId,
  };
}

async function resolveRefundGrounding(
  message: string
): Promise<PolicyChatGrounding | null> {
  if (!isRefundBankCreditQuestion(message) || !isCosmosLive()) return null;
  const active = await getActivePolicyById("POL-PAY-REFUND-CREDIT");
  if (!active) return null;
  return buildRefundCreditGrounding(active);
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatApiRequest = await request.json();
    const { message, customer_id, order_id, tid } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'message' in request body" },
        { status: 400 }
      );
    }

    if (message.toLowerCase().includes("trigger_error")) {
      return NextResponse.json(
        { error: "Simulated Orchestrator Upstream Timeout (504 Gateway Timeout)" },
        { status: 504 }
      );
    }

    const n8nUrl = process.env.N8N_CS_ORCHESTRATOR_URL;
    const grounding = await resolveRefundGrounding(message);

    let openEscalations: ReturnType<typeof mapOpen>[] = [];
    if (customer_id && isCosmosLive()) {
      try {
        const all = await listCustomerEscalations(customer_id);
        openEscalations = all.filter((e) => isOpenCustomerStatus(e.status)).map(mapOpen);
      } catch {
        openEscalations = [];
      }
    }

    // Demo path: if Cosmos has current refund policy but orchestrator URL missing, still answer from policy.
    if (!n8nUrl?.trim()) {
      if (grounding) {
        return NextResponse.json({
          reply: grounding.answerForMerchant,
          trace: {
            intent: "POLICY_REFUND_CREDIT_TIMELINE",
            agentsInvolved: ["Knowledge", "Policy"],
            decision: "REPLY_CURRENT_POLICY",
            policyId: `${grounding.policyId} ${grounding.version}`,
            confidence: 0.95,
            latencyMs: 0,
            timestamp: new Date().toISOString(),
          },
          open_escalations: openEscalations,
          policy_grounding: grounding,
          hil_note: "Answered from active Cosmos policy (orchestrator URL not configured).",
        });
      }
      return NextResponse.json(
        {
          error:
            "N8N_CS_ORCHESTRATOR_URL is not configured. Chat will not invent order, payment, or device outcomes.",
          demo: false,
        },
        { status: 503 }
      );
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ORCHESTRATOR_TIMEOUT_MS);

      const effectiveOrderId = order_id || grounding?.relatedOrderId || undefined;

      const upstreamResponse = await fetch(n8nUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Client-Application": "Autonomous-AI-OS-Customer-Portal",
        },
        body: JSON.stringify({
          message,
          customer_id,
          order_id: effectiveOrderId,
          tid,
          timestamp: new Date().toISOString(),
          open_escalations: openEscalations,
          policy_context: grounding
            ? {
                policy_id: grounding.policyId,
                policy_version: grounding.version,
                title: grounding.title,
                instruction: grounding.orchestratorHint,
                merchant_facing_answer: grounding.answerForMerchant,
                related_escalation_id: grounding.relatedEscalationId,
              }
            : undefined,
          hil_context: {
            customer_cannot_escalate: true,
            escalation_authority: "orchestrator_via_mcp_only",
            instruction:
              "If risk/policy requires human judgment, call MCP escalation_create yourself. " +
              "Never tell the merchant to escalate. Reuse open_escalations for the same order/issue. " +
              (grounding
                ? `For refund bank-credit timeline questions, CURRENT policy beats historical: ${grounding.orchestratorHint}`
                : ""),
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!upstreamResponse.ok) {
        // Still answer policy-change demos from Cosmos if upstream fails
        if (grounding) {
          return NextResponse.json({
            reply: grounding.answerForMerchant,
            open_escalations: openEscalations,
            policy_grounding: grounding,
            hil_note: `Orchestrator HTTP ${upstreamResponse.status}; replied from active Cosmos policy.`,
          });
        }
        const errText = await upstreamResponse.text();
        const friendly = formatOrchestratorError(errText, upstreamResponse.status);
        return NextResponse.json(
          {
            error: friendly.message,
            retryable: friendly.retryable,
            code: friendly.code || `HTTP_${upstreamResponse.status}`,
            detail: errText.slice(0, 500),
          },
          { status: upstreamResponse.status === 524 ? 504 : 502 }
        );
      }

      const upstreamData = await upstreamResponse.json();
      const rawReplyText =
        upstreamData.reply ||
        upstreamData.output ||
        upstreamData.message ||
        upstreamData.text ||
        (typeof upstreamData === "string" ? upstreamData : null) ||
        "Orchestrator acknowledged your request without text output.";

      let replyText =
        typeof rawReplyText === "string" ? rawReplyText : String(rawReplyText);

      if (grounding) {
        replyText = ensurePolicyChangeInReply(replyText, grounding);
      }

      // Preserve full upstream text for optional structured trace; return message body only.
      const rawForTrace = replyText;
      replyText = stripOrchestratorTraceForDisplay(replyText);

      const hilSignal = detectHilFromToolCalls(upstreamData);

      let refreshed = openEscalations;
      let matchedFromDb: ReturnType<typeof mapOpen>[] = [];

      if (customer_id && isCosmosLive()) {
        try {
          if (hilSignal.detected) {
            await new Promise((r) => setTimeout(r, 800));
          }

          const orderHint = effectiveOrderId || hilSignal.orderIds[0] || undefined;

          if (hilSignal.detected) {
            const found = await findCustomerEscalationsMatching({
              customerId: customer_id,
              orderId: orderHint,
              escalationIds: hilSignal.escalationIds,
            });
            matchedFromDb = found.map(mapOpen);
          }

          const all = await listCustomerEscalations(customer_id);
          refreshed = all.filter((e) => isOpenCustomerStatus(e.status)).map(mapOpen);

          if (matchedFromDb.length) {
            const openMatched = matchedFromDb.filter((e) => isOpenCustomerStatus(e.status));
            if (openMatched.length) refreshed = openMatched;
          }
        } catch {
          /* keep prior */
        }
      }

      let trace = upstreamData.trace;
      if (grounding) {
        trace = {
          ...(typeof trace === "object" && trace ? trace : {}),
          intent: "POLICY_REFUND_CREDIT_TIMELINE",
          agentsInvolved: [
            ...((trace as { agentsInvolved?: string[] })?.agentsInvolved || ["Orchestrator"]),
            "Policy",
          ],
          decision: "REPLY_CURRENT_POLICY",
          policyId: `${grounding.policyId} ${grounding.version}`,
          confidence: 0.95,
          latencyMs: (trace as { latencyMs?: number })?.latencyMs ?? 0,
          timestamp: new Date().toISOString(),
        };
      } else if (!trace && /Intent\s*(?:→|->)/i.test(rawForTrace)) {
        trace = {
          intent: "ORCHESTRATOR_MULTI_AGENT",
          agentsInvolved: ["Orchestrator"],
          decision: hilSignal.detected ? "ESCALATE_HUMAN" : "RESOLVE_OR_REPLY",
          policyId: "FROM_ORCHESTRATOR_TRACE",
          confidence: 0.9,
          latencyMs: 0,
          timestamp: new Date().toISOString(),
          raw: rawForTrace.slice(0, 2000),
        };
      } else if (trace && hilSignal.detected) {
        trace = { ...trace, decision: trace.decision || "ESCALATE_HUMAN" };
      }

      const suggestedActions = (upstreamData.suggestedActions || []).filter(
        (a: { action?: string; label?: string }) => {
          const blob = `${a.action || ""} ${a.label || ""}`.toLowerCase();
          return !blob.includes("create_escalation") && !blob.includes("escalate now");
        }
      );

      return NextResponse.json({
        reply: replyText,
        trace,
        suggestedActions,
        usage: upstreamData.usage,
        toolCalls: upstreamData.toolCalls,
        open_escalations: refreshed,
        policy_grounding: grounding || undefined,
        hil: {
          detected_from_tools: hilSignal.detected,
          tool_names: hilSignal.toolNames,
          escalation_ids_in_tools: hilSignal.escalationIds,
          order_ids_in_tools: hilSignal.orderIds,
          txn_ids_in_tools: hilSignal.txnIds,
          status_source: "cosmos",
          packages: matchedFromDb.length ? matchedFromDb : refreshed,
        },
        hil_note: hilSignal.detected
          ? "HIL tool activity detected in response — case status loaded from Cosmos (view-only for merchant)."
          : grounding
            ? "Refund bank-credit question grounded on active Cosmos policy (current beats historical)."
            : refreshed.length > 0
              ? "Open case(s) already in Cosmos for this merchant (view-only)."
              : "No HIL package in DB for this turn.",
      });
    } catch (err: unknown) {
      if (grounding) {
        return NextResponse.json({
          reply: grounding.answerForMerchant,
          open_escalations: openEscalations,
          policy_grounding: grounding,
          hil_note: "Orchestrator unreachable; replied from active Cosmos policy.",
        });
      }
      const friendly = formatOrchestratorError(err);
      return NextResponse.json(
        {
          error: friendly.message,
          retryable: friendly.retryable,
          code: friendly.code || "UPSTREAM_ERROR",
        },
        { status: 504 }
      );
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: `Internal API error processing chat: ${errMessage}` },
      { status: 500 }
    );
  }
}
