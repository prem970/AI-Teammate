import { NextRequest, NextResponse } from "next/server";
import { listPolicies, isCosmosLive } from "@/lib/cosmos/repository";
import type { PolicyRecord } from "@/lib/opsTypes";

type SearchHit = {
  title?: string;
  content?: string;
  score?: number;
  policyVersion?: string;
  category?: string;
  docType?: string;
};

async function searchAzureIndex(query: string): Promise<SearchHit[]> {
  const endpoint = (process.env.AZURE_SEARCH_ENDPOINT || "").replace(/\/$/, "");
  const key = process.env.AZURE_SEARCH_KEY || "";
  if (!endpoint || !key) return [];

  const index = process.env.AZURE_SEARCH_INDEX || "knowledge-index";
  const url = `${endpoint}/indexes/${index}/docs/search?api-version=2023-11-01`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": key,
    },
    body: JSON.stringify({
      search: query,
      top: 8,
      select: "id,content,source,policy_id,policy_version,category,product_id,doc_type",
    }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.value || []).map((hit: Record<string, unknown>) => ({
    title: String(hit.policy_id || hit.source || hit.id || "document"),
    content: String(hit.content || "").slice(0, 900),
    score: typeof hit["@search.score"] === "number" ? hit["@search.score"] : undefined,
    policyVersion: hit.policy_version ? String(hit.policy_version) : undefined,
    category: hit.category ? String(hit.category) : undefined,
    docType: hit.doc_type ? String(hit.doc_type) : undefined,
  }));
}

function isLeadSlaQuery(q: string): boolean {
  return (
    q.includes("sla") ||
    q.includes("first-touch") ||
    q.includes("first touch") ||
    q.includes("lead") ||
    q.includes("hot inbound") ||
    q.includes("pol-sbx-lead")
  );
}

function sortPoliciesForPrecedence(policies: PolicyRecord[]): PolicyRecord[] {
  return [...policies].sort((a, b) => {
    const rank = (p: PolicyRecord) => (p.status === "active" ? 0 : p.status === "draft" ? 1 : 2);
    return rank(a) - rank(b);
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing query parameter." }, { status: 400 });
    }

    const searchHits = await searchAzureIndex(query);
    const policies = isCosmosLive() ? await listPolicies() : [];
    const q = query.toLowerCase();
    const matchedPolicies = sortPoliciesForPrecedence(
      policies.filter(
        (p) =>
          p.policyId.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.ruleSummary.toLowerCase().includes(q) ||
          (isLeadSlaQuery(q) && p.policyId === "POL-SBX-LEAD-SLA")
      )
    );

    if (searchHits.length === 0 && matchedPolicies.length === 0) {
      return NextResponse.json({
        reply:
          "No matching policy text found in Azure AI Search or Cosmos policy registry for that query. Try a policy id (e.g. POL-SBX-LEAD-SLA, PAYMENT-DUPLICATE-V2).",
        referencedPolicies: [],
        systemNotice:
          "Ops assistant only returns retrieved policy text. It does not execute payments or invent clauses.",
        dataOrigin: {
          search: Boolean(process.env.AZURE_SEARCH_ENDPOINT && process.env.AZURE_SEARCH_KEY),
          cosmos: isCosmosLive(),
        },
        timestamp: new Date().toISOString(),
      });
    }

    const parts: string[] = [];
    const activeLeadSla = matchedPolicies.find(
      (p) => p.policyId === "POL-SBX-LEAD-SLA" && p.status === "active"
    );
    const supersededLeadSla = matchedPolicies.find(
      (p) => p.policyId === "POL-SBX-LEAD-SLA" && p.status !== "active"
    );

    if (activeLeadSla || isLeadSlaQuery(q)) {
      parts.push("### Precedence (current policy wins)");
      if (activeLeadSla) {
        parts.push(
          `**Use now:** ${activeLeadSla.policyId} ${activeLeadSla.version} (${activeLeadSla.status})\n` +
            `${activeLeadSla.ruleSummary}\n` +
            `Resolved cases under older versions are examples only — do not apply their SLA numbers to new issues.`
        );
      } else {
        parts.push(
          "Current policy beats historical cases. Prefer the newest active POL-SBX-LEAD-SLA version over resolved-case text."
        );
      }
      if (supersededLeadSla) {
        parts.push(
          `**Historical (do not apply to new issues):** ${supersededLeadSla.policyId} ${supersededLeadSla.version} — ${supersededLeadSla.title}`
        );
      }
    }

    const policyHits = searchHits.filter((h) => h.docType !== "resolved_case" && h.category !== "resolved_case");
    const caseHits = searchHits.filter((h) => h.docType === "resolved_case" || h.category === "resolved_case");

    if (policyHits.length) {
      parts.push("### Azure AI Search — policy docs");
      for (const hit of policyHits) {
        const ver = hit.policyVersion ? ` ${hit.policyVersion}` : "";
        parts.push(
          `**${hit.title}${ver}**${hit.score != null ? ` (score ${hit.score.toFixed(2)})` : ""}\n${hit.content}`
        );
      }
    }
    if (caseHits.length) {
      parts.push("### Azure AI Search — resolved cases (examples only)");
      for (const hit of caseHits) {
        const ver = hit.policyVersion ? ` under policy ${hit.policyVersion}` : "";
        parts.push(
          `**${hit.title}${ver}**${hit.score != null ? ` (score ${hit.score.toFixed(2)})` : ""}\n${hit.content}`
        );
      }
    }
    // leftover hits without doc_type
    const other = searchHits.filter((h) => !policyHits.includes(h) && !caseHits.includes(h));
    if (other.length && !policyHits.length) {
      parts.push("### Azure AI Search hits");
      for (const hit of other) {
        parts.push(`**${hit.title}**${hit.score != null ? ` (score ${hit.score.toFixed(2)})` : ""}\n${hit.content}`);
      }
    }

    if (matchedPolicies.length) {
      parts.push("### Cosmos policy registry");
      for (const p of matchedPolicies.slice(0, 6)) {
        parts.push(
          `**${p.policyId}** ${p.version} — ${p.title}\nStatus: ${p.status}\n${p.ruleSummary}`
        );
      }
    }

    return NextResponse.json({
      reply: parts.join("\n\n"),
      referencedPolicies: [
        ...searchHits.map((h) => `${h.title}${h.policyVersion ? ` ${h.policyVersion}` : ""}`),
        ...matchedPolicies.map((p) => `${p.policyId} (${p.version}) [${p.status}]`),
      ],
      systemNotice:
        "Retrieved from configured Search/Cosmos only. Current policy beats historical cases. Payment execution disabled here.",
      dataOrigin: {
        search: searchHits.length > 0,
        cosmos: matchedPolicies.length > 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
