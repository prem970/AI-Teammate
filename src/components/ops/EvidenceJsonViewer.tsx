"use client";

import React, { useState } from "react";
import { Code, Copy, Check, ChevronDown, ChevronRight } from "lucide-react";

interface EvidenceJsonViewerProps {
  data: Record<string, any>;
  title?: string;
}

export function EvidenceJsonViewer({
  data,
  title = "Evidence JSON Payload",
}: EvidenceJsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-surface-border bg-[#06080e] overflow-hidden text-xs font-mono">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-secondary/70 border-b border-surface-border">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-slate-200 hover:text-white font-semibold transition-colors"
        >
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          )}
          <Code className="w-3.5 h-3.5 text-cyan-400" />
          <span>{title}</span>
          <span className="text-[10px] text-slate-500">
            ({Object.keys(data).length} root keys)
          </span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface hover:bg-surface-elevated text-slate-400 hover:text-white border border-surface-border transition-colors text-[11px]"
          title="Copy raw JSON evidence"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="p-4 max-h-[380px] overflow-y-auto">
          <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
}
