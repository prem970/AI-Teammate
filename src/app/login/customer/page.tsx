"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Cpu,
  ShieldCheck,
  Radio,
  Receipt,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { PulseIndicator } from "@/components/ui/PulseIndicator";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/customer";

  const [email, setEmail] = useState("rajesh.retail@merchants.paytm.mock");
  const [password, setPassword] = useState("merchantPass2026!");
  const [selectedPreset, setSelectedPreset] = useState("CUST-10291");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectPreset = (presetId: string, presetEmail: string) => {
    setSelectedPreset(presetId);
    setEmail(presetEmail);
    setPassword("merchantPass2026!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          customerId: selectedPreset,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push(from);
        router.refresh();
      } else {
        setErrorMsg(data.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setErrorMsg("Network error contacting autonomous authentication gateway.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-7 sm:p-8 rounded-2xl bg-surface/90 border border-surface-border hover:border-cyan-500/40 shadow-2xl backdrop-blur-xl transition-all">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-white tracking-tight">
          Merchant Sign In
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your terminal telemetry, disputed orders, and autonomous resolution agent.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Demo Merchant Switcher */}
      <div className="mb-5 p-3 rounded-xl bg-surface-secondary border border-surface-border">
        <p className="text-[11px] font-mono uppercase text-slate-400 mb-2 flex items-center justify-between">
          <span>Select Demo Merchant Profile:</span>
          <span className="text-cyan-400">1-Click Pre-fill</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              handleSelectPreset(
                "CUST-10291",
                "rajesh.retail@merchants.paytm.mock"
              )
            }
            className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
              selectedPreset === "CUST-10291"
                ? "bg-cyan-500/15 border-cyan-500/40 text-white shadow-sm"
                : "bg-surface-elevated/60 border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <p className="font-semibold text-[11px] text-cyan-300 truncate">
              Rajesh Supermarket
            </p>
            <p className="text-[10px] font-mono text-slate-400">CUST-10291 (SoundBox)</p>
          </button>

          <button
            type="button"
            onClick={() =>
              handleSelectPreset(
                "CUST-20442",
                "anita.sharma@digitalmart.mock"
              )
            }
            className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
              selectedPreset === "CUST-20442"
                ? "bg-cyan-500/15 border-cyan-500/40 text-white shadow-sm"
                : "bg-surface-elevated/60 border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <p className="font-semibold text-[11px] text-cyan-300 truncate">
              Sharma Digital
            </p>
            <p className="text-[10px] font-mono text-slate-400">CUST-20442 (POS/API)</p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            Merchant Registered Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@paytm.mock"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-secondary border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-secondary border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Role: customer (Protected)
          </span>
          <span className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Merchant Help
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <span>{isLoading ? "Authenticating Session..." : "Enter Merchant Portal"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-[11px] text-slate-400 text-center mt-5 font-mono">
        Note: Autonomous AI OS strictly provides Customer / Merchant self-serve capabilities. Administrative configuration and policy editing are restricted.
      </p>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Autonomous AI OS
            </span>
            <span className="ml-2 text-xs font-mono text-cyan-400">CUSTOMER / MERCHANT PORTAL</span>
          </div>
        </div>

        <PulseIndicator
          label="ORCHESTRATOR READY"
          sublabel="Self-serve operations online"
        />
      </header>

      {/* Main Content: Hero & Login Form */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Brand Hero Signal & Mission */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous AI Operating System for Paytm Merchants</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Instant self-serve support for your{" "}
            <span className="text-gradient-cyan">SoundBox, POS & API</span> operations.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
            Eliminate phone queues and manual tickets. Your merchant terminal telemetry is monitored 24/7 by specialized autonomous agents capable of resolving UPI payment disputes, reconciling dual debits, diagnosing hardware packets, and clearing settlements in real time.
          </p>

          {/* Product Capabilities list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-secondary/40 border border-surface-border">
              <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>SoundBox 4G Telemetry & Audio Diagnostics</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-secondary/40 border border-surface-border">
              <Receipt className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Automated Dual-Debit & UPI Dispute Reconciler</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-secondary/40 border border-surface-border">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Transparent AI Trace & Policy Safety Bounds</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-density interactive login card */}
        <div className="lg:col-span-5 w-full">
          <Suspense
            fallback={
              <div className="p-8 rounded-2xl bg-surface border border-surface-border text-center text-xs font-mono text-slate-400 animate-pulse">
                Loading Autonomous Sign-In Gateway...
              </div>
            }
          >
            <CustomerLoginForm />
          </Suspense>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 border-t border-surface-border/50 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        Autonomous AI OS © 2026 • Paytm Merchant Self-Serve Infrastructure • End-to-End Encrypted Session
      </footer>
    </div>
  );
}
