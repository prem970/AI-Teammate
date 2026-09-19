import React from "react";
import Link from "next/link";
import { getCurrentCustomerSession } from "@/lib/auth";
import { listCustomerEscalations, isCosmosLive } from "@/lib/cosmos/repository";
import {
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  Layers,
  Lock,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";

export const dynamic = "force-dynamic";

export default async function CustomerEscalationsPage() {
  const session = await getCurrentCustomerSession();
  const customerId = session?.customerId || "CUST-10291";
  const origin = isCosmosLive() ? "cosmos" : "unavailable";
  const escalations = origin === "cosmos" ? await listCustomerEscalations(customerId) : [];

  const openCount = escalations.filter((e) => e.status !== "RESOLVED").length;
  const resolvedCount = escalations.filter((e) => e.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      <DataOriginBanner origin={origin} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Case status
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Open cases from Ops (including policy / SLA questions). Not orders — those stay under
            Orders. Ask follow-ups in Chat.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/customer/chat"
            className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono hover:bg-cyan-500/25"
          >
            Ask in Chat
          </Link>
          <span className="px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
            {openCount} With Ops
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            {resolvedCount} Resolved
          </span>
        </div>
      </div>

      <div className="p-3 rounded-xl border border-slate-700 bg-surface-secondary text-xs text-slate-400 flex items-start gap-2">
        <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-500" />
        <span>
          Looking for demo cases?{" "}
          <strong className="text-slate-200 font-normal">ESC-PAY-REFUND-601</strong> (refund bank
          days — ORD-DUP-1001) or{" "}
          <strong className="text-slate-200 font-normal">ESC-SLA-HOT-601</strong> (lead SLA). Or{" "}
          <Link href="/customer/chat" className="text-cyan-400 hover:underline">
            Chat
          </Link>{" "}
          → quick prompt <strong className="text-amber-300 font-normal">Refund bank days (v1.1 demo)</strong>.
          Lead outreach is Ops Sales Pipeline, not this portal.
        </span>
      </div>

      {escalations.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-surface-border text-center text-slate-400 text-sm">
          No open or past cases for {customerId}. Chat with support if you need help.
        </div>
      ) : (
        <div className="space-y-3">
          {escalations.map((esc) => (
            <Link
              key={esc.escalationId}
              href={`/customer/escalations/${esc.escalationId}`}
              className="block p-5 rounded-2xl bg-surface border border-surface-border hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    {esc.escalationId}
                    <StatusBadge type="escalation" value={esc.status} />
                  </div>
                  <h2 className="font-display text-lg text-white font-semibold">{esc.issue}</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {esc.createdAt}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {esc.policyId}
                    </span>
                    {esc.relatedOrderId && (
                      <span className="inline-flex items-center gap-1">
                        <Layers className="w-3 h-3" /> {esc.relatedOrderId}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-cyan-300 text-sm font-mono">
                  View status <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              {esc.status !== "RESOLVED" && (
                <div className="mt-3 flex items-start gap-2 text-xs text-amber-200/90">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  With Ops: {esc.recommendedAction}
                </div>
              )}
              {esc.status === "RESOLVED" && (
                <div className="mt-3 flex flex-col gap-1 text-xs text-emerald-300">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved by Ops
                    {esc.resolutionDecision?.action
                      ? ` · ${esc.resolutionDecision.action}`
                      : ""}
                  </span>
                  {typeof esc.resolutionDecision?.refundAmount === "number" &&
                    esc.resolutionDecision.refundAmount > 0 && (
                      <span className="pl-5 text-emerald-200/90 font-mono">
                        Refund ₹{esc.resolutionDecision.refundAmount.toLocaleString("en-IN")}
                      </span>
                    )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
