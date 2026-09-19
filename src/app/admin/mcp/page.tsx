import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Cpu,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowDown,
  ArrowRight,
  Server,
  FileCode2,
  Terminal,
} from "lucide-react";

export default function AdminMcpArchitecturePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Model Context Protocol (MCP) Single Security Boundary
          </h1>
          <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-300">
            Judges Architecture Brief
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
          How Autonomous AI OS enforces least-privilege tool execution, cryptographic agent identity, and human authorization.
        </p>
      </div>

      {/* Core Principle Callout */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/40 via-surface to-surface-secondary border-2 border-amber-500/50 space-y-3 shadow-xl">
        <div className="flex items-center gap-2.5 text-amber-400 font-mono text-sm font-bold uppercase">
          <ShieldCheck className="w-5 h-5" />
          <span>The Single Security Boundary Invariant</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
          In traditional multi-agent systems, agents frequently talk to external databases or payment switches directly via ad-hoc APIs, creating massive lateral attack surfaces. In <strong>Autonomous AI OS</strong>, <strong>all external tools without exception terminate behind the Model Context Protocol (MCP) Gateway</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-surface-secondary/80 border border-surface-border">
            <span className="text-amber-300 font-bold block mb-1">1. agent_id Verification</span>
            <p className="text-slate-400 text-[11px]">Every tool call transmits a cryptographic agent token matching an approved manifest.</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-secondary/80 border border-surface-border">
            <span className="text-emerald-300 font-bold block mb-1">2. ALLOW / DENY Engine</span>
            <p className="text-slate-400 text-[11px]">Tools not on the agent&apos;s allowlist trigger immediate termination and security alerts.</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-secondary/80 border border-surface-border">
            <span className="text-cyan-300 font-bold block mb-1">3. Human Sign-Off Gate</span>
            <p className="text-slate-400 text-[11px]">MCP does not auto-refund; financial reversals require explicit human operator signature.</p>
          </div>
        </div>
      </div>

      {/* Visual Single Boundary Architecture Graphic */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#060913] border border-surface-border space-y-6">
        <h2 className="font-display text-base font-bold text-white uppercase tracking-wider text-center">
          Architectural Execution Pipeline
        </h2>

        <div className="space-y-4 font-mono text-xs max-w-2xl mx-auto">
          {/* Box 1 */}
          <div className="p-4 rounded-xl bg-surface-secondary border border-cyan-500/40 text-center space-y-1">
            <p className="text-cyan-400 font-bold uppercase text-[11px]">Layer 1: Orchestration & Delegation</p>
            <p className="text-white text-sm font-semibold">Autonomous Supervisor (n8n Webhook)</p>
            <p className="text-[11px] text-slate-400">Classifies intent and delegates to domain specialists. Zero lateral mesh connections.</p>
          </div>

          <div className="flex justify-center text-cyan-400">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Box 2 */}
          <div className="p-4 rounded-xl bg-surface-secondary border border-blue-500/40 text-center space-y-1">
            <p className="text-blue-400 font-bold uppercase text-[11px]">Layer 2: Specialist Agent Requests Tool</p>
            <p className="text-white text-sm font-semibold">Specialist Node (e.g. OrdersAgent or PaymentCapabilityAgent)</p>
            <p className="text-[11px] text-slate-400">Transmits payload with `agent_id: &quot;agent_orders_v2&quot;` and `tool: &quot;fetch_order_by_id&quot;`</p>
          </div>

          <div className="flex justify-center text-amber-400">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Box 3: MCP Gateway (Highlight) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-surface-elevated to-amber-950/40 border-2 border-amber-500 text-center space-y-2 shadow-2xl">
            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase">
              Single Security Boundary
            </span>
            <h3 className="font-display text-base font-bold text-white">
              Railway MCP Gateway Server (`https://.../mcp`)
            </h3>
            <p className="text-slate-300 text-xs font-sans max-w-lg mx-auto leading-relaxed">
              Interprets Model Context Protocol JSON-RPC 2.0. Cross-examines caller against least-privilege matrix. If ALLOW, calls backend; if DENY, blocks call and writes audit log.
            </p>
          </div>

          <div className="flex justify-center text-emerald-400">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Box 4: Backends */}
          <div className="grid grid-cols-3 gap-3 text-center text-[11px]">
            <div className="p-3 rounded-lg bg-surface border border-surface-border">
              <span className="text-emerald-400 font-bold block">NPCI Switch</span>
              <span className="text-slate-400">Read-Only Logs</span>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-surface-border">
              <span className="text-cyan-400 font-bold block">Azure Cosmos DB</span>
              <span className="text-slate-400">Escalation Packages</span>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-surface-border">
              <span className="text-purple-400 font-bold block">Azure AI Search</span>
              <span className="text-slate-400">Policy Vectors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Demo DENY Scenario (For Judges) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-rose-500/40 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-rose-500/30 text-rose-400">
          <Lock className="w-5 h-5" />
          <h2 className="font-display text-base font-bold text-white">
            Demonstration Scenario: MCP Tool DENY Security Invariant
          </h2>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Suppose a prompt injection attempt or hallucination causes <code className="text-white font-mono">Orders & Accounts Agent</code> to invoke <code className="text-rose-400 font-mono">payment_refund</code> directly without going through the Human Escalation Agent:
        </p>

        <div className="p-4 rounded-xl bg-[#04060d] border border-rose-500/30 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-rose-400 text-[11px] font-bold">
            <span>TERMINATED INGRESS PACKET:</span>
            <span>HTTP 403 FORBIDDEN</span>
          </div>
          <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto">
{`{
  "jsonrpc": "2.0",
  "error": {
    "code": -32001,
    "message": "AGENT_FORBIDDEN_TOOL_CALL: agent_orders_v2 is strictly prohibited from invoking 'payment_refund'.",
    "mcpSecurityAlert": {
      "caller": "Orders & Accounts Agent (agent_orders_v2)",
      "targetTool": "payment_refund",
      "enforcedPolicy": "LEAST_PRIVILEGE_STRICT",
      "action": "DENIED_AND_LOGGED_TO_AUDIT"
    }
  }
}`}
          </pre>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Link
            href="/admin/traces/TRC-2026-DENY-01"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1.5 font-bold"
          >
            <span>Inspect Live Trace TRC-2026-DENY-01</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/audit"
            className="text-xs font-mono text-slate-400 hover:text-white"
          >
            View Audit Log
          </Link>
        </div>
      </div>
    </div>
  );
}
