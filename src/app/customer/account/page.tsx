import React from "react";
import { getCurrentCustomerSession } from "@/lib/auth";
import { findCustomerById, isCosmosLive } from "@/lib/cosmos/repository";
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
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";
import type { Customer } from "@/lib/types";

export default async function CustomerAccountPage() {
  const session = await getCurrentCustomerSession();
  const customerId = session?.customerId || "CUST-10291";
  const origin = isCosmosLive() ? "cosmos" : "unavailable";
  const customer: Customer =
    (await findCustomerById(customerId)) || {
      id: customerId,
      mid: "UNKNOWN",
      name: session?.name || "Merchant",
      email: session?.email || "",
      businessName: session?.name || "Merchant",
      businessType: "Merchant",
      segment: "unknown",
      preferredChannel: "WhatsApp",
      phone: "",
      registeredDate: "",
      settlementAccount: "Unavailable",
      kycStatus: "PENDING_UPDATE",
    };

  return (
    <div className="space-y-6">
      <DataOriginBanner origin={origin} />
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Merchant Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
          Read-only profile from Cosmos customers + accounts containers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl font-bold font-display shadow-md">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">{customer.name}</h2>
                  <p className="text-sm text-slate-400 font-mono">{customer.businessName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                KYC: {customer.kycStatus}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoRow icon={Mail} label="Email" value={customer.email} />
              <InfoRow icon={Phone} label="Phone" value={customer.phone || "—"} />
              <InfoRow icon={Building} label="Business type" value={customer.businessType} />
              <InfoRow icon={Layers} label="Segment" value={customer.segment} />
              <InfoRow icon={Radio} label="Preferred channel" value={customer.preferredChannel} />
              <InfoRow icon={Calendar} label="Registered" value={customer.registeredDate || "—"} />
              <InfoRow icon={CreditCard} label="MID" value={customer.mid} />
              <InfoRow icon={ShieldCheck} label="Settlement" value={customer.settlementAccount} />
              <InfoRow icon={User} label="Customer ID" value={customer.id} />
              <InfoRow icon={Lock} label="Portal access" value="Session cookie (demo auth)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-surface-secondary border border-surface-border">
      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="text-slate-100 text-sm break-all">{value}</p>
    </div>
  );
}
