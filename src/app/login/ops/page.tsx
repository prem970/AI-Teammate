"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Terminal,
  ShieldAlert,
  FileCode2,
  TrendingUp,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Cpu,
  BadgeCheck,
} from "lucide-react";
import { EmployeeRole } from "@/lib/opsTypes";

function OpsLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/ops";

  const [selectedRole, setSelectedRole] = useState<EmployeeRole>("support");
  const [email, setEmail] = useState("support.agent@company.mock");
  const [password, setPassword] = useState("opsPass2026!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRoleSelect = (role: EmployeeRole, defaultEmail: string) => {
    setSelectedRole(role);
    setEmail(defaultEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/ops-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole, email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push(from);
        router.refresh();
      } else {
        setErrorMsg(data.error || "Failed to authenticate ops credentials.");
      }
    } catch {
      setErrorMsg("Network error connecting to internal ops authentication endpoint.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-7 sm:p-8 rounded-2xl bg-[#0c101a]/95 border border-surface-border hover:border-amber-500/40 shadow-2xl backdrop-blur-xl transition-all">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            Ops Console Sign In
          </h2>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300 uppercase">
            Staff Only
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Select your internal department persona to access the respective operations tools.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Role Selector Presets */}
      <div className="mb-5 space-y-2">
        <label className="block text-[11px] font-mono uppercase text-slate-400">
          Select Staff Role Preset:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleRoleSelect("support", "support.agent@company.mock")}
            className={`p-3 rounded-xl text-left transition-all border ${
              selectedRole === "support"
                ? "bg-amber-500/15 border-amber-500/50 text-white shadow-sm"
                : "bg-surface-secondary/70 border-surface-border text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="text-xs font-bold font-mono">Support Ops</span>
            </div>
            <p className="text-[11px] text-slate-200 truncate">Vikram Mehta</p>
            <p className="text-[10px] text-slate-500 font-mono">P1-P4 Escalations</p>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("sales_ops", "sales.ops@company.mock")}
            className={`p-3 rounded-xl text-left transition-all border ${
              selectedRole === "sales_ops"
                ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm"
                : "bg-surface-secondary/70 border-surface-border text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-bold font-mono">Sales Ops</span>
            </div>
            <p className="text-[11px] text-slate-200 truncate">Priya Iyer</p>
            <p className="text-[10px] text-slate-500 font-mono">Pipeline Handoffs</p>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("policy_owner", "policy.owner@company.mock")}
            className={`p-3 rounded-xl text-left transition-all border ${
              selectedRole === "policy_owner"
                ? "bg-purple-500/15 border-purple-500/50 text-white shadow-sm"
                : "bg-surface-secondary/70 border-surface-border text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-1.5 text-purple-400 mb-1">
              <FileCode2 className="w-3.5 h-3.5" />
              <span className="text-xs font-bold font-mono">Policy Owner</span>
            </div>
            <p className="text-[11px] text-slate-200 truncate">Devashish Roy</p>
            <p className="text-[10px] text-slate-500 font-mono">RAG Ingestion</p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            Internal Corporate Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-secondary border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            Security Key / Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-secondary border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
            Role Guarded Session
          </span>
          <span className="text-slate-500 text-[11px]">VPN Encrypted</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          <span>{isLoading ? "Validating Staff Session..." : "Enter Operations Console"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-surface-border text-center">
        <a
          href="/login/customer"
          className="text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
        >
          <span>Looking for Merchant / Customer Portal? Switch to /login/customer</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default function OpsLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#06080e] relative overflow-hidden">
      {/* Tactical ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[420px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-950 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Terminal className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Autonomous AI OS
            </span>
            <span className="ml-2 text-xs font-mono text-amber-400 uppercase font-bold">
              Employee / Ops Portal
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-secondary border border-surface-border text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Internal Staff Network</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Hero & Responsibilities (No card spam) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Human-in-the-Loop & Multi-Agent Oversight</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            Operations Console for{" "}
            <span className="text-gradient-cyan">Support, Sales & Policy</span> Staff.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
            Oversee autonomous agent actions across merchant dispute packages, policy vector embeddings, and enterprise sales handoffs. The Model Context Protocol (MCP) strictly enforces human authorization for financial refunds.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono text-slate-300">
            <div className="p-3 rounded-xl bg-surface-secondary/50 border border-surface-border">
              <ShieldAlert className="w-4 h-4 text-amber-400 mb-1.5" />
              <p className="font-bold text-white mb-0.5">Escalation Packages</p>
              <p className="text-[11px] text-slate-400">P1-P4 decisioning with evidence JSON viewer.</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary/50 border border-surface-border">
              <TrendingUp className="w-4 h-4 text-emerald-400 mb-1.5" />
              <p className="font-bold text-white mb-0.5">Multi-Agent Pipeline</p>
              <p className="text-[11px] text-slate-400">Outreach → Quote → Onboard stage audits.</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary/50 border border-surface-border">
              <FileCode2 className="w-4 h-4 text-purple-400 mb-1.5" />
              <p className="font-bold text-white mb-0.5">Policy RAG Ingest</p>
              <p className="text-[11px] text-slate-400">Upload markdown rules directly into n8n vector index.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Card */}
        <div className="lg:col-span-5 w-full">
          <Suspense
            fallback={
              <div className="p-8 rounded-2xl bg-[#0c101a] border border-surface-border text-center text-xs font-mono text-slate-400 animate-pulse">
                Loading Operations Authentication...
              </div>
            }
          >
            <OpsLoginForm />
          </Suspense>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 border-t border-surface-border/50 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        Autonomous AI OS © 2026 • Paytm Internal Operations Console • Role Protected Infrastructure
      </footer>
    </div>
  );
}
