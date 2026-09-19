import { NextRequest, NextResponse } from "next/server";
import { getCurrentOpsSession } from "@/lib/opsAuth";
import { getLeadById, isCosmosLive } from "@/lib/cosmos/repository";

const DEFAULT_OUTREACH_URL =
  "https://agentos97.app.n8n.cloud/webhook/sales-lead-intake";

export async function POST(request: NextRequest) {
  const session = await getCurrentOpsSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Ops login required. Sign in at /login/ops as Sales Ops." },
      { status: 401 }
    );
  }

  if (!isCosmosLive()) {
    return NextResponse.json(
      { success: false, error: "Cosmos not configured — cannot load lead for outreach." },
      { status: 503 }
    );
  }

  let body: { leadId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const leadId = (body.leadId || "").trim();
  if (!leadId) {
    return NextResponse.json({ success: false, error: "leadId is required" }, { status: 400 });
  }

  const lead = await getLeadById(leadId);
  if (!lead) {
    return NextResponse.json(
      { success: false, error: `Lead ${leadId} not found in Cosmos` },
      { status: 404 }
    );
  }

  const outreachUrl =
    (process.env.N8N_SALES_OUTREACH_URL || "").trim() || DEFAULT_OUTREACH_URL;

  const message = [
    `Sales Ops (${session.name}) requested outreach for lead ${lead.id}.`,
    `Company: ${lead.businessName}.`,
    `Contact: ${lead.contactName} <${lead.email}> (${lead.phone}).`,
    `City: ${lead.city}.`,
    `Product interest: ${lead.productPitch}.`,
    `Current stage: ${lead.currentStage}.`,
    `Draft first-touch outreach email only; do not send without human review.`,
  ].join(" ");

  const payload = {
    message,
    chatInput: message,
    company: lead.businessName,
    company_email: lead.email,
    context: {
      leadId: lead.id,
      company: lead.businessName,
      contact: lead.contactName,
      email: lead.email,
      phone: lead.phone,
      city: lead.city,
      stage: lead.currentStage,
      productPitch: lead.productPitch,
      triggeredBy: {
        userId: session.userId,
        name: session.name,
        role: session.role,
      },
    },
  };

  try {
    const upstream = await fetch(outreachUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(120_000),
    });

    const rawText = await upstream.text();
    let parsed: unknown = rawText;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // keep text
    }

    if (!upstream.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Outreach webhook returned ${upstream.status}`,
          detail: typeof parsed === "string" ? parsed.slice(0, 500) : parsed,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      company: lead.businessName,
      triggeredBy: session.name,
      webhookStatus: upstream.status,
      response: parsed,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Outreach invoke failed";
    return NextResponse.json({ success: false, error: msg }, { status: 502 });
  }
}
