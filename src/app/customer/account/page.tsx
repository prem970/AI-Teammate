import React from "react";
import { getCurrentCustomerSession } from "@/lib/auth";
import { getCustomer } from "@/lib/mockData";
import {
  User,
  ShieldCheck,
  Building,
  CreditCard,
  Mail,
  Phone,
  Radio,
  Lock,
  Calendar,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default async function CustomerAccountPage() {
  const session = await getCurrentCustomerSession();
  const customer = getCustomer(session?.customerId || "CUST-10291");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Merchant Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
          Registered business credentials and autonomous notification channels (Read-Only Customer View).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Profile Info (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl font-bold font-display shadow-md">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {customer.name}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">{customer.businessName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  KYC Verified
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Role: Customer
                </span>
              </div>
            </div>

            {/* Read-Only Account Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-surface-secondary/70 border border-surface-border space-y-1">
                <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-cyan-400" /> Merchant ID (MID)
                </span>
                <p className="text-white font-bold text-sm">{customer.mid}</p>
                <p className="text-[10px] text-slate-500">Internal ID: {customer.id}</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary/70 border border-surface-border space-y-1">
                <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Merchant Segment
                </span>
                <p className="text-white font-semibold">{customer.segment}</p>
                <p className="text-[10px] text-slate-500">{customer.businessType}</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary/70 border border-surface-border space-y-1">
                <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Registered Email (Read-Only)
                </span>
                <p className="text-white font-medium">{customer.email}</p>
                <p className="text-[10px] text-slate-500">Used for transaction summaries</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary/70 border border-surface-border space-y-1">
                <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" /> Registered Phone
                </span>
                <p className="text-white font-medium">{customer.phone}</p>
                <p className="text-[10px] text-slate-500">Used for OTP and SoundBox alerts</p>
              </div>

              <div className="col-span-1 sm:col-span-2 p-4 rounded-xl bg-surface-secondary/70 border border-surface-border space-y-1">
                <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Settlement Bank Account
                </span>
                <p className="text-emerald-300 font-bold text-sm">
                  {customer.settlementAccount}
                </p>
                <p className="text-[10px] text-slate-500">
                  Daily clearing cycle: 06:00 PM IST automatically credited
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Notification Channel & Permissions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Autonomous Alerts Channel
            </h3>

            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 font-semibold">Active Dispatch Mode</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 text-[10px]">
                  {customer.preferredChannel}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Critical payment reversals and SoundBox offline pings are forwarded directly to your registered {customer.preferredChannel} endpoint.
              </p>
            </div>

            <div className="pt-2 text-xs font-mono text-slate-400 space-y-2">
              <div className="flex items-center justify-between py-1 border-b border-surface-border">
                <span>SoundBox Voice Prompts</span>
                <span className="text-emerald-400">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-surface-border">
                <span>Dual Debit Auto-Detection</span>
                <span className="text-emerald-400">Instant</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Escalation SMS Alert</span>
                <span className="text-emerald-400">Enabled</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Customer Access Scope</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              You are signed in under the <strong>customer / merchant role</strong>. Autonomous agent governance, clearing policy modification, and direct orchestrator training are restricted to compliance administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
