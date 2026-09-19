"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Radio,
  Wifi,
  Battery,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  Activity,
  Cpu,
  Smartphone,
  Signal,
} from "lucide-react";
import { MOCK_DEVICES } from "@/lib/mockData";
import { Device } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function CustomerDevicesPage() {
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [pingingTid, setPingingTid] = useState<string | null>(null);
  const [pingResults, setPingResults] = useState<Record<string, string>>({});

  const handleRunDiagnostic = (tid: string) => {
    setPingingTid(tid);
    setTimeout(() => {
      setPingingTid(null);
      setPingResults((prev) => ({
        ...prev,
        [tid]: `Diagnostic Ping Passed: OTA Acoustic Packet ACK received in 138ms. Hardware firmware status: HEALTHY.`,
      }));
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            SoundBox & POS Hardware Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Real-time IoT diagnostics, cellular M2M carrier signal, and acoustic heartbeat monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/customer/chat?tid=TID-SBX-82931"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Hardware Support Agent</span>
          </Link>
        </div>
      </div>

      {/* Hardware Telemetry Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {devices.map((device) => {
          const isPinging = pingingTid === device.tid;
          const pingResult = pingResults[device.tid];

          return (
            <div
              key={device.tid}
              className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-surface-borderHover transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Card Top: TID & Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      {device.category === "SoundBox" ? (
                        <Radio className="w-5 h-5" />
                      ) : (
                        <Cpu className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-bold text-white">
                        {device.tid}
                      </h3>
                      <p className="text-[11px] text-slate-400">{device.category}</p>
                    </div>
                  </div>
                  <StatusBadge type="device" value={device.status} />
                </div>

                <p className="text-xs text-slate-300 font-medium line-clamp-2">
                  {device.model}
                </p>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface-secondary/70 border border-surface-border text-xs font-mono">
                  {/* Cellular / Network */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                      <Signal className="w-3 h-3 text-cyan-400" /> Network
                    </span>
                    <p className="text-white font-medium truncate">{device.network}</p>
                    <p className="text-[10px] text-cyan-300">
                      Signal: {device.signalStrength}%
                    </p>
                  </div>

                  {/* Battery */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                      <Battery className="w-3 h-3 text-emerald-400" /> Battery
                    </span>
                    <p className="text-white font-medium">
                      {device.batteryLevel ? `${device.batteryLevel}%` : "AC Powered"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Seen: {device.lastSeen}
                    </p>
                  </div>

                  {/* SIM Profile */}
                  <div className="col-span-2 pt-2 border-t border-surface-border/60 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">SIM IoT Profile</span>
                    <p className="text-slate-200 text-[11px]">{device.simStatus}</p>
                  </div>

                  {/* Paired Phone */}
                  <div className="col-span-2 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-cyan-400" /> Merchant Paired Mobile
                    </span>
                    <p className="text-slate-200 text-[11px]">
                      {device.pairedPhone} ({device.paired ? "Linked" : "Unpaired"})
                    </p>
                  </div>
                </div>

                {/* Firmware & Heartbeat */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                  <span>Firmware: {device.firmwareVersion}</span>
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    Vol: {device.volumeLevel}/10
                  </span>
                </div>

                {/* Diagnostic Result Message if triggered */}
                {pingResult && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono animate-page-enter">
                    {pingResult}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-surface-border space-y-2">
                <button
                  onClick={() => handleRunDiagnostic(device.tid)}
                  disabled={isPinging}
                  className="w-full py-2 px-3 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-cyan-300 hover:text-white border border-surface-border text-xs font-mono flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? "animate-spin text-cyan-400" : ""}`} />
                  <span>{isPinging ? "Querying Device Over-the-Air..." : "Run Acoustic Diagnostic Ping"}</span>
                </button>

                <Link
                  href={`/customer/chat?tid=${device.tid}`}
                  className="w-full py-2 px-3 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-slate-300 hover:text-cyan-300 border border-surface-border text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ask AI OS About This Unit</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
