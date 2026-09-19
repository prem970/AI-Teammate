import React from "react";
import { redirect } from "next/navigation";
import { getCurrentOpsSession } from "@/lib/opsAuth";
import { OpsNavbar } from "@/components/ops/OpsNavbar";
import { OpsFooter } from "@/components/ops/OpsFooter";

export default async function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentOpsSession();

  if (!session || !["support", "sales_ops", "policy_owner"].includes(session.role)) {
    redirect("/login/ops");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#070a12] text-slate-100 selection:bg-amber-500/20 selection:text-amber-300">
      <OpsNavbar session={session} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-page-enter">
        {children}
      </main>
      <OpsFooter />
    </div>
  );
}
