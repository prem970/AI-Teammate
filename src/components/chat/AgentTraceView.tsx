"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Cpu, ShieldCheck, Zap, Layers } from "lucide-react";
import { AgentTrace } from "@/lib/types";

interface AgentTraceViewProps {
  trace: AgentTrace;
}

export function AgentTraceView({ trace }: AgentTraceViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3 rounded-lg border border-cyan-500/25 bg-surface-secondary/70 overflow-hidden text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between bg-surface-elevated/40 hover:bg-surface-elevated/70 text-cyan-300 transition-colors font-mono text-[11px]"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold uppercase tracking-wider">Autonomous Orchestration Trace</span>
          <span className="px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 text-[10px]">
            {trace.intent}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="hidden sm:inline text-[10px]">{trace.latencyMs}ms</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 space-y-3 font-mono text-xs border-t border-cyan-500/20 bg-surface/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">
                Intent Recognized
              </p>
              <p className="text-cyan-300 font-bold">{trace.intent}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">
                Autonomous Decision
              </p>
              <p className="text-emerald-300 font-semibold">{trace.decision}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              Subagents Coordinated
            </p>
            <div className="flex flex-wrap gap-1.5">
              {trace.agentsInvolved.map((agent, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-surface-secondary border border-surface-border text-[11px] text-slate-200"
                >
                  ⚡ {agent}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-surface-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Policy: <strong className="text-slate-200">{trace.policyId}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Confidence: <strong className="text-slate-200">{(trace.confidence * 100).toFixed(0)}%</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
