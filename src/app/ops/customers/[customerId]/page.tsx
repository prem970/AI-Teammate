import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findCustomerById,
  listOrders,
  listDevices,
  isCosmosLive,
} from "@/lib/cosmos/repository";
import {
  ArrowLeft,
  Building,
  Radio,
  Receipt,
  Phone,
  Mail,
} from "lucide-react";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";

export default async function OpsCustomerMemoryPage({
  params,
}: {
  params: { customerId: string };
}) {
  if (!isCosmosLive()) {
    return <DataOriginBanner origin="unavailable" />;
  }

  const customer = await findCustomerById(params.customerId);
  if (!customer) notFound();

  const orders = await listOrders(params.customerId);
  const devices = await listDevices(params.customerId);

  return (
    <div className="space-y-6">
      <DataOriginBanner origin="cosmos" />
      <Link href="/ops" className="inline-flex items-center gap-2 text-sm text-slate-400">
        <ArrowLeft className="w-4 h-4" /> Ops home
      </Link>

      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
        <p className="font-mono text-xs text-slate-500">{customer.id}</p>
        <h1 className="font-display text-2xl font-bold text-white">{customer.businessName}</h1>
        <p className="text-sm text-slate-300">{customer.name}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2">
          <p className="inline-flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4" /> {customer.email}
          </p>
          <p className="inline-flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4" /> {customer.phone || "—"}
          </p>
          <p className="inline-flex items-center gap-2 text-slate-300">
            <Building className="w-4 h-4" /> {customer.businessType} · {customer.segment}
          </p>
          <p className="text-slate-300 font-mono text-xs">MID {customer.mid}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-surface-border bg-surface space-y-2">
          <h2 className="font-display font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-cyan-400" /> Orders ({orders.length})
          </h2>
          {orders.map((o) => (
            <div key={o.orderId} className="text-xs font-mono text-slate-300 border-t border-surface-border pt-2">
              {o.orderId} · {o.status} · ₹{o.amount}
            </div>
          ))}
        </div>
        <div className="p-5 rounded-2xl border border-surface-border bg-surface space-y-2">
          <h2 className="font-display font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" /> Devices ({devices.length})
          </h2>
          {devices.map((d) => (
            <div key={d.tid} className="text-xs font-mono text-slate-300 border-t border-surface-border pt-2">
              {d.tid} · {d.status} · {d.model}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
