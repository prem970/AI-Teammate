import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAdminSession } from "@/lib/adminAuth";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminFooter } from "@/components/admin/AdminFooter";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentAdminSession();

  if (!session || session.role !== "admin") {
    redirect("/login/admin");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#040711] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      <AdminNavbar session={session} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-page-enter">
        {children}
      </main>
      <AdminFooter />
    </div>
  );
}
