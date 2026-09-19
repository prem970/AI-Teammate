import React from "react";
import Link from "next/link";
import { Lock, ShieldAlert, ArrowRight } from "lucide-react";
import { EmployeeRole } from "@/lib/opsTypes";

interface RoleGateNoticeProps {
  requiredRole: EmployeeRole;
  currentRole: EmployeeRole;
  featureName: string;
}

export function RoleGateNotice({
  requiredRole,
  currentRole,
  featureName,
}: RoleGateNoticeProps) {
  const getRoleName = (role: EmployeeRole) => {
    switch (role) {
      case "support":
        return "Support Operations";
      case "sales_ops":
        return "Sales Operations";
      case "policy_owner":
        return "Policy Owner / Compliance Officer";
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border text-center max-w-xl mx-auto space-y-4 my-10">
      <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
        <Lock className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h2 className="font-display text-lg font-bold text-white">
          Role Restricted: {featureName}
        </h2>
        <p className="text-xs text-slate-400 font-sans">
          This operation is gated to <strong>{getRoleName(requiredRole)}</strong>. You are currently operating as <strong>{getRoleName(currentRole)}</strong>.
        </p>
      </div>

      <div className="p-3 rounded-lg bg-surface-secondary border border-surface-border text-xs font-mono text-slate-300">
        Tip: You can use the <strong>Active Role dropdown</strong> at the top right to switch personas during testing.
      </div>

      <div className="pt-2">
        <Link
          href="/ops"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-secondary hover:bg-surface-elevated text-cyan-300 hover:text-white border border-surface-border text-xs font-mono transition-colors"
        >
          <span>Return to Ops Home</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
