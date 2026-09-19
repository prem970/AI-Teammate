import React from "react";
import Link from "next/link";
import { getCurrentOpsSession } from "@/lib/opsAuth";
import { MOCK_POLICIES } from "@/lib/opsMockData";
import {
  FileCode2,
  Upload,
  ShieldCheck,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  Database,
  ExternalLink,
} from "lucide-react";

export default async function OpsPoliciesPage() {
  const session = await getCurrentOpsSession();
  const isPolicyOwner = session?.role === "policy_owner";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              AI Policy Governance & Standard Rules
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-xs font-mono text-purple-300">
              RAG Vector Index
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Active compliance rules governing autonomous supervisors, switch reconciliation, and hardware latency thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/ops/policies/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Ingest Policy Markdown</span>
          </Link>
        </div>
      </div>

      {/* Governing Precedence Banner */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-start gap-3.5 shadow-md">
        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-bold font-mono text-purple-300 uppercase tracking-wide">
            Autonomous Precedence Principle: Current policy beats historical cases.
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
            When autonomous agents evaluate merchant disputes or hardware latency spikes, vector search retrieves active policies from the RAG store. The latest verified policy version strictly supersedes any past precedent or deprecated historical practice.
          </p>
        </div>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {MOCK_POLICIES.map((policy) => {
          const isActive = policy.status === "active";

          return (
            <div
              key={policy.policyId}
              className={`p-6 rounded-2xl bg-surface border transition-all ${
                isActive
                  ? "border-surface-border hover:border-purple-500/40"
                  : "border-surface-border/50 opacity-60 bg-surface/50"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-base font-bold text-white">
                      {policy.policyId}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                      {policy.version}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase font-semibold border ${
                        isActive
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-700/50 text-slate-400 border-slate-600"
                      }`}
                    >
                      {policy.status}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-slate-400">
                      Effective: {policy.effectiveDate}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-100">
                    {policy.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-4xl">
                    {policy.ruleSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                    <span>
                      Product: <strong className="text-white">{policy.product}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Category: <strong className="text-slate-300">{policy.category}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Indexed by: <strong className="text-purple-400">{policy.ingestedBy}</strong>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href={`/ops/policies/upload?policy_id=${policy.policyId}&product_id=${policy.product}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-purple-300 border border-surface-border text-xs font-mono transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Re-Ingest Version</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
