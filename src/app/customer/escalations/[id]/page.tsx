import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEscalationById } from "@/lib/mockData";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Receipt,
  Radio,
  Clock,
  Lock,
  MessageSquare,
  FileCheck2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface EscalationDetailPageProps {
  params: {
    id: string;
  };
}

export default function CustomerEscalationDetailPage({
  params,
}: EscalationDetailPageProps) {
  const escalation = getEscalationById(params.id);

  if (!escalation) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Top Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/customer/escalations"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Escalations</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/customer/chat?order_id=${escalation.relatedOrderId || ""}`}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Discuss with Support Agent</span>
          </Link>
        </div>
      </div>

      {/* Package Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-lg font-bold text-white">
              Package {escalation.escalationId}
            </span>
            <StatusBadge type="priority" value={escalation.priority} />
            <StatusBadge type="escalation" value={escalation.status} />
          </div>
          <span className="text-xs font-mono text-slate-400">
            Recorded: {escalation.createdAt}
          </span>
        </div>

        <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
          {escalation.issue}
        </h1>

        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono">
          <p className="text-cyan-400 uppercase font-bold text-[10px] mb-1">
            Autonomous Recommended Action:
          </p>
          <p className="text-slate-200 leading-relaxed">
            {escalation.recommendedAction}
          </p>
        </div>
      </div>

      {/* Main Grid: Evidence Summary & Policy Bounds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Evidence Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
              <FileCheck2 className="w-5 h-5 text-cyan-400" />
              <h2 className="font-display text-base font-bold text-white">
                Multi-Agent Evidence Summary
              </h2>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
                <span className="text-slate-400 text-[10px] uppercase block mb-0.5">
                  Bank Switch Acknowledgment Code
                </span>
                <span className="text-rose-300 font-bold">
                  {escalation.evidenceSummary.bankSwitchCode}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
                <span className="text-slate-400 text-[10px] uppercase block mb-0.5">
                  SoundBox Hardware Telemetry Status
                </span>
                <span className="text-slate-200">
                  {escalation.evidenceSummary.telemetryStatus}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
                <span className="text-slate-400 text-[10px] uppercase block mb-0.5">
                  Merchant Customer Statement
                </span>
                <span className="text-slate-200">
                  {escalation.evidenceSummary.customerClaims}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
                <span className="text-slate-400 text-[10px] uppercase block mb-0.5">
                  Anomaly Root Cause Detected
                </span>
                <span className="text-emerald-300 font-semibold">
                  {escalation.evidenceSummary.detectedAnomaly}
                </span>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="p-5 rounded-xl bg-surface border border-surface-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-4">
              {escalation.relatedOrderId && (
                <Link
                  href="/customer/orders"
                  className="text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5"
                >
                  <Receipt className="w-4 h-4 text-cyan-400" />
                  <span>Linked Order: {escalation.relatedOrderId}</span>
                </Link>
              )}

              {escalation.relatedTid && (
                <Link
                  href="/customer/devices"
                  className="text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5"
                >
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>Linked Device: {escalation.relatedTid}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right: Policy & Read-Only humanCan Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Policy Information */}
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="font-display text-base font-bold text-white">
                Policy Boundary & Governance
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-surface-border">
                <span className="text-slate-400">Autonomous Policy ID</span>
                <span className="text-white font-bold">{escalation.policyId}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-surface-border">
                <span className="text-slate-400">AI Confidence Score</span>
                <span className="text-emerald-400 font-bold">
                  {(escalation.policyConfidence * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-surface-border">
                <span className="text-slate-400">Customer Authorization Scope</span>
                <span className="text-cyan-300">Self-Serve Read-Only</span>
              </div>
            </div>
          </div>

          {/* Read-Only humanCan Actions */}
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h2 className="font-display text-sm font-bold text-white">
                  Human Oversight Actions (Read-Only)
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
                Queued for Human
              </span>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              As a merchant customer, the actions below are executed exclusively by authorized Paytm Clearing & Settlement engineers according to RBI guidelines:
            </p>

            <div className="space-y-2 font-mono text-xs">
              {escalation.humanCan.map((action, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-surface-secondary/60 border border-surface-border flex items-start gap-2.5 text-slate-400 cursor-not-allowed opacity-80"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{action}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 text-[11px] text-slate-400 font-mono">
              Status: <span className="text-amber-300">Awaiting Level-3 Settlement Officer sign-off</span>. You will receive an automated notification once cleared.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
