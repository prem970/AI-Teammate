import React from "react";
import Link from "next/link";
import { getCurrentCustomerSession } from "@/lib/auth";
import { getEscalations } from "@/lib/mockData";
import {
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  Layers,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function CustomerEscalationsPage() {
  const session = await getCurrentCustomerSession();
  const customerId = session?.customerId || "CUST-10291";
  const escalations = getEscalations(customerId);

  const openCount = escalations.filter((e) => e.status !== "RESOLVED").length;
  const resolvedCount = escalations.filter((e) => e.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Autonomous Escalation Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Automated dispute investigations, NPCI switch traces, and human-in-the-loop review bundles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {openCount} Under Investigation
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            {resolvedCount} Auto-Resolved
          </span>
        </div>
      </div>

      {/* Escalation Packages List */}
      <div className="space-y-4">
        {escalations.map((pkg) => {
          const isHighPriority = pkg.priority === "HIGH" || pkg.priority === "CRITICAL";

          return (
            <div
              key={pkg.escalationId}
              className={`p-6 rounded-2xl bg-surface border transition-all ${
                isHighPriority
                  ? "border-rose-500/40 hover:border-rose-500/60 bg-gradient-to-r from-rose-950/20 via-surface to-surface"
                  : "border-surface-border hover:border-surface-borderHover"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-white">
                      {pkg.escalationId}
                    </span>
                    <StatusBadge type="priority" value={pkg.priority} />
                    <StatusBadge type="escalation" value={pkg.status} />
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs font-mono text-slate-400">
                      Created: {pkg.createdAt}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-semibold text-white">
                    {pkg.issue}
                  </h3>

                  <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border text-xs font-mono">
                    <span className="text-cyan-400 font-bold uppercase text-[10px] block mb-1">
                      Recommended AI Orchestration Action:
                    </span>
                    <p className="text-slate-300">{pkg.recommendedAction}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                    <span>
                      Policy ID: <strong className="text-slate-200">{pkg.policyId}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Confidence:{" "}
                      <strong className="text-emerald-400">
                        {(pkg.policyConfidence * 100).toFixed(0)}%
                      </strong>
                    </span>
                    {pkg.relatedOrderId && (
                      <>
                        <span>•</span>
                        <span className="text-rose-300">Order: {pkg.relatedOrderId}</span>
                      </>
                    )}
                    {pkg.relatedTid && (
                      <>
                        <span>•</span>
                        <span className="text-cyan-300">Device: {pkg.relatedTid}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <Link
                    href={`/customer/escalations/${pkg.escalationId}`}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-secondary hover:bg-surface-elevated text-cyan-300 hover:text-white border border-surface-border hover:border-cyan-500/40 text-xs font-mono font-medium transition-all group"
                  >
                    <span>Inspect Full Package</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
