import React from "react";
import { getCurrentCustomerSession } from "@/lib/auth";
import { findCustomerById, isCosmosLive } from "@/lib/cosmos/repository";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";
import type { Customer } from "@/lib/types";

interface ChatPageProps {
  searchParams?: {
    order_id?: string;
    tid?: string;
  };
}

export default async function CustomerChatPage({ searchParams }: ChatPageProps) {
  const session = await getCurrentCustomerSession();
  const customerId = session?.customerId || "CUST-10291";
  const fromCosmos = isCosmosLive() ? await findCustomerById(customerId) : null;
  const customer: Customer =
    fromCosmos || {
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
    <div className="space-y-4">
      <DataOriginBanner origin={process.env.N8N_CS_ORCHESTRATOR_URL ? "cosmos" : "unavailable"} label="n8n CS Orchestrator for chat replies" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Support Chat (Orchestrator)
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Posts to N8N_CS_ORCHESTRATOR_URL. Replies are upstream-only — this UI does not invent refunds or device facts.
          </p>
        </div>
      </div>

      <ChatInterface
        customer={customer}
        initialOrderId={searchParams?.order_id}
        initialTid={searchParams?.tid}
      />
    </div>
  );
}
