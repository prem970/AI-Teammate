"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Copy, Check, ExternalLink } from "lucide-react";
import { IntegrationStatus } from "@/lib/adminTypes";

interface MaskedEndpointRowProps {
  item: IntegrationStatus;
}

export function MaskedEndpointRow({ item }: MaskedEndpointRowProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mask string by replacing subdomains or query tokens
  const getDisplayValue = () => {
    if (revealed) return item.maskedUrl;
    return item.maskedUrl.replace(/\/\/[^.]+\./, "//***.");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.maskedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-xl bg-surface border border-surface-border hover:border-surface-borderHover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm">{item.serviceName}</span>
          <span
            className={`px-2 py-0.2 rounded text-[10px] uppercase font-bold border ${
              item.status === "reachable"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : item.status === "configured"
                ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                : "bg-rose-500/15 text-rose-300 border-rose-500/30"
            }`}
          >
            {item.status}
          </span>
          <span className="text-[10px] text-slate-500">({item.category})</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-cyan-400 font-bold">{item.envKey}:</span>
          <code className="text-slate-300 bg-surface-secondary px-2 py-0.5 rounded border border-surface-border">
            {getDisplayValue()}
          </code>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setRevealed(!revealed)}
          className="p-1.5 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-slate-400 hover:text-white border border-surface-border transition-colors"
          title={revealed ? "Mask secret" : "Reveal pointer"}
        >
          {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-slate-400 hover:text-white border border-surface-border transition-colors"
          title="Copy endpoint"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
