import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomer, getOrders, getDevices } from "@/lib/mockData";
import {
  ArrowLeft,
  Users,
  Building,
  Radio,
  Receipt,
  ShieldCheck,
  AlertTriangle,
  History,
  Cpu,
  CreditCard,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";

interface CustomerDrillInProps {
  params: {
    customerId: string;
  };
}

export default function OpsCustomerMemoryPage({ params }: CustomerDrillInProps) {
  const customerId = params.customerId || "CUST-10291";
  const customer = getCustomer(customerId);

  if (!customer) {
    notFound();
  }

  const orders = getOrders(customerId);
  const devices = getDevices();
  const disputedOrder = orders.find((o) => o.status === "disputed");

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/ops/escalations"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Escalations Queue</span>
        </Link>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
          Customer Long-Term Memory
        </span>
      </div>

      {/* Customer Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-950 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-bold font-display">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white">
                  {customer.businessName}
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                  KYC Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Merchant: {customer.name} • MID: <strong className="text-white">{customer.mid}</strong> ({customer.id})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/ops/escalations/ESC-90214"
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Inspect P1 Escalation</span>
            </Link>
          </div>
        </div>

        {/* Quick Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-surface-border text-xs font-mono">
          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">Segment Tier</span>
            <span className="text-white font-semibold">{customer.segment}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">30-Day Dispute Risk</span>
            <span className="text-emerald-400 font-bold">0.04 (Low Anomaly)</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">Preferred Ops Channel</span>
            <span className="text-cyan-300 font-semibold">{customer.preferredChannel}</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <span className="text-[10px] text-slate-500 uppercase block">Settlement Bank</span>
            <span className="text-slate-200 font-semibold">{customer.settlementAccount}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Devices Fleet & Interaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (6 cols): Active Hardware Fleet */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2 text-cyan-400">
                <Radio className="w-5 h-5" />
                <h2 className="font-display text-base font-bold text-white">
                  Terminal Fleet Summary
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {devices.length} Units Provisioned
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {devices.map((dev) => (
                <div
                  key={dev.tid}
                  className="p-3.5 rounded-xl bg-surface-secondary/80 border border-surface-border space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{dev.tid}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                        dev.status === "active"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {dev.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">{dev.model}</p>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
                    <span>Network: {dev.network}</span>
                    <span>Battery: {dev.batteryLevel || "AC"}%</span>
                    <span>Carrier: {dev.simStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right (6 cols): Autonomous Agent Interaction History */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2 text-amber-400">
                <History className="w-5 h-5" />
                <h2 className="font-display text-base font-bold text-white">
                  Recent Multi-Agent Interactions
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Memory Stream</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-surface-secondary/80 border border-surface-border space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Today, 16:15 IST</span>
                  <span className="text-rose-400 font-bold">DISPUTE ESCALATED</span>
                </div>
                <p className="text-slate-200 text-xs">
                  Autonomous Supervisor routed order <strong>ORD-DUP-1001</strong> to human escalation package <strong>ESC-90214</strong> following dual switch debit.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-secondary/80 border border-surface-border space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Yesterday, 14:05 IST</span>
                  <span className="text-amber-400 font-semibold">HARDWARE PING</span>
                </div>
                <p className="text-slate-200 text-xs">
                  SoundBox <strong>TID-SBX-82931</strong> acoustic health verified over-the-air with 142ms packet latency acknowledgment.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-secondary/80 border border-surface-border space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>17 Sep 2026, 09:03 IST</span>
                  <span className="text-emerald-400 font-semibold">AUTO-RECONCILED</span>
                </div>
                <p className="text-slate-200 text-xs">
                  Settlement batch for ₹5,100 released to HDFC Bank primary account automatically by AI OS Reconciler.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
