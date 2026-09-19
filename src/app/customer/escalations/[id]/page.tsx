import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerEscalationById, isCosmosLive } from "@/lib/cosmos/repository";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Lock,
  MessageSquare,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";

export const dynamic = "force-dynamic";

interface EscalationDetailPageProps {
  params: { id: string };
}

export default async function CustomerEscalationDetailPage({
  params,
}: EscalationDetailPageProps) {
  if (!isCosmosLive()) {
    return (
      <div className="space-y-4">
        <DataOriginBanner origin="unavailable" />
        <p className="text-sm text-slate-400">Cosmos not configured.</p>
      </div>
    );
  }

  const escalation = await getCustomerEscalationById(params.id);
  if (!escalation) notFound();

  const resolved = escalation.status === "RESOLVED";
  const decision = escalation.resolutionDecision;

  return (
    <div className="space-y-6">
      <DataOriginBanner origin="cosmos" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/customer/escalations"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to case status
        </Link>
        <StatusBadge type="escalation" value={escalation.status} />
      </div>

      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex items-start gap-3">
          {resolved ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-1" />
          )}
          <div>
            <p className="font-mono text-xs text-slate-400">{escalation.escalationId}</p>
            <h1 className="font-display text-2xl font-bold text-white">{escalation.issue}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-surface-secondary border border-surface-border">
            <Clock className="w-4 h-4 text-slate-500 mb-1" />
            <p className="text-[11px] text-slate-500 font-mono">Opened</p>
            <p>{escalation.createdAt}</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-secondary border border-surface-border">
            <FileCheck2 className="w-4 h-4 text-slate-500 mb-1" />
            <p className="text-[11px] text-slate-500 font-mono">Policy</p>
            <p>{escalation.policyId}</p>
          </div>
        </div>

        {resolved && decision ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-100 text-sm space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs mb-1">
              <ShieldCheck className="w-4 h-4" /> Ops decision
            </div>
            <p className="font-semibold capitalize">{decision.action.replace(/_/g, " ")}</p>
            {typeof decision.refundAmount === "number" && decision.refundAmount > 0 && (
              <p>
                Refund amount: ₹{decision.refundAmount.toLocaleString("en-IN")}
              </p>
            )}
            <p className="text-xs text-emerald-200/80 font-mono">
              By {decision.decidedBy} · {decision.decidedAt}
            </p>
            {decision.notes && <p className="text-xs text-slate-300">{decision.notes}</p>}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-sm">
            <div className="flex items-center gap-2 font-mono text-xs mb-2">
              <ShieldCheck className="w-4 h-4" /> What Ops is reviewing
            </div>
            {escalation.recommendedAction}
          </div>
        )}

        <div className="p-4 rounded-xl bg-surface-secondary border border-surface-border text-sm space-y-2">
          <p className="font-mono text-xs text-slate-500">Summary</p>
          <p className="text-slate-300">{escalation.evidenceSummary.detectedAnomaly}</p>
        </div>

        <div className="p-3 rounded-lg border border-slate-700 text-xs text-slate-400 flex items-start gap-2">
          <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          View-only for merchants. Approve / reject / refund is done only in the Ops console. You
          cannot escalate from here — chat if you need an update.
        </div>

        <Link
          href={`/customer/chat?order_id=${escalation.relatedOrderId || ""}`}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Ask about this case status
        </Link>
      </div>
    </div>
  );
}
