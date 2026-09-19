import React from "react";
import Link from "next/link";
import { getCurrentCustomerSession } from "@/lib/auth";
import { getCustomer, getOrders, getDevices, getEscalations } from "@/lib/mockData";
import {
  MessageSquare,
  Receipt,
  Radio,
  AlertTriangle,
  ArrowRight,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PulseIndicator } from "@/components/ui/PulseIndicator";

export default async function CustomerHomePage() {
  const session = await getCurrentCustomerSession();
  const customerId = session?.customerId || "CUST-10291";
  const customer = getCustomer(customerId);
  const orders = getOrders(customerId);
  const devices = getDevices();
  const escalations = getEscalations(customerId);

  const openEscalations = escalations.filter((e) => e.status !== "RESOLVED");
  const disputedOrders = orders.filter((o) => o.status === "disputed");
  const activeDevices = devices.filter((d) => d.status === "active");

  return (
    <div className="space-y-8">
      {/* Hero Signal Header */}
      <section className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-surface to-surface-secondary border border-surface-border overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <PulseIndicator
                label="Autonomous AI OS Active"
                sublabel="Continuous merchant telemetry sync"
              />
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
                MID: <strong className="text-white">{customer.mid}</strong>
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Welcome, <span className="text-gradient-cyan">{customer.name}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-sans">
              Self-serve hub for <strong className="text-white">{customer.businessName}</strong>. 
              The Autonomous AI OS handles dual debits, hardware pings, and payment settlements automatically.
            </p>
          </div>

          {/* Direct CTA into Chat */}
          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
            <Link
              href="/customer/chat"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all group"
            >
              <MessageSquare className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Launch Support Chat</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Critical Alert Banner (Only when active disputes or escalations exist) */}
      {openEscalations.length > 0 && (
        <section className="p-4 sm:p-5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-rose-200">
                  Active Escalation: {openEscalations[0].escalationId}
                </h2>
                <StatusBadge type="escalation" value={openEscalations[0].status} />
              </div>
              <p className="text-xs text-rose-300/80 mt-1 max-w-3xl">
                {openEscalations[0].issue}
              </p>
            </div>
          </div>
          <Link
            href={`/customer/escalations/${openEscalations[0].escalationId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-mono font-medium shrink-0 border border-rose-500/40 transition-colors"
          >
            <span>Review Package</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

      {/* Overview Composition: Active Products & Operational Telemetry (Interactive cards only) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Active Terminals & Hardware */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between hover:border-surface-borderHover transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Radio className="w-5 h-5" />
                <h2 className="font-display font-bold text-white text-base">
                  Terminals & SoundBox
                </h2>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {activeDevices.length} Online
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-5">
              Live telemetry for paired Paytm SoundBox 4G units and Android smart POS devices.
            </p>

            <div className="space-y-3">
              {devices.slice(0, 2).map((dev) => (
                <div
                  key={dev.tid}
                  className="p-3 rounded-lg bg-surface-secondary/80 border border-surface-border flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-mono font-semibold text-white">{dev.tid}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                      {dev.model}
                    </p>
                  </div>
                  <StatusBadge type="device" value={dev.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-surface-border">
            <Link
              href="/customer/devices"
              className="w-full flex items-center justify-between text-xs font-mono text-cyan-300 hover:text-cyan-200 group"
            >
              <span>Inspect All Hardware Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 2: Payment Streams & Disputes */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between hover:border-surface-borderHover transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Receipt className="w-5 h-5" />
                <h2 className="font-display font-bold text-white text-base">
                  Orders & Disputes
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {orders.length} Logged
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-5">
              Real-time transaction stream with automated duplicate debit detection.
            </p>

            <div className="space-y-3">
              {disputedOrders.length > 0 && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-300">
                      {disputedOrders[0].orderId}
                    </span>
                    <span className="text-xs font-bold text-white">
                      ₹{disputedOrders[0].amount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-400/80 mt-1 line-clamp-1">
                    {disputedOrders[0].disputeReason}
                  </p>
                </div>
              )}

              {orders.filter((o) => o.status === "settled").slice(0, 1).map((order) => (
                <div
                  key={order.orderId}
                  className="p-3 rounded-lg bg-surface-secondary/80 border border-surface-border flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-mono font-medium text-slate-200">
                      {order.orderId}
                    </p>
                    <p className="text-[11px] text-slate-400">{order.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-emerald-400">
                      ₹{order.amount.toFixed(2)}
                    </p>
                    <StatusBadge type="order" value={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-surface-border">
            <Link
              href="/customer/orders"
              className="w-full flex items-center justify-between text-xs font-mono text-cyan-300 hover:text-cyan-200 group"
            >
              <span>View Full Order Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 3: Autonomous AI Agent OS Status */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between hover:border-surface-borderHover transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Sparkles className="w-5 h-5" />
                <h2 className="font-display font-bold text-white text-base">
                  Agent Orchestration
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-5">
              Active sub-agents continuously verifying switch heartbeats and hardware acoustic packets.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  PaymentDisputeAgent
                </span>
                <span className="text-emerald-400 text-[11px]">ACTIVE (0ms lag)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  HardwareTelemetryAgent
                </span>
                <span className="text-emerald-400 text-[11px]">PINGING (142ms)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  PolicySafetyGuard
                </span>
                <span className="text-cyan-400 text-[11px]">POL-AUTO-v2.4</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-surface-border">
            <Link
              href="/customer/chat"
              className="w-full flex items-center justify-between text-xs font-mono text-cyan-300 hover:text-cyan-200 group"
            >
              <span>Engage Autonomous Chat</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
