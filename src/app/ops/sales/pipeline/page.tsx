"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { SalesStage, Lead } from "@/lib/opsTypes";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";
import { ReachOutButton } from "@/components/ops/ReachOutButton";

const STAGES: { stage: SalesStage; owner: string; color: string }[] = [
  { stage: "Outreach", owner: "Agent1-Outreach", color: "border-cyan-500/40 text-cyan-400" },
  { stage: "Follow-ups", owner: "Agent1-Outreach", color: "border-blue-500/40 text-blue-400" },
  { stage: "Quoting", owner: "Agent2-QuoteNegotiate", color: "border-amber-500/40 text-amber-400" },
  { stage: "Negotiation", owner: "Agent2-QuoteNegotiate", color: "border-purple-500/40 text-purple-400" },
  { stage: "Onboarding", owner: "Agent3-Onboarding", color: "border-emerald-500/40 text-emerald-400" },
  { stage: "Closed-Won", owner: "Agent3-Onboarding", color: "border-teal-500/40 text-teal-400" },
];

export default function OpsSalesPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [origin, setOrigin] = useState<"cosmos" | "unavailable">("unavailable");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/data?resource=leads");
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Failed to load leads");
          return;
        }
        setOrigin("cosmos");
        setLeads(data.items || []);
      } catch {
        if (!cancelled) setError("Network error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const outreachReady = leads.filter(
    (l) => l.currentStage === "Outreach" || l.currentStage === "Follow-ups"
  );

  return (
    <div className="space-y-6">
      <DataOriginBanner origin={origin} />
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" /> Sales pipeline
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
          Follow leads from Cosmos. Use Reach out to draft first-touch email via n8n Agent1 (not auto-sent).
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-200 text-xs">
          {error}
        </div>
      )}

      {outreachReady.length > 0 && (
        <section className="p-4 rounded-2xl bg-surface border border-emerald-500/30 space-y-3">
          <div>
            <h2 className="font-display font-bold text-white text-lg">Reach out now</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Leads in Outreach / Follow-ups — click Reach out to invoke the sales-lead-intake webhook.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {outreachReady.map((lead) => (
              <div
                key={lead.id}
                className="p-3 rounded-xl bg-surface-secondary border border-surface-border space-y-2"
              >
                <Link href={`/ops/sales/leads/${lead.id}`} className="block hover:opacity-90">
                  <p className="text-[11px] font-mono text-slate-500">{lead.id}</p>
                  <p className="text-sm text-white font-medium">{lead.businessName}</p>
                  <p className="text-[11px] text-slate-400">
                    {lead.contactName} · {lead.city} · {lead.currentStage}
                  </p>
                </Link>
                <ReachOutButton leadId={lead.id} companyName={lead.businessName} compact />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {STAGES.map(({ stage, owner, color }) => {
          const column = leads.filter((l) => l.currentStage === stage);
          return (
            <div key={stage} className={`rounded-2xl border bg-surface p-3 ${color.split(" ")[0]}`}>
              <p className={`text-[11px] font-mono font-bold mb-2 ${color.split(" ").slice(1).join(" ")}`}>
                {stage}
              </p>
              <p className="text-[10px] font-mono text-slate-500 mb-3">{owner}</p>
              <div className="space-y-2">
                {column.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/ops/sales/leads/${lead.id}`}
                    className="block p-2.5 rounded-xl bg-surface-secondary border border-surface-border hover:border-cyan-500/40"
                  >
                    <p className="text-xs font-mono text-slate-500">{lead.id}</p>
                    <p className="text-sm text-white font-medium">{lead.businessName}</p>
                    <p className="text-[11px] text-slate-400 mt-1 inline-flex items-center gap-1">
                      Follow lead <ArrowRight className="w-3 h-3" />
                    </p>
                  </Link>
                ))}
                {column.length === 0 && (
                  <p className="text-[11px] text-slate-600 py-4 text-center">Empty</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
