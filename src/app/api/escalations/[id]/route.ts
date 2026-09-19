import { NextRequest, NextResponse } from "next/server";
import {
  getOpsEscalationById,
  patchEscalationDecision,
  isCosmosLive,
} from "@/lib/cosmos/repository";
import { emitHilDecisionSignal } from "@/lib/cosmos/hil";
import { HumanActionType } from "@/lib/opsTypes";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isCosmosLive()) {
    return NextResponse.json(
      { error: "Cosmos not configured", dataOrigin: "unavailable" },
      { status: 503 }
    );
  }
  const pkg = await getOpsEscalationById(params.id);
  if (!pkg) {
    return NextResponse.json({ error: "Escalation package not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, escalation: pkg, dataOrigin: "cosmos" });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isCosmosLive()) {
      return NextResponse.json(
        { error: "Cosmos not configured — cannot persist HIL decisions" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { action, decidedBy = "Support Ops Specialist", notes = "", refundAmount } = body;

    const validActions: HumanActionType[] = [
      "approve",
      "reject",
      "modify",
      "take_over",
      "resolve",
      "return_to_agent",
    ];

    if (!validActions.includes(action as HumanActionType)) {
      return NextResponse.json(
        { error: `Invalid human action '${action}'. Allowed: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await patchEscalationDecision(
      params.id,
      action as HumanActionType,
      decidedBy,
      notes,
      refundAmount
    );

    if (!updated) {
      return NextResponse.json(
        { error: `Escalation ${params.id} not found in Cosmos` },
        { status: 404 }
      );
    }

    // Cosmos + optional n8n HIL resume (N8N_HIL_RESUME_URL). No MCP changes.
    const hil = await emitHilDecisionSignal({
      escalation: updated,
      action: action as HumanActionType,
      decidedBy,
      notes,
      refundAmount,
    });

    return NextResponse.json({
      success: true,
      message: `Action '${action}' persisted to Cosmos escalations`,
      escalation: updated,
      dataOrigin: "cosmos",
      auditWritten: hil.auditWritten,
      resumeNotify: hil.notifyStatus,
      resumeDetail: hil.notifyDetail,
      note:
        hil.notifyStatus === "sent"
          ? "Status in Cosmos; HIL resume webhook notified."
          : "Status in Cosmos; resume webhook skipped or failed (see resumeNotify).",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: `Failed to process escalation decision: ${errorMsg}` },
      { status: 500 }
    );
  }
}
