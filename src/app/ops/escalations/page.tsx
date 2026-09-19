"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";
import { PriorityLevel, EscalationState, EscalationPackage } from "@/lib/opsTypes";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";

export default function OpsEscalationsQueuePage() {
  const [items, setItems] = useState<EscalationPackage[]>([]);
  const [origin, setOrigin] = useState<"cosmos" | "unavailable">("unavailable");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/data?resource=escalations");
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Failed to load escalations");
          return;
        }
        setOrigin("cosmos");
        setItems(data.items || []);
      } catch {
        if (!cancelled) setError("Network error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEscalations = items.filter((item) => {
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
        return "bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold";
      case "P2":
        return "bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold";
      case "P3":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40 font-medium";
      default:
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
      default:
        return "bg-slate-500/15 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <DataOriginBanner origin={origin} />
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Escalation Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
          Cosmos escalations container — not a mock store. Decisions PATCH back to Cosmos.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-200 text-xs">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ESC / customer / order"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-surface-border text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-lg bg-surface border border-surface-border text-sm appearance-none"
          >
            <option value="all">All priorities</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
          </select>
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-surface border border-surface-border text-sm"
        >
          <option value="all">All statuses</option>
          <option value="open">open</option>
          <option value="in_review">in_review</option>
          <option value="resolved">resolved</option>
          <option value="returned">returned</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-surface-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary text-[11px] font-mono text-slate-400 uppercase">
            <tr>
              <th className="text-left px-4 py-3">Package</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Priority</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Issue</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filteredEscalations.map((item) => (
              <tr key={item.escalationId} className="border-t border-surface-border hover:bg-surface-secondary/50">
                <td className="px-4 py-3 font-mono text-cyan-300">{item.escalationId}</td>
                <td className="px-4 py-3 font-mono text-xs">{item.customerId}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${getPriorityBadge(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{item.issue}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/ops/escalations/${item.escalationId}`}
                    className="inline-flex items-center gap-1 text-xs text-cyan-300"
                  >
                    Open <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEscalations.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4" /> No packages match filters
          </div>
        )}
      </div>
    </div>
  );
}
