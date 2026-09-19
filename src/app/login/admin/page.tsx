"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Server,
  ShieldCheck,
  Cpu,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Activity,
  Terminal,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("admin.super@company.mock");
  const [password, setPassword] = useState("adminSecurityKey2026!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push(from);
        router.refresh();
      } else {
        setErrorMsg(data.error || "Failed to authenticate administrator session.");
      }
    } catch {
      setErrorMsg("Network error contacting admin authentication gateway.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-7 sm:p-8 rounded-2xl bg-[#090d1a]/95 border border-surface-border hover:border-cyan-500/40 shadow-2xl backdrop-blur-xl transition-all">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            Administrator Sign In
          </h2>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 uppercase">
            Ring 0 Security
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Access platform topology, execution traces, MCP security logs, and integration health.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Pre-fill Preset Banner */}
      <div className="mb-5 p-3 rounded-xl bg-surface-secondary border border-surface-border flex items-center justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase text-slate-400">Pre-configured Persona:</p>
          <p className="text-xs font-bold text-white">Platform Super Admin</p>
          <p className="text-[10px] font-mono text-cyan-400">admin.super@company.mock</p>
        </div>
        <span className="px-2 py-1 rounded bg-cyan-500/15 text-cyan-300 text-[10px] font-mono font-bold">
          1-Click Ready
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            Admin Corporate Identity
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-secondary border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            Master Security Key
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-secondary border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <span>{isLoading ? "Validating Admin Session..." : "Enter Platform Command Center"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-surface-border flex items-center justify-between text-xs font-mono text-slate-400">
        <a href="/login/ops" className="hover:text-amber-400 transition-colors">
          Switch to Ops Console
        </a>
        <a href="/login/customer" className="hover:text-cyan-400 transition-colors">
          Merchant Portal
        </a>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#040711] relative overflow-hidden">
      {/* Deep atmospheric glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Server className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Autonomous AI OS
            </span>
            <span className="ml-2 text-xs font-mono text-cyan-400 uppercase font-bold">
              ADMIN COMMAND
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-secondary border border-surface-border text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Core Invariant: Hub-and-Spoke MCP</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Hero Mission */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Platform Governance & Security Ring 0</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            Platform Health, Topology &{" "}
            <span className="text-gradient-cyan">MCP Gateway</span> Command.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
            Oversee autonomous agent health across 11 specialist nodes. Verify Model Context Protocol (MCP) tool ALLOW vs DENY execution boundaries, inspect animated execution traces, and audit user permissions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono text-slate-300">
            <div className="p-3 rounded-xl bg-surface-secondary/60 border border-surface-border">
              <Cpu className="w-4 h-4 text-cyan-400 mb-1.5" />
              <p className="font-bold text-white mb-0.5">11 Specialist Nodes</p>
              <p className="text-[11px] text-slate-400">No lateral mesh lines; strict hub-and-spoke.</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary/60 border border-surface-border">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1.5" />
              <p className="font-bold text-white mb-0.5">MCP Single Boundary</p>
              <p className="text-[11px] text-slate-400">Least privilege tool allowlist per agent.</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary/60 border border-surface-border">
              <Terminal className="w-4 h-4 text-purple-400 mb-1.5" />
              <p className="font-bold text-white mb-0.5">Full Trace Timeline</p>
              <p className="text-[11px] text-slate-400">Intent → Specialist → MCP → Action audits.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Card */}
        <div className="lg:col-span-5 w-full">
          <Suspense
            fallback={
              <div className="p-8 rounded-2xl bg-[#090d1a] border border-surface-border text-center text-xs font-mono text-slate-400 animate-pulse">
                Loading Admin Gateway...
              </div>
            }
          >
            <AdminLoginForm />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-surface-border/40 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        Autonomous AI OS © 2026 • Platform Admin Console • Ring 0 Protected Session
      </footer>
    </div>
  );
}
