"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function OpsLoginPage() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [selectedRole, setSelectedRole] = useState<EmployeeRole>("sales_ops");
  const [email, setEmail] = useState("sales.ops@company.mock");
  const [password, setPassword] = useState("opsPass2026!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFrom(params.get("from") || "");
  }, []);

  const defaultDestForRole = (role: EmployeeRole) =>
    role === "sales_ops" ? "/ops/sales/pipeline" : "/ops";

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
        const dest = from || data.redirectTo || defaultDestForRole(selectedRole);
        router.push(dest);
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
    <div className="min-h-screen flex flex-col justify-between bg-[#070a12] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Autonomous AI OS
            </span>
            <span className="ml-2 text-xs font-mono text-amber-400">OPS CONSOLE</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-400 inline-flex items-center gap-1.5">
          <BadgeCheck className="w-3.5 h-3.5 text-amber-400" /> Demo staff login
        </span>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>Human-in-the-loop operations</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            Escalations, policy ingest, and lead outreach for staff.
          </h1>
          <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
            Pick <strong className="text-emerald-300 font-normal">Sales Ops</strong> to follow
            Cosmos leads and trigger outreach drafts. Escalations and policy ingest use the other
            roles. Staff auth is demo cookies (not SSO).
          </p>
        </div>

        <div className="lg:col-span-5 w-full">
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
                  <span className="block text-[11px] text-slate-200 truncate">Vikram Mehta</span>
                  <span className="block text-[10px] text-slate-500 font-mono">P1-P4 Escalations</span>
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
                  <span className="block text-[11px] text-slate-200 truncate">Priya Iyer</span>
                  <span className="block text-[10px] text-slate-500 font-mono">Lead outreach</span>
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
                  <span className="block text-[11px] text-slate-200 truncate">Devashish Roy</span>
                  <span className="block text-[10px] text-slate-500 font-mono">RAG Ingestion</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Staff Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-secondary border border-surface-border text-sm text-white focus:outline-none focus:border-amber-400"
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-secondary border border-surface-border text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isLoading ? "Authenticating..." : "Enter Ops Console"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-surface-border/50 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        Autonomous AI OS © 2026 • Internal Ops Console
      </footer>
    </div>
  );
}
