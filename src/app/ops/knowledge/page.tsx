import React from "react";
import Link from "next/link";
import { listPolicies, isCosmosLive } from "@/lib/cosmos/repository";
import { Database, FileCode2, Upload, ArrowRight } from "lucide-react";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";

export default async function OpsKnowledgeOverviewPage() {
  const origin = isCosmosLive() ? "cosmos" : "unavailable";
  const policies = origin === "cosmos" ? await listPolicies() : [];
  const activeCount = policies.filter((p) => p.status === "active").length;
  const searchConfigured = Boolean(
    process.env.AZURE_SEARCH_ENDPOINT && process.env.AZURE_SEARCH_KEY
  );

  return (
    <div className="space-y-6">
      <DataOriginBanner origin={origin} />
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Knowledge overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
          Policy registry count from Cosmos. Vectors are in Azure AI Search when ingest succeeds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-surface-border bg-surface">
          <Database className="w-4 h-4 text-cyan-400 mb-2" />
          <p className="text-[11px] font-mono text-slate-500">Cosmos policies</p>
          <p className="text-2xl font-display font-bold text-white">{policies.length}</p>
          <p className="text-xs text-slate-400 mt-1">{activeCount} active</p>
        </div>
        <div className="p-4 rounded-xl border border-surface-border bg-surface">
          <FileCode2 className="w-4 h-4 text-purple-400 mb-2" />
          <p className="text-[11px] font-mono text-slate-500">Azure AI Search</p>
          <p className="text-sm text-white mt-2">
            {searchConfigured ? "Credentials configured" : "Not configured"}
          </p>
          <p className="text-xs text-slate-400 mt-1">Index: knowledge-index (via n8n)</p>
        </div>
        <div className="p-4 rounded-xl border border-surface-border bg-surface">
          <Upload className="w-4 h-4 text-amber-400 mb-2" />
          <p className="text-[11px] font-mono text-slate-500">Ingest path</p>
          <Link href="/ops/policies/upload" className="text-sm text-cyan-300 inline-flex items-center gap-1 mt-2">
            Upload policy <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
