import React from "react";
import Link from "next/link";
import { MOCK_TRACES } from "@/lib/adminMockData";
import {
  Activity,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Filter,
} from "lucide-react";

export default function AdminTracesListPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Orchestrator Execution Traces
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              Distributed Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            End-to-end multi-agent execution paths, MCP tool evaluations (ALLOW/DENY), and resolution decisions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Sample Trace Catalog (not live ingress)
          </span>
        </div>
      </div>

      {/* Traces Table / List */}
      <div className="rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-secondary/80 border-b border-surface-border text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Trace ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Classified Intent</th>
                <th className="py-3 px-4">Agents Called</th>
                <th className="py-3 px-4">Decision</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {MOCK_TRACES.map((trc) => {
                const isDeny = trc.decision === "blocked_by_policy";
                const isEscalate = trc.decision === "escalated_to_human";

                return (
                  <tr
                    key={trc.traceId}
                    className={`hover:bg-surface-secondary/50 transition-colors ${
                      isDeny ? "bg-rose-950/10" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/traces/${trc.traceId}`}
                        className="font-bold text-white hover:text-cyan-400"
                      >
                        {trc.traceId}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 text-cyan-300">
                      {trc.customerId}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-semibold">
                        {trc.intent}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {trc.agentsCalled.map((ag) => (
                          <span
                            key={ag}
                            className="px-1.5 py-0.2 rounded bg-surface-secondary text-[10px] text-slate-300 border border-surface-border truncate"
                          >
                            {ag.split(" ")[0]}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          isDeny
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                            : isEscalate
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {trc.decision.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {trc.latencyMs}ms
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {trc.timestamp}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/traces/${trc.traceId}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-cyan-300 border border-surface-border text-xs transition-colors"
                      >
                        <span>Timeline</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
