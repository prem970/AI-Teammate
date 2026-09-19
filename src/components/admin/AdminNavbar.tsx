"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  Activity,
  BarChart3,
  ShieldCheck,
  Users,
  Settings2,
  FileClock,
  LogOut,
  Menu,
  X,
  Server,
  Zap,
} from "lucide-react";
import { AdminSession } from "@/lib/adminAuth";

interface AdminNavbarProps {
  session: AdminSession;
}

export function AdminNavbar({ session }: AdminNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { label: "Home", href: "/admin", icon: LayoutDashboard },
    { label: "Agents", href: "/admin/agents", icon: Cpu, badge: "11" },
    { label: "Traces", href: "/admin/traces", icon: Activity },
    { label: "Metrics", href: "/admin/metrics", icon: BarChart3 },
    { label: "MCP", href: "/admin/mcp", icon: ShieldCheck },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Integrations", href: "/admin/integrations", icon: Settings2 },
    { label: "Audit", href: "/admin/audit", icon: FileClock },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/admin-logout", { method: "POST" });
      router.push("/login/admin");
      router.refresh();
    } catch {
      router.push("/login/admin");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border/90 bg-[#040711]/95 backdrop-blur-xl">
      {/* Top Cluster Health Strip */}
      <div className="bg-[#070b18] border-b border-surface-border/40 px-4 py-1 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-300 font-mono text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              ADMIN CONSOLE — AGENT CATALOG IS DOCUMENTATION (NOT LIVE HEARTBEATS)
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-300 font-mono text-[11px]">
              MCP: <strong className="text-white">probe Integrations for reachability</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span className="text-slate-400 hidden sm:inline">Metrics pages may show sample charts</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300">Admin Role: Superuser</span>
          </div>
        </div>
      </div>

      {/* Main Command Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Hero Signal */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/70 transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <Server className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Autonomous AI OS
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/15 border border-cyan-500/40 text-[9px] font-mono text-cyan-300 uppercase tracking-wider font-bold">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Platform Topology & MCP Command
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-cyan-300 bg-surface-elevated/90 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,229,255,0.1)]"
                      : "text-slate-300 hover:text-white hover:bg-surface-secondary/70 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-200">{session.name}</p>
              <p className="text-[10px] font-mono text-cyan-400">{session.email}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-surface-border hover:border-rose-500/30 transition-all disabled:opacity-50"
              title="Terminate admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "..." : "Logout"}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
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
        <div className="lg:hidden border-t border-surface-border bg-surface px-4 pt-3 pb-5 space-y-2 animate-page-enter">
          <div className="p-3 mb-2 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <p className="text-xs font-semibold text-white">{session.name}</p>
            <p className="text-[11px] font-mono text-cyan-400">{session.email}</p>
          </div>

          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "text-cyan-300 bg-surface-elevated border border-cyan-500/40"
                    : "text-slate-300 hover:bg-surface-secondary"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
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
              <span>Logout (Admin)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
