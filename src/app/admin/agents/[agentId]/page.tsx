import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_AGENTS } from "@/lib/adminMockData";
import {
  ArrowLeft,
  Cpu,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  ExternalLink,
  Activity,
  Layers,
} from "lucide-react";

interface AgentDetailPageProps {
  params: {
    agentId: string;
  };
}

export default function AdminAgentDetailPage({ params }: AgentDetailPageProps) {
  const agent = MOCK_AGENTS.find(
    (a) => a.id.toLowerCase() === params.agentId.toLowerCase()
  );

  if (!agent) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/agents"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agents Registry</span>
        </Link>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
          MCP Identity: {agent.mcpAgentId}
        </span>
      </div>

      {/* Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold text-white">
                  {agent.name}
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold uppercase">
                  {agent.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Category: <strong className="text-white">{agent.category}</strong> • Workflow: <code className="text-cyan-300">{agent.n8nWorkflowRef}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300 text-right">
            <div>
              <p className="text-slate-500 text-[10px] uppercase">24h Requests</p>
              <p className="font-bold text-white text-base">{agent.requests24h.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase">Avg Latency</p>
              <p className="font-bold text-cyan-300 text-base">{agent.avgLatencyMs}ms</p>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed pt-2 border-t border-surface-border">
          {agent.purpose}
        </p>
      </div>

      {/* MCP Enforcement Story Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-surface to-surface-secondary border border-amber-500/40 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>MCP Least-Privilege Enforcement Story</span>
        </div>
        <p className="text-xs text-slate-200 font-sans leading-relaxed">
          {agent.enforcementStory} When this agent requests any tool, the Model Context Protocol (MCP) gateway cross-references the caller&apos;s cryptographically verified <code className="text-amber-300 font-mono">agent_id ({agent.mcpAgentId})</code> against its permission manifest. If an unapproved tool is requested, MCP terminates execution with <code className="text-rose-400 font-mono">AGENT_FORBIDDEN_TOOL_CALL</code>.
        </p>
      </div>

      {/* Allowed vs Prohibited Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Allowed Tools Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-surface border border-surface-border overflow-hidden">
          <div className="p-4 bg-surface-secondary/70 border-b border-surface-border flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Allowed Tools ({agent.allowedTools.length})
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Approved in MCP Manifest
            </span>
          </div>

          <div className="divide-y divide-surface-border/60 font-mono text-xs">
            {agent.allowedTools.map((t) => (
              <div key={t.toolName} className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <code className="text-white font-bold">{t.toolName}</code>
                  <span className="px-2 py-0.2 rounded text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                    SCOPE: {t.actionScope}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Prohibited Tools / Does NOT have (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-surface border border-rose-500/30 overflow-hidden">
          <div className="p-4 bg-rose-950/20 border-b border-rose-500/30 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-300 uppercase flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-rose-400" />
              Explicitly Prohibited Tools
            </span>
            <span className="text-[10px] font-mono text-rose-400">
              DENY Enforced
            </span>
          </div>

          <div className="divide-y divide-surface-border/60 font-mono text-xs">
            {agent.prohibitedTools.map((t) => (
              <div key={t.toolName} className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <code className="text-rose-300 font-bold">{t.toolName}</code>
                  <span className="text-[10px] text-rose-400 font-bold">BLOCKED</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  <strong>Why Blocked:</strong> {t.whyBlocked}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
