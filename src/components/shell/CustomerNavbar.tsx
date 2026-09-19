"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Cpu,
  MessageSquare,
  Receipt,
  Radio,
  AlertTriangle,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { Customer } from "@/lib/types";

interface CustomerNavbarProps {
  customer: Customer;
}

export function CustomerNavbar({ customer }: CustomerNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems: {
    label: string;
    href: string;
    icon: typeof Cpu;
    badge?: string;
  }[] = [
    { label: "Home", href: "/customer", icon: Cpu },
    { label: "Chat", href: "/customer/chat", icon: MessageSquare },
    { label: "Orders", href: "/customer/orders", icon: Receipt },
    { label: "Devices", href: "/customer/devices", icon: Radio },
    { label: "Case status", href: "/customer/escalations", icon: AlertTriangle },
    { label: "Account", href: "/customer/account", icon: User },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login/customer");
      router.refresh();
    } catch {
      router.push("/login/customer");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border/80 bg-background/85 backdrop-blur-xl">
      {/* Top Telemetry Alert Strip */}
      <div className="bg-surface-secondary/90 border-b border-surface-border/50 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              AUTONOMOUS AI OS • MERCHANT PORTAL
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300 font-medium">
              Merchant: <strong className="text-white">{customer.businessName}</strong> ({customer.id})
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span className="hidden sm:inline text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> Data: Cosmos when configured
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span>Chat: n8n Orchestrator</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Hero Signal */}
          <Link href="/customer" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/60 transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Autonomous AI OS
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 uppercase tracking-wider">
                  Customer
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
                SoundBox & POS Self-Serve Support
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/customer"
                  ? pathname === "/customer"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-cyan-300 bg-surface-elevated/90 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.08)]"
                      : "text-slate-300 hover:text-white hover:bg-surface-secondary/60 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
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

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right hidden lg:block">
              <p className="text-xs font-medium text-slate-200">{customer.name}</p>
              <p className="text-[10px] font-mono text-cyan-400">{customer.mid}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-surface-border hover:border-rose-500/30 transition-all disabled:opacity-50"
              title="Logout from merchant session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Exiting..." : "Logout"}</span>
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
          <div className="p-3 mb-2 rounded-lg bg-surface-secondary/70 border border-surface-border">
            <p className="text-xs font-semibold text-white">{customer.businessName}</p>
            <p className="text-[11px] font-mono text-cyan-400">MID: {customer.mid}</p>
          </div>

          {navItems.map((item) => {
            const isActive =
              item.href === "/customer"
                ? pathname === "/customer"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "text-cyan-300 bg-surface-elevated border border-cyan-500/30"
                    : "text-slate-300 hover:bg-surface-secondary"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
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
              <span>Logout ({customer.id})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
