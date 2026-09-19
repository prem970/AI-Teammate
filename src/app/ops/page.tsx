import React from "react";
import Link from "next/link";
import { getCurrentOpsSession } from "@/lib/opsAuth";
import {
  listOpsEscalations,
  listPolicies,
  listLeads,
  isCosmosLive,
} from "@/lib/cosmos/repository";
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
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";

export default async function OpsHomePage() {
  const session = await getCurrentOpsSession();
  const origin = isCosmosLive() ? "cosmos" : "unavailable";
  const escalations = origin === "cosmos" ? await listOpsEscalations() : [];
  const policies = origin === "cosmos" ? await listPolicies() : [];
  const leads = origin === "cosmos" ? await listLeads() : [];

  const openEscalations = escalations.filter((e) => e.status === "open");
  const p1Escalations = escalations.filter(
    (e) => e.priority === "P1" && e.status !== "resolved"
  );
  const activePolicies = policies.filter((p) => p.status === "active");
  const activeLeads = leads.filter((l) => l.currentStage !== "Closed-Won");
  const leadsNeedingHandoff = leads.filter(
    (l) => l.currentStage === "Quoting" || l.currentStage === "Negotiation"
  );

  return (
    <div className="space-y-8">
      <DataOriginBanner origin={origin} />
      <section className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0c101a] via-[#101624] to-[#0a0d15] border border-surface-border overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                OPS CONSOLE
              </span>
              <span className="text-xs font-mono text-slate-400 bg-surface-secondary px-2.5 py-1 rounded border border-surface-border">
                Role: <strong className="text-white uppercase">{session?.role}</strong>
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              Command home
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Escalations, policies, and sales leads load from Cosmos. Staff login remains a demo
              cookie (not an IdP). Chat/ingest use n8n webhooks when configured.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={ShieldAlert}
          label="Open escalations"
          value={String(openEscalations.length)}
          href="/ops/escalations"
          accent="rose"
        />
        <StatCard
          icon={AlertTriangle}
          label="P1 open"
          value={String(p1Escalations.length)}
          href="/ops/escalations"
          accent="amber"
        />
        <StatCard
          icon={FileCode2}
          label="Active policies"
          value={String(activePolicies.length)}
          href="/ops/policies"
          accent="cyan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" /> Escalation queue
            </h2>
            <Link href="/ops/escalations" className="text-xs text-cyan-300 inline-flex items-center gap-1">
              Open <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {openEscalations.slice(0, 4).map((e) => (
            <Link
              key={e.escalationId}
              href={`/ops/escalations/${e.escalationId}`}
              className="block p-3 rounded-xl bg-surface-secondary border border-surface-border hover:border-amber-500/40"
            >
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>{e.escalationId}</span>
                <span>{e.priority}</span>
              </div>
              <p className="text-sm text-white mt-1">{e.issue}</p>
            </Link>
          ))}
          {openEscalations.length === 0 && (
            <p className="text-sm text-slate-500">No open escalations in Cosmos.</p>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Sales leads
            </h2>
            <Link href="/ops/sales/pipeline" className="text-xs text-emerald-300 inline-flex items-center gap-1">
              Follow & reach out <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Active: {activeLeads.length} · Quote/Negotiate handoffs: {leadsNeedingHandoff.length}
          </p>
          {activeLeads.slice(0, 4).map((l) => (
            <Link
              key={l.id}
              href={`/ops/sales/leads/${l.id}`}
              className="block p-3 rounded-xl bg-surface-secondary border border-surface-border hover:border-emerald-500/40"
            >
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>{l.id}</span>
                <span>{l.currentStage}</span>
              </div>
              <p className="text-sm text-white mt-1">{l.businessName}</p>
              <p className="text-[11px] text-emerald-400/80 mt-1">Open lead → Reach out</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono text-slate-400">
        <div className="p-3 rounded-xl border border-surface-border flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" /> Chat → n8n Orchestrator
        </div>
        <div className="p-3 rounded-xl border border-surface-border flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" /> Ingest → n8n RAG
        </div>
        <div className="p-3 rounded-xl border border-surface-border flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> Staff auth = demo
        </div>
        <div className="p-3 rounded-xl border border-surface-border flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-slate-400" /> HIL decisions → Cosmos
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  accent: "rose" | "amber" | "cyan";
}) {
  const color =
    accent === "rose"
      ? "text-rose-300 border-rose-500/30"
      : accent === "amber"
        ? "text-amber-300 border-amber-500/30"
        : "text-cyan-300 border-cyan-500/30";
  return (
    <Link
      href={href}
      className={`p-5 rounded-2xl bg-surface border ${color} hover:bg-surface-secondary transition-colors`}
    >
      <div className="flex items-center gap-2 text-xs font-mono mb-2">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <p className="font-display text-3xl font-bold text-white">{value}</p>
      <p className="text-[11px] text-slate-500 mt-2 inline-flex items-center gap-1">
        <Clock className="w-3 h-3" /> Cosmos snapshot
      </p>
    </Link>
  );
}
