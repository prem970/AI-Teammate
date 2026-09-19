import React from "react";
import { getCurrentCustomerSession } from "@/lib/auth";
import { getCustomer } from "@/lib/mockData";
import { ChatInterface } from "@/components/chat/ChatInterface";

interface ChatPageProps {
  searchParams?: {
    order_id?: string;
    tid?: string;
  };
}

export default async function CustomerChatPage({ searchParams }: ChatPageProps) {
  const session = await getCurrentCustomerSession();
  const customer = getCustomer(session?.customerId || "CUST-10291");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Autonomous Support Orchestrator
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time intent routing, hardware telemetry lookup, and NPCI payment switch reconciliation.
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
