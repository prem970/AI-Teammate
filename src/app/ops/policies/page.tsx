import React from "react";
import Link from "next/link";
import { getCurrentOpsSession } from "@/lib/opsAuth";
import { listPolicies, isCosmosLive } from "@/lib/cosmos/repository";
import {
  FileCode2,
  Upload,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";

export default async function OpsPoliciesPage() {
  const session = await getCurrentOpsSession();
  const origin = isCosmosLive() ? "cosmos" : "unavailable";
  const policies = origin === "cosmos" ? await listPolicies() : [];

  return (
    <div className="space-y-6">
      <DataOriginBanner origin={origin} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Policy registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Cosmos policies container (version registry). Vector chunks live in Azure AI Search via n8n ingest.
          </p>
        </div>
        <Link
          href="/ops/policies/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold"
        >
          <Upload className="w-4 h-4" />
          Ingest markdown (n8n RAG)
        </Link>
      </div>

      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-xs font-bold font-mono text-purple-300 uppercase">
            Current policy beats historical cases
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Role: {session?.role}. Registry status is separate from Search embeddings — promote Cosmos
            active version when you ingest a new doc.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {policies.map((policy) => (
          <div
            key={`${policy.policyId}-${policy.version}`}
            className="p-5 rounded-2xl bg-surface border border-surface-border"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-purple-300" />
                <span className="font-mono text-sm text-white">
                  {policy.policyId} · {policy.version}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-surface-border text-slate-400">
                  {policy.status}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{policy.product}</span>
            </div>
            <h2 className="font-display text-lg text-white mt-2">{policy.title}</h2>
            <p className="text-xs text-slate-400 mt-1">{policy.ruleSummary}</p>
          </div>
        ))}
        {policies.length === 0 && (
          <p className="text-sm text-slate-500">No policies in Cosmos.</p>
        )}
      </div>

      <Link href="/ops/knowledge" className="inline-flex items-center gap-1 text-xs text-cyan-300">
        Knowledge overview <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
