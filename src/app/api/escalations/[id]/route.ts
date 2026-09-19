import { NextRequest, NextResponse } from "next/server";
import { updateEscalationDecision, getEscalationById } from "@/lib/opsMockData";
import { HumanActionType } from "@/lib/opsTypes";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const pkg = getEscalationById(params.id);
  if (!pkg) {
    return NextResponse.json({ error: "Escalation package not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, escalation: pkg });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const updated = updateEscalationDecision(
      params.id,
      action as HumanActionType,
      decidedBy,
      notes,
      refundAmount
    );

    if (!updated) {
      return NextResponse.json(
        { error: `Escalation ${params.id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Action '${action}' executed successfully on package ${params.id}`,
      escalation: updated,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: `Failed to process escalation decision: ${errorMsg}` },
      { status: 500 }
    );
  }
}
