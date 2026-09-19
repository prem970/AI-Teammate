"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldAlert,
  Users,
  FileCode2,
  TrendingUp,
  Bot,
  LogOut,
  Menu,
  X,
  Lock,
  Layers,
  Terminal,
  ChevronDown,
} from "lucide-react";
import { OpsSession } from "@/lib/opsAuth";
import { EmployeeRole } from "@/lib/opsTypes";

interface OpsNavbarProps {
  session: OpsSession;
}

export function OpsNavbar({ session }: OpsNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/ops", icon: Terminal },
    { label: "Escalations", href: "/ops/escalations", icon: ShieldAlert, badge: "P1" },
    { label: "Customers", href: "/ops/customers/CUST-10291", icon: Users },
    { label: "Policies", href: "/ops/policies", icon: FileCode2 },
    { label: "Sales Pipeline", href: "/ops/sales/pipeline", icon: TrendingUp },
    { label: "Assistant", href: "/ops/assistant", icon: Bot },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/ops-logout", { method: "POST" });
      router.push("/login/ops");
      router.refresh();
    } catch {
      router.push("/login/ops");
    }
  };

  const handleFastSwitchRole = async (targetRole: EmployeeRole) => {
    setRoleMenuOpen(false);
    try {
      const res = await fetch("/api/auth/ops-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // ignore
    }
  };

  const getRoleBadgeStyle = (role: EmployeeRole) => {
    switch (role) {
      case "support":
        return "bg-amber-500/15 text-amber-300 border-amber-500/40";
      case "sales_ops":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
      case "policy_owner":
        return "bg-purple-500/15 text-purple-300 border-purple-500/40";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border/90 bg-[#070a12]/95 backdrop-blur-xl">
      {/* Top Ops Telemetry Ribbon */}
      <div className="bg-[#0b0f19] border-b border-surface-border/50 px-4 py-1 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              OPS CONSOLE • INTERNAL STAFF
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-300 font-mono text-[11px]">
              Badge: <strong className="text-white">{session.badgeId}</strong> ({session.department})
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            {/* 1-Click Fast Role Switcher for seamless evaluation */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-surface-secondary/80 px-2 py-0.5 rounded border border-surface-border hover:border-slate-500 transition-colors"
                title="Switch active testing role"
              >
                <span>Active Role:</span>
                <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${getRoleBadgeStyle(session.role)}`}>
                  {session.role.replace("_", " ")}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 rounded-xl bg-surface border border-surface-border shadow-2xl p-1.5 z-50 animate-page-enter">
                  <p className="text-[10px] uppercase font-mono text-slate-400 px-2 py-1">
                    Fast Switch Ops Persona:
                  </p>
                  <button
                    onClick={() => handleFastSwitchRole("support")}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-surface-secondary flex items-center justify-between text-slate-200 hover:text-white"
                  >
                    <span>Support Ops (Vikram)</span>
                    <span className="text-[10px] font-mono text-amber-400">P1-P4</span>
                  </button>
                  <button
                    onClick={() => handleFastSwitchRole("sales_ops")}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-surface-secondary flex items-center justify-between text-slate-200 hover:text-white"
                  >
                    <span>Sales Ops (Priya)</span>
                    <span className="text-[10px] font-mono text-emerald-400">Pipeline</span>
                  </button>
                  <button
                    onClick={() => handleFastSwitchRole("policy_owner")}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-surface-secondary flex items-center justify-between text-slate-200 hover:text-white"
                  >
                    <span>Policy Owner (Devashish)</span>
                    <span className="text-[10px] font-mono text-purple-400">RAG Ingest</span>
                  </button>
                </div>
              )}
            </div>

            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline font-mono">HIL: human decision required</span>
          </div>
        </div>
      </div>

      {/* Main Ops Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Ops Console Brand Logo */}
          <Link href="/ops" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-950 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <Terminal className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Autonomous AI OS
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/15 border border-amber-500/30 text-[9px] font-mono text-amber-300 uppercase tracking-wider font-bold">
                  OPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Staff Console • Human-in-the-Loop
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/ops"
                  ? pathname === "/ops"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-amber-300 bg-surface-elevated/90 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                      : "text-slate-300 hover:text-white hover:bg-surface-secondary/70 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Profile & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right hidden lg:block">
              <p className="text-xs font-semibold text-slate-200">{session.name}</p>
              <p className="text-[10px] font-mono text-amber-400">{session.email}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-surface-border hover:border-rose-500/30 transition-all disabled:opacity-50"
              title="End staff ops session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "..." : "Logout"}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-secondary border border-surface-border"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface px-4 pt-3 pb-5 space-y-2 animate-page-enter">
          <div className="p-3 mb-2 rounded-lg bg-surface-secondary/70 border border-surface-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">{session.name}</p>
              <p className="text-[11px] font-mono text-amber-400">{session.email}</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${getRoleBadgeStyle(session.role)}`}>
              {session.role}
            </span>
          </div>

          {navItems.map((item) => {
            const isActive =
              item.href === "/ops"
                ? pathname === "/ops"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "text-amber-300 bg-surface-elevated border border-amber-500/40"
                    : "text-slate-300 hover:bg-surface-secondary"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-surface-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-rose-400 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout ({session.badgeId})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
