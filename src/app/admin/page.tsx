import React from "react";
import Link from "next/link";
import { getCurrentAdminSession } from "@/lib/adminAuth";
import { MOCK_PLATFORM_KPIS, MOCK_AGENTS, MOCK_TRACES } from "@/lib/adminMockData";
import {
  Activity,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Server,
  Layers,
  ExternalLink,
} from "lucide-react";
import { AgentTopologyMap } from "@/components/admin/AgentTopologyMap";

export default async function AdminHomePage() {
  const session = await getCurrentAdminSession();
  const kpis = MOCK_PLATFORM_KPIS;
  const recentTraces = MOCK_TRACES.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <section className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#070c18] via-[#091122] to-[#040813] border border-surface-border overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                PLATFORM ACTIVE • RING 0
              </span>
              <span className="text-xs font-mono text-slate-400 bg-surface-secondary px-2.5 py-1 rounded border border-surface-border">
                Admin: <strong className="text-white">{session?.name}</strong>
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Platform Command Center & <span className="text-gradient-cyan">MCP Health</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl font-sans">
              Comprehensive telemetry across all 11 autonomous agents, real-time Model Context Protocol (MCP) allow/deny verification, and orchestrator execution traces.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
            <Link
              href="/admin/mcp"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all group"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Inspect MCP Gateway</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Core KPIs Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Requests 24h */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>24h Orchestrator Requests</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="font-mono text-3xl font-bold text-white">
            {kpis.requests24h.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <span>↑ 14.2%</span> <span className="text-slate-500">vs yesterday</span>
          </p>
        </div>

        {/* Escalation Rate */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Human Escalation Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-mono text-3xl font-bold text-white">
            {(kpis.escalationRate * 100).toFixed(1)}%
          </p>
          <p className="text-[11px] font-mono text-slate-400">
            Target SLA: &lt; 5.0% (Passing)
          </p>
        </div>

        {/* Avg Latency */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Avg Orchestrator Latency</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="font-mono text-3xl font-bold text-white">
            {kpis.avgOrchestratorLatencyMs}ms
          </p>
          <p className="text-[11px] font-mono text-emerald-400">
            p99 latency: 310ms (Healthy)
          </p>
        </div>

        {/* MCP Allow vs Deny */}
        <div className="p-5 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>MCP Tool Calls (24h)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-3xl font-bold text-emerald-400">
              {kpis.mcpAllowCount24h.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-rose-400 font-semibold">
              / {kpis.mcpDenyCount24h} DENY
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Strict single security boundary active
          </p>
        </div>
      </section>

      {/* Hub-and-Spoke Topology Visualizer */}
      <AgentTopologyMap />

      {/* Recent Traces Spotlight */}
      <section className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display text-base font-bold text-white">
              Recent Orchestration Traces
            </h2>
          </div>
          <Link
            href="/admin/traces"
            className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1"
          >
            <span>View All Traces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-surface-border/60 font-mono text-xs">
          {recentTraces.map((trc) => (
            <div
              key={trc.traceId}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-secondary/50 px-2 rounded-lg transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{trc.traceId}</span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold border ${
                      trc.decision === "auto_resolved"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : trc.decision === "escalated_to_human"
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                    }`}
                  >
                    {trc.decision.replace(/_/g, " ")}
                  </span>
                  <span className="text-slate-500 text-[11px]">({trc.latencyMs}ms)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Customer: {trc.customerId} • Intent: <strong className="text-slate-200">{trc.intent}</strong>
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <span className="text-[11px] text-slate-500">{trc.timestamp}</span>
                <Link
                  href={`/admin/traces/${trc.traceId}`}
                  className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-cyan-300 border border-surface-border text-xs transition-colors"
                >
                  Inspect
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
