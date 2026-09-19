import React from "react";
import Link from "next/link";
import {
  Database,
  FileCode2,
  Bot,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Upload,
} from "lucide-react";
import { MOCK_POLICIES } from "@/lib/opsMockData";

export default function OpsKnowledgeOverviewPage() {
  const activeCount = MOCK_POLICIES.filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Knowledge Base & Vector Store
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              RAG Corpus
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Central semantic repository powering autonomous supervisor reasoning and policy compliance checks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/ops/policies/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold shadow-md transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Ingest Markdown</span>
          </Link>
          <Link
            href="/ops/assistant"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold shadow-md transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Query Assistant</span>
          </Link>
        </div>
      </div>

      {/* Vector Collections Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Target Collection</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          <p className="text-lg font-mono font-bold text-white">autonomous_policies_rag</p>
          <p className="text-xs text-slate-400 font-sans">
            Holds vector embeddings for payment dispute policies and hardware SLAs.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Active Policies: {activeCount}</span>
            <span>Dimensions: 1536d</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Upstream Pipeline</span>
            <span className="text-purple-400 font-bold">n8n READY</span>
          </div>
          <p className="text-lg font-mono font-bold text-white">N8N_RAG_INGEST_URL</p>
          <p className="text-xs text-slate-400 font-sans">
            Webhook receiver executing markdown chunking and embedding tokenization.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Chunk Size: 450 tokens</span>
            <span>Overlap: 50 tokens</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Precedence Standard</span>
            <span className="text-amber-400 font-bold">ENFORCED</span>
          </div>
          <p className="text-lg font-mono font-bold text-white">Strict Active Priority</p>
          <p className="text-xs text-slate-400 font-sans">
            Current verified policy version strictly supersedes deprecated historical precedents.
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Cosmos Store: Synced</span>
            <span>Safety Guard: Active</span>
          </div>
        </div>
      </div>

      {/* Directory of Ingested Documents */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-purple-400" />
            <h2 className="font-display text-base font-bold text-white">
              Indexed Regulatory Documents in Store
            </h2>
          </div>
          <Link
            href="/ops/policies"
            className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1"
          >
            <span>View Full Policies Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {MOCK_POLICIES.map((p) => (
            <div
              key={p.policyId}
              className="p-3.5 rounded-xl bg-surface-secondary/70 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{p.policyId}</span>
                  <span className="px-2 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                    {p.version}
                  </span>
                  <span className="text-slate-500 text-[11px]">• {p.product}</span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans mt-0.5">{p.title}</p>
              </div>

              <div className="text-right shrink-0 text-slate-500 text-[11px]">
                <span>Ingested: {p.lastIngestedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
