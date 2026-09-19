import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_TRACES } from "@/lib/adminMockData";
import {
  ArrowLeft,
  Activity,
  ShieldCheck,
  Clock,
  Layers,
  Code,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { TraceTimelineView } from "@/components/admin/TraceTimelineView";

interface TraceDetailPageProps {
  params: {
    traceId: string;
  };
}

export default function AdminTraceDetailPage({ params }: TraceDetailPageProps) {
  const trace = MOCK_TRACES.find(
    (t) => t.traceId.toLowerCase() === params.traceId.toLowerCase()
  );

  if (!trace) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/traces"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Traces</span>
        </Link>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
          Trace ID: {trace.traceId}
        </span>
      </div>

      {/* Header Info */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-slate-400 font-bold uppercase">
              Intent Execution Run
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
              {trace.intent}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Customer: <strong className="text-cyan-300">{trace.customerId}</strong> • Recorded at {trace.timestamp}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-right">
            <div>
              <p className="text-slate-500 text-[10px] uppercase">End-to-End Latency</p>
              <p className="font-mono text-2xl font-bold text-cyan-300">{trace.latencyMs}ms</p>
            </div>
          </div>
        </div>

        {/* Agents Invoked Strip */}
        <div className="pt-3 border-t border-surface-border flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-slate-400 text-[10px] uppercase">Agents Involved:</span>
          {trace.agentsCalled.map((ag) => (
            <span
              key={ag}
              className="px-2.5 py-0.5 rounded bg-surface-secondary text-slate-200 border border-surface-border text-[11px]"
            >
              ⚡ {ag}
            </span>
          ))}
        </div>
      </div>

      {/* Animated Vertical Timeline View */}
      <TraceTimelineView trace={trace} />

      {/* Raw Trace Payload Box */}
      <div className="p-6 rounded-2xl bg-[#04060d] border border-surface-border space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyan-400 pb-2 border-b border-surface-border">
          <Code className="w-4 h-4" />
          <h2 className="font-bold uppercase text-[11px]">Raw Telemetry Payload</h2>
        </div>
        <pre className="p-4 rounded-xl bg-surface-secondary/70 border border-surface-border text-slate-300 text-xs overflow-x-auto leading-relaxed">
          {trace.rawTraceText}
        </pre>
      </div>
    </div>
  );
}
