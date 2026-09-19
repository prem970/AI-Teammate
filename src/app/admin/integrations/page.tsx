"use client";

import React, { useEffect, useState } from "react";
import {
  Settings2,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Server,
} from "lucide-react";

type IntegrationRow = {
  serviceName: string;
  envKey: string;
  maskedUrl: string;
  category: string;
  status: "configured" | "missing" | "reachable" | "error";
  detail?: string;
};

function maskUrl(url: string): string {
  if (!url) return "(not set)";
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}${u.pathname.slice(0, 24)}…`;
  } catch {
    return url.slice(0, 40) + "…";
  }
}

export default function AdminIntegrationsPage() {
  const [rows, setRows] = useState<IntegrationRow[]>([]);
  const [isTestingMcp, setIsTestingMcp] = useState(false);
  const [mcpHealthReport, setMcpHealthReport] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/integrations-status");
        const data = await res.json();
        setRows(data.items || []);
      } catch {
        setRows([]);
      }
    })();
  }, []);

  const handleTestMcp = async () => {
    setIsTestingMcp(true);
    setMcpHealthReport(null);
    try {
      const res = await fetch("/api/admin/test-mcp");
      const data = await res.json();
      setMcpHealthReport(data);
    } catch {
      setMcpHealthReport({ success: false, error: "Network error probing MCP" });
    } finally {
      setIsTestingMcp(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-cyan-400" /> Integrations
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Status derived from server env — not fake “Live” timestamps. MCP probe is reachability-only.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleTestMcp}
          disabled={isTestingMcp}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isTestingMcp ? "animate-spin" : ""}`} />
          Probe MCP_BASE_URL
        </button>
      </div>

      {mcpHealthReport && (
        <div
          className={`p-4 rounded-xl border text-xs font-mono ${
            mcpHealthReport.success
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/40 bg-rose-500/10 text-rose-200"
          }`}
        >
          <pre className="whitespace-pre-wrap overflow-auto">
            {JSON.stringify(mcpHealthReport, null, 2)}
          </pre>
        </div>
      )}

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.envKey}
            className="p-4 rounded-xl bg-surface border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-400" />
                <p className="text-sm text-white font-medium">{row.serviceName}</p>
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-1">
                {row.envKey} · {row.category}
              </p>
              <div className="mt-2 text-[11px] font-mono text-slate-400 break-all">
                {row.maskedUrl}
              </div>
              {row.detail && <p className="text-[11px] text-slate-400 mt-1">{row.detail}</p>}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              {row.status === "configured" || row.status === "reachable" ? (
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {row.status}
                </span>
              ) : row.status === "missing" ? (
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5" /> missing
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-300">
                  <ShieldCheck className="w-3.5 h-3.5" /> {row.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
