import React from "react";
import { OrderStatus, DeviceStatus, EscalationStatus, EscalationPriority } from "@/lib/types";

interface StatusBadgeProps {
  type: "order" | "device" | "escalation" | "priority";
  value: string;
}

export function StatusBadge({ type, value }: StatusBadgeProps) {
  if (type === "order") {
    const status = value as OrderStatus;
    switch (status) {
      case "settled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Settled
          </span>
        );
      case "disputed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/40 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Disputed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/15 text-slate-400 border border-slate-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Refunded
          </span>
        );
    }
  }

  if (type === "device") {
    const status = value as DeviceStatus;
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Active
          </span>
        );
      case "needs_attention":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/15 text-amber-400 border border-amber-500/35">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Needs attention
          </span>
        );
      case "offline":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Offline
          </span>
        );
    }
  }

  if (type === "escalation") {
    const status = value as EscalationStatus;
    switch (status) {
      case "AUTONOMOUS_INVESTIGATION":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/35">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Investigating
          </span>
        );
      case "QUEUED_FOR_HUMAN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Queued for human
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/15 text-slate-300 border border-slate-500/30">
            Open
          </span>
        );
    }
  }

  if (type === "priority") {
    const priority = value as EscalationPriority;
    switch (priority) {
      case "CRITICAL":
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            {priority}
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase font-medium bg-amber-500/20 text-amber-300 border border-amber-500/35">
            {priority}
          </span>
        );
      case "LOW":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase font-medium bg-slate-500/20 text-slate-400 border border-slate-500/30">
            {priority}
          </span>
        );
    }
  }

  return (
    <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300">
      {value}
    </span>
  );
}
