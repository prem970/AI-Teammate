import React from "react";
import Link from "next/link";
import { getCurrentOpsSession } from "@/lib/opsAuth";
import {
  getEscalationsStore,
  MOCK_POLICIES,
  MOCK_LEADS,
} from "@/lib/opsMockData";
import {
  ShieldAlert,
  FileCode2,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Bot,
  Users,
  Activity,
  Layers,
} from "lucide-react";

export default async function OpsHomePage() {
  const session = await getCurrentOpsSession();
  const escalations = getEscalationsStore();
  const openEscalations = escalations.filter((e) => e.status === "open");
  const p1Escalations = escalations.filter(
    (e) => e.priority === "P1" && e.status !== "resolved"
  );
  const activePolicies = MOCK_POLICIES.filter((p) => p.status === "active");
  const activeLeads = MOCK_LEADS.filter((l) => l.currentStage !== "Closed-Won");
  const leadsNeedingHandoff = MOCK_LEADS.filter(
    (l) => l.currentStage === "Quoting" || l.currentStage === "Negotiation"
  );

  return (
    <div className="space-y-8">
      {/* Ops Console Header */}
      <section className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0c101a] via-[#101624] to-[#0a0d15] border border-surface-border overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                STAFF CONSOLE ONLINE
              </span>
              <span className="text-xs font-mono text-slate-400 bg-surface-secondary px-2.5 py-1 rounded border border-surface-border">
                Role: <strong className="text-white uppercase">{session?.role}</strong>
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Operational Command, <span className="text-amber-400">{session?.name}</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl font-sans">
              Human-in-the-Loop decision gateway for Paytm Autonomous AI OS. Audit disputed transaction evidence, authorize MCP refund exceptions, and monitor multi-agent sales progression.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
            <Link
              href="/ops/escalations"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-display font-bold text-sm shadow-lg shadow-amber-500/20 transition-all group"
            >
              <ShieldAlert className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Open Escalation Queue</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Critical Priority P1 Banner if exists */}
      {p1Escalations.length > 0 && (
        <section className="p-4 sm:p-5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-page-enter">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 font-mono text-xs font-bold border border-rose-500/50">
                  {p1Escalations[0].priority} CRITICAL
                </span>
                <h2 className="text-sm font-bold text-rose-100 font-mono">
                  {p1Escalations[0].escalationId} — {p1Escalations[0].orderId}
                </h2>
              </div>
              <p className="text-xs text-rose-200/90 mt-1 max-w-3xl font-sans">
                {p1Escalations[0].issue}
              </p>
            </div>
          </div>
          <Link
            href={`/ops/escalations/${p1Escalations[0].escalationId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-mono font-medium shrink-0 border border-rose-500/50 transition-colors"
          >
            <span>Review MCP Package</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

      {/* 3 Core Operational Pillars (Interactive Cards) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Escalation Queue */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between hover:border-surface-borderHover transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldAlert className="w-5 h-5" />
                <h2 className="font-display font-bold text-white text-base">
                  Escalation Queue
                </h2>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {openEscalations.length} Open
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-5 font-sans">
              Human-in-the-Loop decision required for disputed transactions and hardware anomalies.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300">P1 (Urgent Reversals)</span>
                <span className="text-rose-400 font-bold">{p1Escalations.length} Pending</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300">P2 (Hardware Latency)</span>
                <span className="text-amber-400 font-semibold">1 Alert</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300">P3-P4 (Recon & Supplies)</span>
                <span className="text-slate-400 font-semibold">2 Tickets</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-surface-border">
            <Link
              href="/ops/escalations"
              className="w-full flex items-center justify-between text-xs font-mono text-amber-400 hover:text-amber-300 group"
            >
              <span>Manage Escalation Queue</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 2: Sales Pipeline & Agent Handoffs */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between hover:border-surface-borderHover transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                <h2 className="font-display font-bold text-white text-base">
                  Multi-Agent Sales Board
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                {activeLeads.length} In Flight
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-5 font-sans">
              Sequential stage tracking across Agent1 (Outreach), Agent2 (Quoting), and Agent3 (Onboard).
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300">Needing Ops Handoff Review</span>
                <span className="text-emerald-400 font-bold">
                  {leadsNeedingHandoff.length} Deals
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300">Active Quoted Pipeline Value</span>
                <span className="text-white font-bold">₹3,95,000</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300">Stage Skipping Safety Rule</span>
                <span className="text-emerald-400 text-[10px]">ENFORCED</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-surface-border">
            <Link
              href="/ops/sales/pipeline"
              className="w-full flex items-center justify-between text-xs font-mono text-emerald-400 hover:text-emerald-300 group"
            >
              <span>View Sales Pipeline Kanban</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 3: Regulatory Policies & RAG Ingestion */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between hover:border-surface-borderHover transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-purple-400">
                <FileCode2 className="w-5 h-5" />
                <h2 className="font-display font-bold text-white text-base">
                  AI Policy Governance
                </h2>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                {activePolicies.length} Active
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-5 font-sans">
              Compliance vector index: Current active policy strictly beats historical cases.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300">Active Rule: PAYMENT-DUPLICATE-V2</span>
                <span className="text-purple-300 text-[11px]">v2.4.1</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300">Hardware Rule: POL-SBX-001</span>
                <span className="text-purple-300 text-[11px]">v1.8.0</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300">RAG Pipeline Destination</span>
                <span className="text-slate-400 text-[10px]">n8n Vector Store</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-surface-border">
            <Link
              href="/ops/policies"
              className="w-full flex items-center justify-between text-xs font-mono text-purple-400 hover:text-purple-300 group"
            >
              <span>Inspect Active Policies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
