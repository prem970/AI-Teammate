"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  User,
  Building,
  Radio,
  Clock,
  ShieldCheck,
  AlertCircle,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { MOCK_LEADS } from "@/lib/opsMockData";
import { SalesStage, Lead } from "@/lib/opsTypes";

const STAGES: { stage: SalesStage; owner: string; color: string }[] = [
  { stage: "Outreach", owner: "Agent1-Outreach", color: "border-cyan-500/40 text-cyan-400" },
  { stage: "Follow-ups", owner: "Agent1-Outreach", color: "border-blue-500/40 text-blue-400" },
  { stage: "Quoting", owner: "Agent2-QuoteNegotiate", color: "border-amber-500/40 text-amber-400" },
  { stage: "Negotiation", owner: "Agent2-QuoteNegotiate", color: "border-purple-500/40 text-purple-400" },
  { stage: "Onboarding", owner: "Agent3-Onboarding", color: "border-emerald-500/40 text-emerald-400" },
  { stage: "Closed-Won", owner: "Agent3-Onboarding", color: "border-teal-500/40 text-teal-400" },
];

export default function OpsSalesPipelinePage() {
  const [leads] = useState<Lead[]>(MOCK_LEADS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Multi-Agent Sales Pipeline Board
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              Autonomous Sales OS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Sequential merchant acquisition pipeline with strict stage ownership across autonomous agents.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Active Pipeline: <strong className="text-white">₹3,95,000 MRR</strong></span>
        </div>
      </div>

      {/* Strict Stage Governance Notice */}
      <div className="p-4 rounded-xl bg-[#09111c] border border-emerald-500/30 flex items-start gap-3 shadow-md text-xs">
        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-1 font-mono text-slate-300">
          <p className="font-bold text-emerald-300 uppercase text-[11px]">
            Stage Ownership Standard: Agent1 Outreach → Agent2 Quote/Negotiate → Agent3 Onboarding — No stage skipping.
          </p>
          <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
            Autonomous sales bots coordinate handoffs between stages. Regulatory KYC checks and commercial rate card approvals prevent skipping intermediate negotiation or quoting checkpoints.
          </p>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STAGES.map(({ stage, owner, color }) => {
          const stageLeads = leads.filter((l) => l.currentStage === stage);

          return (
            <div
              key={stage}
              className="flex flex-col rounded-2xl bg-surface border border-surface-border min-w-[210px] overflow-hidden"
            >
              {/* Column Header */}
              <div className="p-3.5 bg-surface-secondary/80 border-b border-surface-border">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xs font-bold text-white uppercase tracking-wider">
                    {stage}
                  </h2>
                  <span className="px-1.5 py-0.2 rounded-full bg-surface text-[10px] font-mono text-slate-400 border border-surface-border font-bold">
                    {stageLeads.length}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-1 truncate">
                  Owner: <span className="text-slate-300">{owner}</span>
                </p>
              </div>

              {/* Cards List */}
              <div className="p-2.5 flex-1 space-y-2.5 min-h-[300px]">
                {stageLeads.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-6 text-center text-[11px] text-slate-600 font-mono">
                    No leads in {stage}
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/ops/sales/leads/${lead.id}`}
                      className="block p-3.5 rounded-xl bg-surface-secondary/70 border border-surface-border hover:border-amber-500/40 hover:bg-surface-elevated/90 transition-all group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          {lead.id}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-emerald-400">
                          ₹{lead.dealValue.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <h3 className="font-display text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                        {lead.businessName}
                      </h3>

                      <p className="text-[11px] text-slate-400 mt-1 font-sans truncate">
                        Contact: {lead.contactName} ({lead.city})
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-surface-border/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span className="truncate max-w-[120px]">
                          {lead.hardwareCount} {lead.productPitch.split(" ")[1]}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
