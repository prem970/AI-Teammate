"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  ShieldCheck,
  Zap,
  ArrowDown,
  Layers,
  CheckCircle2,
  ExternalLink,
  Lock,
  ArrowRight,
} from "lucide-react";
import { MOCK_AGENTS } from "@/lib/adminMockData";

export function AgentTopologyMap() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("orders-accounts-agent");
  const selectedAgent = MOCK_AGENTS.find((a) => a.id === selectedAgentId) || MOCK_AGENTS[1];

  const csSpecialists = MOCK_AGENTS.filter(
    (a) => a.category === "Customer Support"
  );
  const salesSpecialists = MOCK_AGENTS.filter(
    (a) => a.category === "Sales Ops"
  );

  return (
    <div className="space-y-6">
      {/* Topology Canvas */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#060913] border border-surface-border relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-surface-border">
          <div>
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Multi-Agent Hub-and-Spoke Topology</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Strict Security Model: Orchestrator Center → Specialist Agents → MCP Gateway (Zero Mesh Lines)
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>11 Specialist Nodes Synchronized</span>
          </div>
        </div>

        {/* Strict Topology Graphic */}
        <div className="py-8 relative">
          {/* 1. TOP: Central Orchestrator Node */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />
              <div className="relative px-6 py-4 rounded-xl bg-surface-elevated border border-cyan-400/80 shadow-2xl flex items-center gap-3.5 text-center">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shrink-0">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold block">
                    Central Supervisor Hub
                  </span>
                  <span className="font-display font-bold text-base text-white">
                    Autonomous CS & Sales Orchestrator
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Intent Classification • State Transitions • Specialist Dispatch
                  </span>
                </div>
              </div>
            </div>

            {/* Vertical Flow Spoke down from Orchestrator */}
            <div className="w-0.5 h-10 bg-gradient-to-b from-cyan-400 to-slate-700 my-1 flex items-center justify-center relative">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 pb-4">
              Direct Hub-to-Specialist Dispatch (No Agent-to-Agent Lateral Lines)
            </div>
          </div>

          {/* 2. MIDDLE: Specialist Agents (CS on Left, Sales on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-2">
            {/* Left: Customer Support Specialists */}
            <div className="p-4 rounded-xl bg-surface/70 border border-surface-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border/60">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  CS Domain Specialists ({csSpecialists.length})
                </span>
                <span className="text-[10px] font-mono text-slate-500">Tenant-Isolated</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                {csSpecialists.map((agent) => {
                  const isSelected = selectedAgentId === agent.id;
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={`p-3 rounded-lg text-left transition-all border ${
                        isSelected
                          ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                          : "bg-surface-secondary/70 border-surface-border text-slate-300 hover:border-slate-500 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px] text-white truncate">
                          {agent.name.replace(" Agent", "")}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {agent.allowedTools.length} Allowed Tools
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Sales Multi-Agent Pipeline */}
            <div className="p-4 rounded-xl bg-surface/70 border border-surface-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border/60">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Sales Pipeline Specialists ({salesSpecialists.length})
                </span>
                <span className="text-[10px] font-mono text-slate-500">Stage Gated</span>
              </div>

              <div className="grid grid-cols-1 gap-2 font-mono text-xs">
                {salesSpecialists.map((agent) => {
                  const isSelected = selectedAgentId === agent.id;
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={`p-3 rounded-lg text-left transition-all border ${
                        isSelected
                          ? "bg-emerald-500/15 border-emerald-400 text-white shadow-md shadow-emerald-500/10"
                          : "bg-surface-secondary/70 border-surface-border text-slate-300 hover:border-slate-500 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px] text-white">
                          {agent.name}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {agent.stageOwnership} • {agent.allowedTools.length} Tools
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Spoke down to MCP Gateway */}
          <div className="flex flex-col items-center pt-3 pb-1">
            <div className="w-0.5 h-10 bg-gradient-to-b from-slate-700 to-amber-500 flex items-center justify-center relative">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 py-1 flex items-center gap-1.5">
              <span>All Tool Calls Terminate in MCP Gateway</span>
              <ArrowDown className="w-3 h-3 text-amber-400" />
            </div>
          </div>

          {/* 3. BOTTOM: Model Context Protocol (MCP) Single Security Boundary */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/30 border-2 border-amber-500/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-bold text-white">
                    Model Context Protocol (MCP) Security Gateway
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                    ALLOW / DENY ENFORCEMENT
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  Single ingress point for all tool calls. Verifies <code className="text-amber-400 font-mono">agent_id</code> against the least-privilege matrix. Blocks unauthorized tool calls (e.g. OrdersAgent calling payment refund).
                </p>
              </div>
            </div>

            <Link
              href="/admin/mcp"
              className="shrink-0 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Inspect MCP Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Selected Node Drawer / Detail Card */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display text-base font-bold text-white">
              Selected Agent: {selectedAgent.name}
            </h3>
            <span className="text-xs font-mono text-slate-400">
              (MCP ID: <code className="text-cyan-300">{selectedAgent.mcpAgentId}</code>)
            </span>
          </div>

          <Link
            href={`/admin/agents/${selectedAgent.id}`}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Least-Privilege Matrix</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {selectedAgent.purpose}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-1">
          {/* Allowed Tools */}
          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/25 space-y-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Allowed Tools ({selectedAgent.allowedTools.length}):
            </span>
            <div className="space-y-1.5">
              {selectedAgent.allowedTools.map((tool) => (
                <div key={tool.toolName} className="flex items-start justify-between gap-2">
                  <code className="text-slate-200 font-semibold">{tool.toolName}</code>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    {tool.actionScope}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Prohibited Tools (Does NOT have) */}
          <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/25 space-y-2">
            <span className="text-[11px] font-bold text-rose-400 uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Prohibited Tools / Does NOT Have ({selectedAgent.prohibitedTools.length}):
            </span>
            <div className="space-y-1.5">
              {selectedAgent.prohibitedTools.map((tool) => (
                <div key={tool.toolName} className="space-y-0.5">
                  <code className="text-rose-300 font-semibold">{tool.toolName}</code>
                  <p className="text-[10px] text-slate-400 font-sans">{tool.whyBlocked}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
