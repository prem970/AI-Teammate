"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  Search,
  Filter,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  Clock,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { MOCK_ORDERS } from "@/lib/mockData";
import { Order, OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function CustomerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(MOCK_ORDERS[0]); // default select disputed ORD-DUP-1001

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.utr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerIdentifier &&
        order.customerIdentifier.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Order & Settlement Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Real-time transaction stream across SoundBox 4G, Dynamic POS QR, and Payment Gateway API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/customer/chat?order_id=ORD-DUP-1001"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>AI Dispute Assistant</span>
          </Link>
        </div>
      </div>

      {/* Disputed Spotlight Callout for ORD-DUP-1001 */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-surface to-surface-secondary border border-rose-500/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-1">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  Flagged Disputed Transaction
                </span>
                <span className="font-mono text-sm font-bold text-white">ORD-DUP-1001</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-mono text-slate-300">Amount: ₹1,450.00</span>
              </div>
              <p className="text-xs text-rose-200/90 mt-1.5 leading-relaxed font-sans max-w-3xl">
                <strong>Reason:</strong> Dual customer debit detected by bank switch during transient NPCI timeout. SoundBox played single receipt prompt. Autonomous AI OS has isolated the duplicate debit into escalation package <strong>ESC-90214</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/customer/escalations/ESC-90214"
              className="px-3.5 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-mono font-medium transition-colors"
            >
              View Escalation ESC-90214
            </Link>
            <Link
              href="/customer/chat?order_id=ORD-DUP-1001"
              className="px-3.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Audit via AI Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-surface-border">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, UTR, or UPI ID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-secondary border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["all", "disputed", "settled", "pending", "refunded"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors shrink-0 ${
                selectedStatus === status
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-surface-secondary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders Table / List (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-surface border border-surface-border overflow-hidden">
          <div className="p-4 border-b border-surface-border flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase">
              Transactions ({filteredOrders.length})
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Click order to inspect tracking payload
            </span>
          </div>

          <div className="divide-y divide-surface-border/60">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                No orders found matching the filter criteria.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrder?.orderId === order.orderId;
                const isDisputed = order.status === "disputed";

                return (
                  <div
                    key={order.orderId}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? "bg-surface-elevated/90 border-l-4 border-l-cyan-400"
                        : isDisputed
                        ? "bg-rose-500/5 hover:bg-rose-500/10"
                        : "hover:bg-surface-secondary/60"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {order.orderId}
                        </span>
                        <StatusBadge type="order" value={order.status} />
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        UTR: {order.utr}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {order.productType} • {order.timestamp}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono text-sm font-bold text-white">
                        ₹{order.amount.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {order.customerIdentifier}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Order Detail Panel (5 cols) */}
        <div className="lg:col-span-5">
          {selectedOrder ? (
            <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-5 sticky top-24">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Order Telemetry Inspection
                  </span>
                  <h3 className="font-mono text-lg font-bold text-white">
                    {selectedOrder.orderId}
                  </h3>
                </div>
                <StatusBadge type="order" value={selectedOrder.status} />
              </div>

              {/* Dispute Warning if applicable */}
              {selectedOrder.status === "disputed" && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Dispute & NPCI Reversal Active</span>
                  </div>
                  <p className="text-xs text-rose-200/90 font-sans">
                    {selectedOrder.disputeReason}
                  </p>
                  <Link
                    href={`/customer/escalations/${selectedOrder.disputeEscalationId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-300 hover:text-white underline pt-1"
                  >
                    <span>Inspect Escalation {selectedOrder.disputeEscalationId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Order Fields */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-slate-400">Total Transaction Amount</span>
                  <span className="font-bold text-white">
                    ₹{selectedOrder.amount.toFixed(2)} {selectedOrder.currency}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-slate-400">NPCI UTR</span>
                  <span className="text-cyan-300">{selectedOrder.utr}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-slate-400">Product Channel</span>
                  <span className="text-slate-200">{selectedOrder.productType}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-slate-400">Terminal Assigned</span>
                  <span className="text-slate-200">
                    {selectedOrder.tracking.terminalId || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-slate-400">Settlement Batch</span>
                  <span className="text-slate-200">
                    {selectedOrder.tracking.settlementBatch}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-slate-400">Switch Response Code</span>
                  <span className="text-emerald-400">
                    {selectedOrder.tracking.responseCode}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href={`/customer/chat?order_id=${selectedOrder.orderId}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discuss Order with AI Agent</span>
                </Link>

                {selectedOrder.tracking.terminalId?.startsWith("TID-") && (
                  <Link
                    href={`/customer/devices`}
                    className="w-full py-2 px-4 rounded-xl bg-surface-secondary hover:bg-surface-elevated text-slate-300 border border-surface-border text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View Terminal {selectedOrder.tracking.terminalId}</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-surface border border-surface-border text-center text-xs text-slate-500 font-mono">
              Select an order from the ledger to view full telemetry details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
