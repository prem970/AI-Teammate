import { NextRequest, NextResponse } from "next/server";
import { ChatApiRequest, ChatApiResponse } from "@/lib/types";

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

    // Check for optional intentional error simulation trigger
    if (message.toLowerCase().includes("trigger_error")) {
      return NextResponse.json(
        { error: "Simulated Orchestrator Upstream Timeout (504 Gateway Timeout)" },
        { status: 504 }
      );
    }

    const n8nUrl = process.env.N8N_CS_ORCHESTRATOR_URL;

    // If an upstream n8n orchestrator URL is configured in environment
    if (n8nUrl && n8nUrl.trim().length > 0) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

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
            order_id,
            tid,
            timestamp: new Date().toISOString(),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!upstreamResponse.ok) {
          const errText = await upstreamResponse.text();
          return NextResponse.json(
            {
              error: `Upstream Autonomous Orchestrator returned status ${upstreamResponse.status}: ${errText || "No response details"}`,
            },
            { status: 502 }
          );
        }

        const upstreamData = await upstreamResponse.json();
        return NextResponse.json({
          reply:
            upstreamData.reply ||
            upstreamData.output ||
            upstreamData.message ||
            "Orchestrator acknowledged your request without text output.",
          trace: upstreamData.trace,
          suggestedActions: upstreamData.suggestedActions,
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Network error";
        return NextResponse.json(
          {
            error: `Failed to communicate with N8N_CS_ORCHESTRATOR_URL: ${errorMessage}`,
          },
          { status: 502 }
        );
      }
    }

    // Default Fallback: Production-grade Mock Agent Dispatcher
    // Used for previewing Paytm-like merchant workflows when n8n is not yet plugged in
    const normalized = message.toLowerCase();
    const startTime = Date.now();

    let reply = "";
    let intent = "GENERAL_INQUIRY";
    let agentsInvolved = ["AutonomousSupervisorAgent"];
    let decision = "ROUTED_TO_DEFAULT_ASSIST";
    let policyId = "POL-CORE-HELP-V1";
    let confidence = 0.95;
    const suggestedActions: ChatApiResponse["suggestedActions"] = [];

    if (
      normalized.includes("dup") ||
      normalized.includes("dispute") ||
      normalized.includes("ord-dup-1001") ||
      order_id?.includes("DUP") ||
      normalized.includes("double debit")
    ) {
      intent = "PAYMENT_DISPUTE_RECONCILIATION";
      agentsInvolved = [
        "PaymentDisputeAgent",
        "NPCISwitchVerificationAgent",
        "SettlementProtectionGuard",
      ];
      decision = "AUTONOMOUS_REFUND_MATCH_VERIFIED";
      policyId = "POL-AUTO-DISPUTE-V2.4";
      confidence = 0.98;

      reply =
        "Regarding order **ORD-DUP-1001** (₹1,450.00): Our autonomous switch auditor detected a transient timeout acknowledgment with Axis Bank remitter switch (Code: U69). " +
        "Your SoundBox played a single audio receipt, while the customer's duplicate debit has already been captured into escalation package **ESC-90214**. " +
        "The excess debit was automatically returned to the remitter's UPI account. Your merchant settlement ledger remains protected and balanced.";

      suggestedActions.push(
        {
          label: "Inspect Escalation Package ESC-90214",
          action: "VIEW_ESCALATION",
          targetId: "ESC-90214",
        },
        {
          label: "View Disputed Order Details",
          action: "VIEW_ORDER",
          targetId: "ORD-DUP-1001",
        }
      );
    } else if (
      normalized.includes("soundbox") ||
      normalized.includes("audio") ||
      normalized.includes("volume") ||
      normalized.includes("tid-sbx") ||
      tid
    ) {
      intent = "HARDWARE_TELEMETRY_DIAGNOSTICS";
      agentsInvolved = [
        "HardwareTelemetryAgent",
        "SoundBoxFirmwareAgent",
        "M2MConnectivityAgent",
      ];
      decision = "TELEMETRY_HEALTH_AFFIRMED";
      policyId = "POL-HW-TELEMETRY-V1.8";
      confidence = 0.96;

      reply =
        "Hardware telemetry scan completed for **TID-SBX-82931** (Paytm SoundBox 4G Dual Sim): " +
        "4G VoLTE signal is strong at 94% on Airtel M2M. Battery level is at 88% with audio heartbeat functioning normally. " +
        "Volume is currently set to Level 8. An over-the-air acoustic test packet was acknowledged in 142ms.";

      suggestedActions.push({
        label: "Open Device Telemetry Panel",
        action: "VIEW_DEVICE",
        targetId: "TID-SBX-82931",
      });
    } else if (
      normalized.includes("settle") ||
      normalized.includes("payout") ||
      normalized.includes("bank") ||
      normalized.includes("account")
    ) {
      intent = "SETTLEMENT_LEDGER_INQUIRY";
      agentsInvolved = [
        "SettlementEngineAgent",
        "BankingPartnerSyncAgent",
      ];
      decision = "LEDGER_BALANCE_CURRENT";
      policyId = "POL-AUTO-RECON-V4.1";
      confidence = 0.99;

      reply =
        "Your primary settlement account **HDFC Bank (•••• 8109)** is active and verified. " +
        "Today's gross settled volume is **₹4,319.00** across 2 settled transactions. " +
        "The automated daily clearing cycle will transfer funds by 06:00 PM IST without any manual intervention required.";

      suggestedActions.push({
        label: "View Settled Orders",
        action: "VIEW_ORDERS",
      });
    } else {
      reply =
        "Welcome to the Autonomous AI OS for Paytm merchants. I am actively monitoring your SoundBox terminals, Smart POS units, UPI transactions, and autonomous settlement disputes. " +
        "You can ask me to run a telemetry ping on your SoundBox, verify transaction status for disputed orders like ORD-DUP-1001, or check escalation packages.";

      suggestedActions.push(
        {
          label: "Audit Disputed Order ORD-DUP-1001",
          action: "RUN_QUERY",
          targetId: "What is the status of disputed transaction ORD-DUP-1001?",
        },
        {
          label: "Run SoundBox Telemetry Diagnostic",
          action: "RUN_QUERY",
          targetId: "Run a full telemetry health check on TID-SBX-82931",
        }
      );
    }

    const latencyMs = Date.now() - startTime + 180; // realistic processing time

    const responsePayload: ChatApiResponse = {
      reply,
      trace: {
        intent,
        agentsInvolved,
        decision,
        policyId,
        confidence,
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      suggestedActions,
    };

    return NextResponse.json(responsePayload);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: `Internal API error processing chat: ${errMessage}` },
      { status: 500 }
    );
  }
}
