import React from "react";
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  Lock,
  ArrowRight,
  Activity,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function AdminMetricsPage() {
  const priorityDistribution = [
    { priority: "P1 (Critical Reversals)", count: 1, percentage: "25%", color: "bg-rose-500", border: "border-rose-500" },
    { priority: "P2 (Hardware Alerts)", count: 1, percentage: "25%", color: "bg-amber-500", border: "border-amber-500" },
    { priority: "P3 (Recon Inquiries)", count: 1, percentage: "25%", color: "bg-blue-500", border: "border-blue-500" },
    { priority: "P4 (Supplies & Reprints)", count: 1, percentage: "25%", color: "bg-slate-500", border: "border-slate-500" },
  ];

  const toolDenyEvents = [
    { agent: "Orders & Accounts Agent", tool: "payment_refund", count: 24, reason: "Forbidden Tool Scope" },
    { agent: "Outreach Agent", tool: "override_mdr_floor", count: 8, reason: "Stage Violation" },
    { agent: "Knowledge Agent", tool: "read_customer_pii", count: 4, reason: "PII Shield Policy" },
    { agent: "Technical Support Agent", tool: "erase_device_cryptokeys", count: 2, reason: "HSM Hardware Guard" },
  ];

  const salesFunnel = [
    { stage: "Outreach (Agent1)", count: 142, conversion: "100%", value: "₹18,40,000" },
    { stage: "Follow-ups (Agent1)", count: 98, conversion: "69%", value: "₹12,80,000" },
    { stage: "Quoting (Agent2)", count: 54, conversion: "38%", value: "₹7,20,000" },
    { stage: "Negotiation (Agent2)", count: 32, conversion: "22%", value: "₹4,80,000" },
    { stage: "Onboarding (Agent3)", count: 21, conversion: "15%", value: "₹3,15,000" },
    { stage: "Closed-Won", count: 18, conversion: "12.6%", value: "₹2,70,000" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Operational Metrics & Safety Audits
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              Aggregated 30-Day
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Escalation priority breakdown, duplicate-charge reconciliation trends, and MCP tool DENY events.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>Security Invariant: <strong className="text-emerald-400">Zero Leakage</strong></span>
        </div>
      </div>

      {/* Grid: Priority Breakdown & Tool DENY Security Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escalation by Priority */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="font-display text-base font-bold text-white">
                Escalations by Priority Tier
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: 4 Active / Sample</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {priorityDistribution.map((item) => (
              <div key={item.priority} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{item.priority}</span>
                  <span className="font-bold text-white">{item.count} ({item.percentage})</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: item.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] font-mono text-slate-500">
            Note: All P1 issues are governed by policy PAYMENT-DUPLICATE-V2 requiring human sign-off.
          </div>
        </div>

        {/* MCP Tool DENY Security Invariant */}
        <div className="p-6 rounded-2xl bg-surface border border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2 text-rose-400">
              <Lock className="w-5 h-5" />
              <h2 className="font-display text-base font-bold text-white">
                MCP Tool DENY Events (38 Blocked)
              </h2>
            </div>
            <span className="text-xs font-mono text-rose-300 font-bold">Ring 0 Active</span>
          </div>

          <p className="text-xs text-slate-300 font-sans">
            Demonstrates least-privilege boundary: When specialist agents request tools outside their approved manifest, the MCP gateway strictly terminates execution.
          </p>

          <div className="space-y-2 font-mono text-xs">
            {toolDenyEvents.map((evt) => (
              <div
                key={evt.tool}
                className="p-3 rounded-xl bg-surface-secondary/80 border border-surface-border flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-bold">{evt.agent}</p>
                  <p className="text-[11px] text-rose-300">
                    Attempted: <code>{evt.tool}</code> ({evt.reason})
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold">
                  {evt.count} DENIED
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Pipeline Funnel Conversion Mock */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
            <h2 className="font-display text-base font-bold text-white">
              Multi-Agent Sales Funnel Progression
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            12.6% End-to-End Conversion
          </span>
        </div>

        <p className="text-xs text-slate-400 font-sans">
          Sequential stage handoffs across Agent1 (Outreach), Agent2 (Quote/Negotiate), and Agent3 (Onboard). Stage skipping is disabled.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 font-mono text-xs pt-2">
          {salesFunnel.map((step, idx) => (
            <div
              key={step.stage}
              className="p-3.5 rounded-xl bg-surface-secondary/70 border border-surface-border space-y-1.5"
            >
              <div className="flex items-center justify-between text-slate-500 text-[10px]">
                <span>Stage {idx + 1}</span>
                <span className="text-emerald-400 font-bold">{step.conversion}</span>
              </div>
              <p className="text-white font-bold text-xs truncate">{step.stage}</p>
              <p className="text-sm font-bold text-slate-200">{step.count} Leads</p>
              <p className="text-[10px] text-slate-400">{step.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
