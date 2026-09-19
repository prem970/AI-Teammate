import React from "react";
import { Terminal, ShieldAlert, Cpu, Database } from "lucide-react";

export function OpsFooter() {
  return (
    <footer className="mt-auto border-t border-surface-border bg-[#070a12]/80 backdrop-blur-md py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3 font-mono">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>AUTONOMOUS AI OS • OPS CONSOLE</span>
            </div>
            <span>•</span>
            <span className="text-slate-500">Internal Staff Access Only</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>MCP Policy: <strong>Human Decision Required</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>RAG Ingest: <strong>n8n Ready</strong></span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">Cosmos ai_os when AZURE_* configured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
