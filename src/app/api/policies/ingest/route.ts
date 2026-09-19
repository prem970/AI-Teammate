import { NextRequest, NextResponse } from "next/server";
import { PolicyIngestRequest } from "@/lib/opsTypes";

export async function POST(request: NextRequest) {
  try {
    const body: PolicyIngestRequest = await request.json();
    const { source, policy_id, policy_version, product_id, category, doc_type, content } = body;

    if (!policy_id || !content || !product_id) {
      return NextResponse.json(
        { error: "Missing required fields: policy_id, product_id, and content are mandatory." },
        { status: 400 }
      );
    }

    const n8nIngestUrl = process.env.N8N_RAG_INGEST_URL;

    if (n8nIngestUrl && n8nIngestUrl.trim().length > 0) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        const upstreamRes = await fetch(n8nIngestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Application": "Autonomous-AI-OS-Ops-Ingest",
          },
          // Match n8n rag-ingest-azure-ai-search webhook field names
          body: JSON.stringify({
            text: content,
            content,
            source: source || "ops_policy_upload",
            policy_id,
            policy_version: policy_version || "v1.0.0",
            product_id,
            category: category || "policy",
            doc_type: doc_type || "markdown",
            index_name: "knowledge-index",
            timestamp: new Date().toISOString(),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!upstreamRes.ok) {
          const errText = await upstreamRes.text();
          return NextResponse.json(
            { error: `Upstream N8N_RAG_INGEST_URL returned status ${upstreamRes.status}: ${errText}` },
            { status: 502 }
          );
        }

        const upstreamData = await upstreamRes.json();
        return NextResponse.json({
          success: true,
          message: "Policy ingested and vector indexed in n8n RAG pipeline.",
          details: upstreamData,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Network error";
        return NextResponse.json(
          { error: `Failed to communicate with N8N_RAG_INGEST_URL: ${errorMsg}` },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "N8N_RAG_INGEST_URL is not configured. Refusing to claim vector embed success without calling the ingest webhook.",
      },
      { status: 503 }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { error: `Internal error processing policy ingest: ${errorMsg}` },
      { status: 500 }
    );
  }
}
