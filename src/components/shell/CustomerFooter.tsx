import React from "react";
import { Terminal, Shield, Zap } from "lucide-react";

export function CustomerFooter() {
  return (
    <footer className="mt-auto border-t border-surface-border bg-surface/60 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300 font-mono">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>AUTONOMOUS AI OS</span>
            </div>
            <span>•</span>
            <span>Paytm Merchant Operations & Support</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Orchestrator Latency: <strong>~180ms</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Self-Serve Policy: <strong>POL-AUTO-DISPUTE-V2.4</strong></span>
            </div>
            <span className="text-slate-500 font-mono">Customer Role Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
