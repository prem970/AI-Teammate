"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  Lock,
} from "lucide-react";
import { Trace } from "@/lib/adminTypes";

interface TraceTimelineViewProps {
  trace: Trace;
}

export function TraceTimelineView({ trace }: TraceTimelineViewProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ALLOW":
      case "SUCCESS":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "DENY":
        return "bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold animate-pulse";
      case "WARNING":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      default:
        return "bg-slate-700/40 text-slate-300 border-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-surface-border">
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400">
            Execution Flow Sequence
          </span>
          <p className="font-mono text-sm font-bold text-white">
            {trace.steps.length} Steps Processed in {trace.latencyMs}ms
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Final Decision:</span>
          <span
            className={`px-2.5 py-0.5 rounded font-bold uppercase border ${
              trace.decision === "auto_resolved"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : trace.decision === "escalated_to_human"
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                : "bg-rose-500/15 text-rose-300 border-rose-500/30"
            }`}
          >
            {trace.decision.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Vertical Steps */}
      <div className="relative border-l-2 border-surface-border ml-4 space-y-6 pl-6">
        {trace.steps.map((step, idx) => {
          const isDeny = step.status === "DENY";

          return (
            <div key={step.stepNumber} className="relative space-y-2 animate-page-enter">
              {/* Step indicator node */}
              <div
                className={`absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-[#040711] ${
                  isDeny ? "bg-rose-500 animate-ping" : "bg-cyan-400"
                }`}
              />

              {/* Step Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isDeny
                    ? "bg-rose-950/20 border-rose-500/50"
                    : "bg-surface border-surface-border hover:border-surface-borderHover"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-border/60">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400 font-bold">Step {step.stepNumber}:</span>
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                      {step.phase}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-cyan-300 text-[11px]">{step.agent}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-400">{step.durationMs}ms</span>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold border ${getStatusBadge(
                        step.status
                      )}`}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block mb-0.5">
                      Input & Context:
                    </span>
                    <p className="text-slate-300 bg-surface-secondary/70 p-2.5 rounded-lg border border-surface-border">
                      {step.inputSummary}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block mb-0.5">
                      Output / MCP Evaluation:
                    </span>
                    <p
                      className={`p-2.5 rounded-lg border font-semibold ${
                        isDeny
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                          : "bg-surface-secondary/70 border-surface-border text-slate-200"
                      }`}
                    >
                      {step.outputSummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
