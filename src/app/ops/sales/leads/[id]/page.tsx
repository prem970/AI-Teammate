import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_LEADS } from "@/lib/opsMockData";
import {
  ArrowLeft,
  TrendingUp,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Bot,
  Layers,
  ArrowRight,
} from "lucide-react";

interface LeadDetailPageProps {
  params: {
    id: string;
  };
}

export default function OpsLeadDetailPage({ params }: LeadDetailPageProps) {
  const lead = MOCK_LEADS.find(
    (l) => l.id.toLowerCase() === params.id.toLowerCase()
  );

  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/ops/sales/pipeline"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sales Pipeline Board</span>
        </Link>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
          Lead Record: {lead.id}
        </span>
      </div>

      {/* Lead Summary Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400 font-bold">
                {lead.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold uppercase">
                Stage: {lead.currentStage}
              </span>
              <span className="text-slate-500 font-mono text-xs">
                Owner: {lead.assignedAgent}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              {lead.businessName}
            </h1>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs font-mono text-slate-400">Estimated Deal Value</p>
            <p className="font-mono text-2xl font-bold text-emerald-400">
              ₹{lead.dealValue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Lead Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-surface-border text-xs font-mono">
          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">Primary Contact</span>
            <span className="text-white font-semibold">{lead.contactName}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">Phone / Mobile</span>
            <span className="text-slate-200">{lead.phone}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">City & Territory</span>
            <span className="text-slate-200">{lead.city}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">Product / Quantity</span>
            <span className="text-cyan-300 font-bold">{lead.hardwareCount} Units</span>
          </div>
        </div>
      </div>

      {/* Stage Ownership Standard Alert */}
      <div className="p-4 rounded-xl bg-[#0a121d] border border-emerald-500/30 flex items-start gap-3 shadow-md text-xs font-mono">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-slate-300">
          <p className="font-bold text-emerald-300 uppercase text-[11px]">
            Strict Sequential Transition: Agent1 Outreach → Agent2 Quote/Negotiate → Agent3 Onboarding.
          </p>
          <p className="text-slate-400 font-sans text-[11px]">
            No stage skipping permitted. Each autonomous agent writes structured reasoning logs before triggering webhook handoff to the next team agent.
          </p>
        </div>
      </div>

      {/* Granular Stage Log Timeline */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display text-base font-bold text-white">
              Autonomous Agent Stage Logs & Reasoning Audits
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {lead.stageLogs.length} Transitions Logged
          </span>
        </div>

        <div className="relative border-l-2 border-surface-border ml-3 space-y-6 pl-6">
          {lead.stageLogs.map((log, index) => (
            <div key={log.id} className="relative space-y-2">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-surface" />

              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold uppercase text-[11px]">
                    {log.stage}
                  </span>
                  <span className="text-slate-400">
                    Logged by: <strong className="text-white">{log.agentId}</strong>
                  </span>
                </div>
                <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
              </div>

              {/* Action Taken */}
              <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-surface-border text-xs font-mono space-y-2">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">
                    Action Executed:
                  </span>
                  <p className="text-slate-200 font-semibold">{log.actionTaken}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-amber-400 block">
                    Agent Reasoning:
                  </span>
                  <p className="text-slate-300 font-sans text-xs">{log.reasoning}</p>
                </div>

                <div className="pt-2 border-t border-surface-border/60 text-[11px]">
                  <span className="text-cyan-400 font-semibold">Next Sequential Step: </span>
                  <span className="text-slate-300">{log.nextStep}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
