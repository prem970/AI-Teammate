import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, role = "support" } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing query parameter." }, { status: 400 });
    }

    const normalized = query.toLowerCase();
    let reply = "";
    let referencedPolicies: string[] = [];

    if (normalized.includes("u69") || normalized.includes("duplicate") || normalized.includes("dup")) {
      referencedPolicies = ["PAYMENT-DUPLICATE-V2 (Section 4.1)"];
      reply =
        "Per active standard **PAYMENT-DUPLICATE-V2 (Section 4.1)**: When bank switch returns code U69 (Transient Timeout Reversal), the merchant settlement holds the first captured transaction (TXN-001). " +
        "The secondary customer debit (TXN-002) is not settled to merchant escrow and must be released to remitter via NPCI reversal. " +
        "Remember: Current active policies strictly beat historical cases. Payment execution is prohibited in this assistant; human ops must approve via the Escalation package queue.";
    } else if (normalized.includes("soundbox") || normalized.includes("latency") || normalized.includes("audio")) {
      referencedPolicies = ["POL-SBX-001 (Section 2.3)"];
      reply =
        "Under **POL-SBX-001**: Normal acoustic prompt latency threshold is <1200ms. If cellular signal drops below -105 dBm or latency exceeds 3500ms across 3 pings, support ops should execute an OTA carrier profile reset before authorising hardware technician dispatch.";
    } else if (normalized.includes("settle") || normalized.includes("payout") || normalized.includes("batch")) {
      referencedPolicies = ["POL-SETTLE-DAILY-V1 (Section 7.2)"];
      reply =
        "Per **POL-SETTLE-DAILY-V1**: All standard UPI QR payouts clear in the daily 18:00 IST cycle. Batches exceeding ₹5,000 experiencing NPCI/clearing bank maintenance require support ops sign-off before manual release bypass.";
    } else if (normalized.includes("stage") || normalized.includes("sales") || normalized.includes("handoff")) {
      reply =
        "In the Multi-Agent Sales Pipeline: Stage progression is strictly sequential: Outreach (Agent1) → Follow-ups (Agent1) → Quoting (Agent2) → Negotiation (Agent2) → Onboarding (Agent3) → Closed-Won. Stage skipping is disabled to ensure regulatory KYC and pricing checks are logged at each transition.";
    } else {
      reply =
        "Autonomous AI OS Policy Knowledge Engine: You can query any active compliance standard (e.g. 'Explain rule for switch code U69', 'What are SoundBox latency thresholds in POL-SBX-001?', 'Can sales agents skip quotation stages?'). Note: Payment execution is disabled in this console.";
      referencedPolicies = ["PAYMENT-DUPLICATE-V2", "POL-SBX-001", "POL-SETTLE-DAILY-V1"];
    }

    return NextResponse.json({
      reply,
      referencedPolicies,
      systemNotice: "Employees get knowledge/policy assistance; payment execution is not available here.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
