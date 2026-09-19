import { NextResponse } from "next/server";

function present(key: string): boolean {
  return Boolean(process.env[key]?.trim());
}

function mask(url: string): string {
  if (!url) return "(not set)";
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}${u.pathname.length > 1 ? u.pathname.slice(0, 28) + "…" : ""}`;
  } catch {
    return "(invalid url)";
  }
}

export async function GET() {
  const items = [
    {
      serviceName: "Railway MCP Gateway",
      envKey: "MCP_BASE_URL",
      maskedUrl: mask(process.env.MCP_BASE_URL || ""),
      category: "Tool Boundary",
      status: present("MCP_BASE_URL") ? "configured" : "missing",
      detail: "Use Probe button for reachability",
    },
    {
      serviceName: "n8n CS Orchestrator",
      envKey: "N8N_CS_ORCHESTRATOR_URL",
      maskedUrl: mask(process.env.N8N_CS_ORCHESTRATOR_URL || ""),
      category: "Workflow",
      status: present("N8N_CS_ORCHESTRATOR_URL") ? "configured" : "missing",
    },
    {
      serviceName: "n8n RAG Ingest",
      envKey: "N8N_RAG_INGEST_URL",
      maskedUrl: mask(process.env.N8N_RAG_INGEST_URL || ""),
      category: "Workflow",
      status: present("N8N_RAG_INGEST_URL") ? "configured" : "missing",
    },
    {
      serviceName: "n8n HIL Decision Resume",
      envKey: "N8N_HIL_RESUME_URL",
      maskedUrl: mask(process.env.N8N_HIL_RESUME_URL || ""),
      category: "Workflow",
      status: present("N8N_HIL_RESUME_URL") ? "configured" : "missing",
      detail: "Ops PATCH → Cosmos + this webhook",
    },
    {
      serviceName: "Azure Cosmos DB",
      envKey: "AZURE_COSMOS_ENDPOINT",
      maskedUrl: mask(process.env.AZURE_COSMOS_ENDPOINT || ""),
      category: "Data",
      status:
        present("AZURE_COSMOS_ENDPOINT") && present("AZURE_COSMOS_KEY")
          ? "configured"
          : "missing",
      detail: `DB=${process.env.AZURE_COSMOS_DATABASE || "ai_os"}`,
    },
    {
      serviceName: "Azure AI Search",
      envKey: "AZURE_SEARCH_ENDPOINT",
      maskedUrl: mask(process.env.AZURE_SEARCH_ENDPOINT || ""),
      category: "Search",
      status:
        present("AZURE_SEARCH_ENDPOINT") && present("AZURE_SEARCH_KEY")
          ? "configured"
          : "missing",
    },
    {
      serviceName: "Azure OpenAI",
      envKey: "AZURE_OPENAI_ENDPOINT",
      maskedUrl: mask(process.env.AZURE_OPENAI_ENDPOINT || ""),
      category: "AI",
      status:
        present("AZURE_OPENAI_ENDPOINT") && present("AZURE_OPENAI_KEY")
          ? "configured"
          : "missing",
      detail: "Used by n8n/MCP agents — not called directly by most UI routes",
    },
  ];

  return NextResponse.json({ success: true, items });
}
