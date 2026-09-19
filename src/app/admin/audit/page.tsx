import React from "react";
import Link from "next/link";
import { MOCK_AUDIT_LOGS } from "@/lib/adminMockData";
import {
  FileClock,
  ShieldCheck,
  AlertTriangle,
  Info,
  Lock,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function AdminAuditLogPage() {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
      case "WARNING":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold";
      case "INFO":
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-slate-700 text-slate-300 border-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Security & Workflow Immutable Audit Trail
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              Audit Ring 0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Chronological record of MCP tool allowances, security blocks, policy promotions, and role adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>Compliance: <strong className="text-emerald-400">RBI & SOC2 Compliant</strong></span>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-secondary/80 border-b border-surface-border text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Target / Resource</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {MOCK_AUDIT_LOGS.map((evt) => (
                <tr key={evt.id} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-300">
                    {evt.id}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {evt.timestamp}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] uppercase border ${getSeverityBadge(
                        evt.severity
                      )}`}
                    >
                      {evt.severity}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-white">
                    {evt.actor}
                  </td>

                  <td className="py-3.5 px-4 text-cyan-300">
                    {evt.action}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {evt.target}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-sans text-[11px] max-w-md">
                    {evt.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
