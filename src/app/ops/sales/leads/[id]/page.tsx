import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLeadById, isCosmosLive } from "@/lib/cosmos/repository";
import { ArrowLeft } from "lucide-react";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";
import { ReachOutButton } from "@/components/ops/ReachOutButton";

export default async function OpsLeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isCosmosLive()) {
    return <DataOriginBanner origin="unavailable" />;
  }
  const lead = await getLeadById(params.id);
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <DataOriginBanner origin="cosmos" />
      <Link href="/ops/sales/pipeline" className="inline-flex items-center gap-2 text-sm text-slate-400">
        <ArrowLeft className="w-4 h-4" /> Pipeline
      </Link>
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-slate-500">{lead.id}</p>
            <h1 className="font-display text-2xl font-bold text-white">{lead.businessName}</h1>
            <p className="text-sm text-slate-400 mt-1">
              Follow this lead and trigger Agent1 outreach draft.
            </p>
          </div>
          <ReachOutButton leadId={lead.id} companyName={lead.businessName} />
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[11px] font-mono text-slate-500">Contact</dt>
            <dd>{lead.contactName}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-mono text-slate-500">Stage</dt>
            <dd>
              {lead.currentStage} · {lead.assignedAgent}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-mono text-slate-500">Email</dt>
            <dd>{lead.email}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-mono text-slate-500">City</dt>
            <dd>{lead.city}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-mono text-slate-500">Product pitch</dt>
            <dd>{lead.productPitch}</dd>
          </div>
        </dl>
        <div className="space-y-2">
          <p className="text-[11px] font-mono text-slate-500">Stage log (from Cosmos notes)</p>
          {lead.stageLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-surface-secondary border border-surface-border text-xs">
              <p className="font-mono text-slate-400">
                {log.timestamp} · {log.stage} · {log.agentId}
              </p>
              <p className="text-slate-200 mt-1">{log.actionTaken}</p>
              <p className="text-slate-500 mt-1">{log.reasoning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
