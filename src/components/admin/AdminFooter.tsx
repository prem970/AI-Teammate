import React from "react";
import { Server, ShieldCheck, Zap, Activity } from "lucide-react";

export function AdminFooter() {
  return (
    <footer className="mt-auto border-t border-surface-border bg-[#040711]/80 backdrop-blur-md py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3 font-mono">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Server className="w-3.5 h-3.5" />
              <span>AUTONOMOUS AI OS • PLATFORM ADMIN</span>
            </div>
            <span>•</span>
            <span className="text-slate-500">Least-Privilege Model Context Protocol Gateway</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>MCP Invariant: <strong>Hub-and-Spoke Enforced</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cluster Uptime: <strong>99.98%</strong></span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300">Security Ring 0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
