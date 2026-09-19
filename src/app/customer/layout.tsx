import React from "react";
import { getCurrentCustomerSession } from "@/lib/auth";
import { getCustomer } from "@/lib/mockData";
import { CustomerNavbar } from "@/components/shell/CustomerNavbar";
import { CustomerFooter } from "@/components/shell/CustomerFooter";
import { redirect } from "next/navigation";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentCustomerSession();

  // If no valid session, redirect to customer login
  if (!session || session.role !== "customer") {
    redirect("/login/customer");
  }

  const customer = getCustomer(session.customerId);

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
