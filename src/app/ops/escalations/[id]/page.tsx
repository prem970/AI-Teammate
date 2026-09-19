"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cpu,
  FileCode2,
  ExternalLink,
  Lock,
  Clock,
} from "lucide-react";
import { EscalationPackage, HumanActionType } from "@/lib/opsTypes";
import { EvidenceJsonViewer } from "@/components/ops/EvidenceJsonViewer";

export default function OpsEscalationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [escalation, setEscalation] = useState<EscalationPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchEscalation() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/escalations/${id}`);
        const data = await res.json();
        if (res.ok && data.escalation) {
          setEscalation(data.escalation);
        }
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    }
    if (id) {
      fetchEscalation();
    }
  }, [id]);

  const handleExecuteAction = async (action: HumanActionType) => {
    setActionLoading(action);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/escalations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          decidedBy: "Support Ops Agent",
          notes: `Action ${action.toUpperCase()} authorized via Ops Console.`,
          refundAmount: action === "approve" ? escalation?.evidence.amount : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEscalation(data.escalation);
        setFeedbackMessage({
          type: "success",
          text: `Decision '${action.toUpperCase()}' saved to Cosmos (DB status=${data.escalation.status}).${
            data.auditWritten ? " Audit event written." : ""
          }`,
        });
      } else {
        setFeedbackMessage({
          type: "error",
          text: data.error || "Failed to submit decision.",
        });
      }
    } catch {
      setFeedbackMessage({
        type: "error",
        text: "Network error submitting human decision to backend.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-slate-400 space-y-3">
        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Loading escalation package from Cosmos…</p>
      </div>
    );
  }

  if (!escalation) {
    return (
      <div className="p-8 rounded-2xl bg-surface border border-surface-border text-center space-y-3">
        <p className="text-sm font-bold text-white font-mono">
          Escalation Package {id} Not Found
        </p>
        <Link
          href="/ops/escalations"
          className="text-xs text-amber-400 hover:underline font-mono inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Escalation Queue
        </Link>
      </div>
    );
  }

  const isResolved = escalation.status === "resolved";

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/ops/escalations"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Escalation Queue</span>
        </Link>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500">Workflow:</span>
          <span className="text-slate-300 bg-surface-secondary px-2 py-0.5 rounded border border-surface-border">
            {escalation.workflowId}
          </span>
        </div>
      </div>

      {/* MANDATORY MCP BANNER */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-surface to-surface-secondary border border-amber-500/50 flex items-start gap-3.5 shadow-lg">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-bold font-mono text-amber-300 uppercase tracking-wide">
            MCP Safety Standard: MCP does not auto-refund; human decision required.
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
            Autonomous multi-agent supervisors synthesize switch evidence, check regulatory policies, and compute recommended actions. However, financial payout/reversal authorizations strictly require explicit human sign-off per RBI & Paytm compliance guidelines.
          </p>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-page-enter ${
            feedbackMessage.type === "success"
              ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-300"
              : "bg-rose-500/15 border border-rose-500/40 text-rose-300"
          }`}
        >
          {feedbackMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Package Dossier Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-lg sm:text-xl font-bold text-white">
              Package {escalation.escalationId}
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-xs font-bold">
              {escalation.priority}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded font-mono text-xs uppercase font-bold border ${
                isResolved
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/40"
              }`}
            >
              {escalation.status.replace("_", " ")}
            </span>
          </div>

          <span className="text-xs font-mono text-slate-400">
            Created: {escalation.createdAt}
          </span>
        </div>

        <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
          {escalation.issue}
        </h1>

        {/* Core References */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-2">
          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">Customer Memory Link</span>
            <Link
              href={`/ops/customers/${escalation.customerId}`}
              className="text-cyan-300 hover:text-white font-bold flex items-center gap-1 mt-0.5"
            >
              <span>{escalation.customerId}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">Order / Disputed Ref</span>
            <span className="text-white font-bold block mt-0.5">{escalation.orderId}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">Governing Rule</span>
            <span className="text-purple-300 font-bold block mt-0.5">{escalation.policyId}</span>
          </div>
        </div>

        {/* Existing Resolution Decision if finalized */}
        {escalation.resolutionDecision && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-1">
            <p className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Final Decision Recorded:
            </p>
            <p className="text-slate-200">
              Action: <strong className="text-white uppercase">{escalation.resolutionDecision.action}</strong> by {escalation.resolutionDecision.decidedBy} at {escalation.resolutionDecision.decidedAt}
            </p>
            <p className="text-slate-300">{escalation.resolutionDecision.notes}</p>
          </div>
        )}
      </div>

      {/* Main Grid: Evidence & Policy on Left (7 cols), Human Decision Action Bar on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Evidence JSON & Policy Verification */}
        <div className="lg:col-span-7 space-y-6">
          {/* Agent Conclusion & Recommendation */}
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-border text-amber-400">
              <Cpu className="w-5 h-5" />
              <h2 className="font-display text-base font-bold text-white">
                Autonomous Agent Synthesis
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
                  Supervisor Conclusion:
                </span>
                <p className="text-slate-200 leading-relaxed font-mono p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
                  {escalation.agentConclusion}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block mb-1">
                  Recommended Action:
                </span>
                <p className="text-amber-200 font-semibold font-mono p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  {escalation.recommendedAction}
                </p>
              </div>
            </div>
          </div>

          {/* Applicable Policy Verification */}
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-border text-purple-400">
              <FileCode2 className="w-5 h-5" />
              <h2 className="font-display text-base font-bold text-white">
                Applicable Policy Clause
              </h2>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>{escalation.applicablePolicy.name}</span>
                <span className="text-purple-300 font-bold">{escalation.applicablePolicy.version}</span>
              </div>
              <p className="text-amber-400 text-[11px]">
                {escalation.applicablePolicy.clause}
              </p>
              <div className="p-3.5 rounded-lg bg-purple-950/20 border border-purple-500/30 text-slate-200 leading-relaxed italic">
                “{escalation.applicablePolicy.textSnippet}”
              </div>
            </div>
          </div>

          {/* Evidence JSON Explorer */}
          <EvidenceJsonViewer
            data={escalation.evidence}
            title="Evidence payload (from Cosmos document)"
          />
        </div>

        {/* Right Column (5 cols): Human-in-the-Loop Action Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-amber-500/30 space-y-5 sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h2 className="font-display text-base font-bold text-white">
                  Human Oversight Actions
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Support Role Gated
              </span>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Select an action to execute. Decisions are persisted to Cosmos via{" "}
              <code className="text-cyan-400 font-mono">PATCH /api/escalations/{escalation.escalationId}</code>.
              MCP never auto-refunds.
            </p>

            {/* Action Buttons Grid */}
            <div className="space-y-2.5 font-mono text-xs">
              {/* Approve */}
              <button
                type="button"
                onClick={() => handleExecuteAction("approve")}
                disabled={actionLoading !== null || isResolved}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-between shadow-lg shadow-emerald-600/20 disabled:opacity-40 transition-all"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Recommendation</span>
                </div>
                <span className="text-[10px] opacity-80 uppercase">
                  {escalation.evidence.amount > 0
                    ? `Refund ₹${escalation.evidence.amount.toLocaleString("en-IN")}`
                    : "From package"}
                </span>
              </button>

              {/* Reject */}
              <button
                type="button"
                onClick={() => handleExecuteAction("reject")}
                disabled={actionLoading !== null || isResolved}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 flex items-center justify-between disabled:opacity-40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  <span>Reject Recommendation</span>
                </div>
                <span className="text-[10px] text-rose-400">Deny Claim</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#080b12] border border-surface-border text-[11px] text-slate-500 font-mono">
              Audit Stamp: All decisions are permanently stored in immutable ledger with employee badge signature.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
