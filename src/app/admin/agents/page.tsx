import React from "react";
import Link from "next/link";
import { MOCK_AGENTS } from "@/lib/adminMockData";
import {
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Layers,
  Activity,
  Lock,
  Radio,
} from "lucide-react";

export default function AdminAgentsRegistryPage() {
  const csAgents = MOCK_AGENTS.filter((a) => a.category === "Customer Support" || a.category === "Core Orchestrator");
  const salesAgents = MOCK_AGENTS.filter((a) => a.category === "Sales Ops");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Specialist Agent Registry & Least-Privilege Matrix
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              11 Registered Nodes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Least-privilege tool allowlists, stage ownership assignments, and Model Context Protocol (MCP) bindings.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Zero Mesh Lines Enforced
          </span>
        </div>
      </div>

      {/* Customer Support Specialists Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display text-lg font-bold text-white">
              Customer Support Specialist Fleet ({csAgents.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Hub: Autonomous CS Supervisor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {csAgents.map((agent) => (
            <div
              key={agent.id}
              className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-base text-white">
                      {agent.name}
                    </h3>
                    <p className="text-[11px] font-mono text-cyan-400">
                      MCP ID: <code className="text-white">{agent.mcpAgentId}</code>
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-300 uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {agent.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {agent.purpose}
                </p>

                {/* Stage Ownership */}
                <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border text-xs font-mono">
                  <span className="text-slate-500 text-[10px] uppercase block">Stage Domain:</span>
                  <span className="text-slate-200">{agent.stageOwnership}</span>
                </div>

                {/* Allowed Tools Summary */}
                <div className="space-y-1.5 font-mono text-xs">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">
                    Allowed MCP Tools ({agent.allowedTools.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.allowedTools.map((t) => (
                      <span
                        key={t.toolName}
                        className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[11px]"
                      >
                        ✓ {t.toolName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prohibited Preview */}
                <div className="pt-2 border-t border-surface-border/60 text-[11px] font-mono text-slate-400">
                  <span className="text-rose-400 font-semibold">Does NOT have: </span>
                  <span>{agent.prohibitedTools[0]?.toolName}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Workflow: {agent.n8nWorkflowRef}
                </span>

                <Link
                  href={`/admin/agents/${agent.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-white font-semibold transition-colors"
                >
                  <span>Inspect Security Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sales Multi-Agent System Section */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display text-lg font-bold text-white">
              Sales Multi-Agent Pipeline Fleet ({salesAgents.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Strict Sequential Handoffs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {salesAgents.map((agent) => (
            <div
              key={agent.id}
              className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-base text-white">
                      {agent.name}
                    </h3>
                    <p className="text-[11px] font-mono text-emerald-400">
                      MCP ID: <code className="text-white">{agent.mcpAgentId}</code>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-300 uppercase">
                    {agent.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {agent.purpose}
                </p>

                <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border text-xs font-mono">
                  <span className="text-slate-500 text-[10px] uppercase block">Stage Domain:</span>
                  <span className="text-emerald-300 font-semibold">{agent.stageOwnership}</span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">
                    Allowed Tools ({agent.allowedTools.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.allowedTools.map((t) => (
                      <span
                        key={t.toolName}
                        className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[11px]"
                      >
                        ✓ {t.toolName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {agent.avgLatencyMs}ms avg
                </span>

                <Link
                  href={`/admin/agents/${agent.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-300 hover:text-white font-semibold transition-colors"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
