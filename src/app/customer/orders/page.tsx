"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Receipt,
  Search,
  Filter,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [origin, setOrigin] = useState<"cosmos" | "unavailable">("unavailable");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/data?resource=orders");
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Failed to load orders");
          setOrigin("unavailable");
          return;
        }
        setOrigin("cosmos");
        setOrders(data.items || []);
        setSelectedOrder((data.items || [])[0] || null);
      } catch {
        if (!cancelled) setError("Network error loading Cosmos orders");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.utr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerIdentifier &&
        order.customerIdentifier.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <DataOriginBanner origin={origin} />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Orders & Collections
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Cosmos orders container for your merchant session (not a live NPCI stream).
          </p>
        </div>
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
            placeholder="Search order id / UTR"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-surface-border text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-lg bg-surface border border-surface-border text-sm appearance-none"
          >
            <option value="all">All statuses</option>
            {(["settled", "pending", "disputed", "refunded"] as OrderStatus[]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-2">
          {filteredOrders.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-surface-border text-slate-400 text-sm text-center">
              No orders found.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <button
                key={order.orderId}
                type="button"
                onClick={() => setSelectedOrder(order)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selectedOrder?.orderId === order.orderId
                    ? "bg-cyan-500/10 border-cyan-500/40"
                    : "bg-surface border-surface-border hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm text-white">{order.orderId}</span>
                  <StatusBadge type="order" value={order.status} />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  ₹{order.amount.toLocaleString("en-IN")} · {order.timestamp}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">{selectedOrder.orderId}</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">{selectedOrder.productType}</p>
                </div>
                <StatusBadge type="order" value={selectedOrder.status} />
              </div>

              {selectedOrder.status === "disputed" && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-100 text-xs flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {selectedOrder.disputeReason || "Disputed in Cosmos"}
                    {selectedOrder.disputeEscalationId
                      ? ` · Package ${selectedOrder.disputeEscalationId}`
                      : ""}
                  </span>
                </div>
              )}

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[11px] font-mono text-slate-500">Amount</dt>
                  <dd className="text-white">
                    {selectedOrder.currency} {selectedOrder.amount}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono text-slate-500">UTR / Ref</dt>
                  <dd className="text-white font-mono text-xs">{selectedOrder.utr}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono text-slate-500">Terminal</dt>
                  <dd className="text-white font-mono text-xs">
                    {selectedOrder.tracking.terminalId || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono text-slate-500">Channel / code</dt>
                  <dd className="text-white text-xs">
                    {selectedOrder.tracking.channel} · {selectedOrder.tracking.responseCode}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  href={`/customer/chat?order_id=${selectedOrder.orderId}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Ask Orchestrator
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-surface-border text-slate-500 text-sm flex items-center gap-2 justify-center">
              <HelpCircle className="w-4 h-4" /> Select an order
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
