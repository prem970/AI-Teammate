"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CustomerLoginPage() {
  const router = useRouter();
  const [from, setFrom] = useState("/customer");
  const [email, setEmail] = useState("sharma.kirana@example.com");
  const [password, setPassword] = useState("merchantPass2026!");
  const [selectedPreset, setSelectedPreset] = useState("CUST-10291");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFrom(params.get("from") || "/customer");
  }, []);

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
    <div className="min-h-screen flex flex-col justify-between bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

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

        <PulseIndicator label="ORCHESTRATOR READY" sublabel="Self-serve operations online" />
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
            Self-serve merchant portal: chat routes to the CS Orchestrator; orders, devices, and
            escalations read from Cosmos when configured.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-secondary/40 border border-surface-border">
              <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>SoundBox / POS device records</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-secondary/40 border border-surface-border">
              <Receipt className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Orders & dispute escalations</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-secondary/40 border border-surface-border">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Orchestrator chat + HIL packages</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 w-full">
          <div className="p-7 sm:p-8 rounded-2xl bg-surface/90 border border-surface-border hover:border-cyan-500/40 shadow-2xl backdrop-blur-xl transition-all">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                Merchant Sign In
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Sign in against Cosmos merchant records (seed data).
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mb-5 p-3 rounded-xl bg-surface-secondary border border-surface-border">
              <div className="text-[11px] font-mono uppercase text-slate-400 mb-2 flex items-center justify-between">
                <span>Cosmos merchants (ai_os seed):</span>
                <span className="text-cyan-400">1-Click Pre-fill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectPreset("CUST-10291", "sharma.kirana@example.com")
                  }
                  className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                    selectedPreset === "CUST-10291"
                      ? "bg-cyan-500/15 border-cyan-500/40 text-white shadow-sm"
                      : "bg-surface-elevated/60 border-transparent text-slate-300 hover:text-white"
                  }`}
                >
                  <span className="block font-semibold text-[11px] text-cyan-300 truncate">
                    Sharma Kirana
                  </span>
                  <span className="block text-[10px] font-mono text-slate-400">
                    CUST-10291 (SoundBox)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelectPreset("CUST-20442", "ops@cafebluebean.example")
                  }
                  className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                    selectedPreset === "CUST-20442"
                      ? "bg-cyan-500/15 border-cyan-500/40 text-white shadow-sm"
                      : "bg-surface-elevated/60 border-transparent text-slate-300 hover:text-white"
                  }`}
                >
                  <span className="block font-semibold text-[11px] text-cyan-300 truncate">
                    Cafe Blue Bean
                  </span>
                  <span className="block text-[10px] font-mono text-slate-400">
                    CUST-20442 (POS+SBX)
                  </span>
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
                    placeholder="sharma.kirana@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-secondary border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Password</label>
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
                  Role: customer
                </span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" /> Any password for demo
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
              Merchant self-serve portal. Ops and admin use separate logins.
            </p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-surface-border/50 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        Autonomous AI OS © 2026 • Merchant Self-Serve Portal
      </footer>
    </div>
  );
}
