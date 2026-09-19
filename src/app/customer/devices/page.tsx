"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, Search, MessageSquare, Wifi, Battery, Volume2 } from "lucide-react";
import { Device } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataOriginBanner } from "@/components/ui/DataOriginBanner";

export default function CustomerDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [origin, setOrigin] = useState<"cosmos" | "unavailable">("unavailable");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Device | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/data?resource=devices");
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Failed to load devices");
          return;
        }
        setOrigin("cosmos");
        setDevices(data.items || []);
        setSelected((data.items || [])[0] || null);
      } catch {
        if (!cancelled) setError("Network error loading Cosmos devices");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = devices.filter(
    (d) =>
      d.tid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <DataOriginBanner origin={origin} />
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Devices
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
          Cosmos devices container — lastSeen timestamps from seed/MCP updates, not a live IoT stream.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-200 text-xs">
          {error}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search TID / model"
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-surface-border text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-2">
          {filtered.map((device) => (
            <button
              key={device.tid}
              type="button"
              onClick={() => setSelected(device)}
              className={`w-full text-left p-4 rounded-xl border ${
                selected?.tid === device.tid
                  ? "bg-cyan-500/10 border-cyan-500/40"
                  : "bg-surface border-surface-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-white">{device.tid}</span>
                <StatusBadge type="device" value={device.status} />
              </div>
              <p className="text-xs text-slate-400 mt-1">{device.model}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-sm text-slate-400 border border-dashed border-surface-border rounded-xl text-center">
              No devices found.
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          {selected ? (
            <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="font-display text-xl font-bold text-white">{selected.tid}</h2>
                  <p className="text-xs text-slate-400">{selected.model}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-surface-secondary border border-surface-border">
                  <Wifi className="w-4 h-4 text-slate-400 mb-1" />
                  <p className="text-[11px] text-slate-500 font-mono">Network</p>
                  <p>{selected.network}</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-secondary border border-surface-border">
                  <Battery className="w-4 h-4 text-slate-400 mb-1" />
                  <p className="text-[11px] text-slate-500 font-mono">Paired</p>
                  <p>{selected.paired ? "Yes" : "No"}</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-secondary border border-surface-border">
                  <Volume2 className="w-4 h-4 text-slate-400 mb-1" />
                  <p className="text-[11px] text-slate-500 font-mono">Volume / FW</p>
                  <p>
                    L{selected.volumeLevel} · {selected.firmwareVersion}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-surface-secondary border border-surface-border">
                  <p className="text-[11px] text-slate-500 font-mono">Last seen</p>
                  <p className="text-xs">{selected.lastSeen || "—"}</p>
                </div>
              </div>
              <Link
                href={`/customer/chat?tid=${selected.tid}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Ask Orchestrator about this TID
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
