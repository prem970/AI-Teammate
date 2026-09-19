"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  FileCode2,
} from "lucide-react";
import { INITIAL_ESCALATIONS } from "@/lib/opsMockData";
import { PriorityLevel, EscalationState } from "@/lib/opsTypes";

export default function OpsEscalationsQueuePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredEscalations = INITIAL_ESCALATIONS.filter((item) => {
    const matchesSearch =
      item.escalationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.issue.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      selectedPriority === "all" || item.priority === selectedPriority;

    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case "P1":
        return "bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold animate-pulse";
      case "P2":
        return "bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold";
      case "P3":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40 font-medium";
      case "P4":
        return "bg-slate-500/20 text-slate-400 border-slate-500/40 font-medium";
    }
  };

  const getStatusBadge = (status: EscalationState) => {
    switch (status) {
      case "open":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "in_review":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "resolved":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "returned":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Escalation Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-300">
              Cosmos DB Store
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Incoming Model Context Protocol (MCP) packages awaiting human authorization or review.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            P1 Active: ESC-90214
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ESC ID, Customer, or Order..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-secondary border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Priority Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Priority:</span>
          {["all", "P1", "P2", "P3", "P4"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                selectedPriority === p
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-white hover:bg-surface-secondary"
              }`}
            >
              {p}
            </button>
          ))}

          <span className="text-slate-600 mx-1">|</span>

          {/* Status Tabs */}
          <span className="text-[11px] font-mono text-slate-400 mr-1">Status:</span>
          {["all", "open", "in_review", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                selectedStatus === s
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-white hover:bg-surface-secondary"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Escalation Queue Table */}
      <div className="rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-secondary/80 border-b border-surface-border text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Escalation ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Order / Item</th>
                <th className="py-3 px-4">Governing Policy</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {filteredEscalations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No escalation packages match the active filter.
                  </td>
                </tr>
              ) : (
                filteredEscalations.map((item) => (
                  <tr
                    key={item.escalationId}
                    className="hover:bg-surface-secondary/50 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] border ${getPriorityBadge(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Link
                        href={`/ops/escalations/${item.escalationId}`}
                        className="text-white font-bold hover:text-amber-400 flex items-center gap-1.5"
                      >
                        <span>{item.escalationId}</span>
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <Link
                        href={`/ops/customers/${item.customerId}`}
                        className="text-cyan-300 hover:text-cyan-200 underline decoration-cyan-500/30"
                        title="Inspect Customer Memory"
                      >
                        {item.customerId}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {item.orderId}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 text-[11px]">
                        {item.policyId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] uppercase border font-semibold ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {item.createdAt}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/ops/escalations/${item.escalationId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-amber-300 border border-surface-border text-xs group-hover:border-amber-500/40 transition-colors"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
