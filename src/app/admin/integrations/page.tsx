"use client";

import React, { useState } from "react";
import {
  Settings2,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Server,
  Zap,
  Lock,
  ExternalLink,
} from "lucide-react";
import { MOCK_INTEGRATIONS } from "@/lib/adminMockData";
import { MaskedEndpointRow } from "@/components/admin/MaskedEndpointRow";

export default function AdminIntegrationsPage() {
  const [integrations] = useState(MOCK_INTEGRATIONS);
  const [isTestingMcp, setIsTestingMcp] = useState(false);
  const [mcpHealthReport, setMcpHealthReport] = useState<any | null>(null);

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Platform Integration Pointers & Infrastructure
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              Environment Controlled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Read-only pointers to Model Context Protocol (MCP) gateway, n8n orchestrators, and Azure services.
          </p>
        </div>

        <button
          onClick={handleTestMcp}
          disabled={isTestingMcp}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isTestingMcp ? "animate-spin" : ""}`} />
          <span>{isTestingMcp ? "Probing MCP Gateway..." : "Test MCP Health Probe"}</span>
        </button>
      </div>

      {/* Security Read-Only Notice */}
      <div className="p-4 rounded-xl bg-[#090e1a] border border-cyan-500/30 flex items-start gap-3 text-xs font-mono text-slate-300 shadow-md">
        <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-cyan-300 uppercase text-[11px]">
            Security Policy: Production endpoints are read-only pointers. Edit strictly via `.env` configuration.
          </p>
          <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
            Secrets, API tokens, and connection strings are strictly consumed server-side and never sent to browser DOM. Endpoints are displayed with token masking.
          </p>
        </div>
      </div>

      {/* Live Probe Result Drawer if triggered */}
      {mcpHealthReport && (
        <div
          className={`p-6 rounded-2xl border font-mono text-xs animate-page-enter space-y-3 ${
            mcpHealthReport.success
              ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/20 border-rose-500/40 text-rose-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              {mcpHealthReport.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              )}
              <span>MCP Protocol Health Probe: {mcpHealthReport.status}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Roundtrip: {mcpHealthReport.latencyMs}ms
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-500/20 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-500 uppercase block text-[10px]">MCP URL</span>
              <code className="text-white">{mcpHealthReport.url}</code>
            </div>
            <div>
              <span className="text-slate-500 uppercase block text-[10px]">Protocol Spec</span>
              <span className="text-cyan-300">{mcpHealthReport.protocolVersion}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase block text-[10px]">Tools Registered</span>
              <span className="text-emerald-400 font-bold">{mcpHealthReport.registeredToolsCount} Tools</span>
            </div>
          </div>
        </div>
      )}

      {/* Endpoints List */}
      <div className="space-y-3">
        {integrations.map((item) => (
          <MaskedEndpointRow key={item.envKey} item={item} />
        ))}
      </div>
    </div>
  );
}
