import React from "react";
import { getCurrentCustomerSession } from "@/lib/auth";
import { findCustomerById, isCosmosLive } from "@/lib/cosmos/repository";
import { CustomerNavbar } from "@/components/shell/CustomerNavbar";
import { CustomerFooter } from "@/components/shell/CustomerFooter";
import { redirect } from "next/navigation";
import type { Customer } from "@/lib/types";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentCustomerSession();

  if (!session || session.role !== "customer") {
    redirect("/login/customer");
  }

  const fromCosmos = isCosmosLive()
    ? await findCustomerById(session.customerId)
    : null;

  const customer: Customer =
    fromCosmos || {
      id: session.customerId,
      mid: "UNKNOWN",
      name: session.name,
      email: session.email,
      businessName: session.name,
      businessType: "Merchant",
      segment: "unknown",
      preferredChannel: "WhatsApp",
      phone: "",
      registeredDate: "",
      settlementAccount: "Unavailable",
      kycStatus: "PENDING_UPDATE",
    };

  return (
    <div className="flex flex-col min-h-screen bg-background text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      <CustomerNavbar customer={customer} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-page-enter">
        {children}
      </main>
      <CustomerFooter />
    </div>
  );
}
