"use client";

import React, { useState } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ReachOutButtonProps {
  leadId: string;
  companyName: string;
  compact?: boolean;
}

export function ReachOutButton({ leadId, companyName, compact }: ReachOutButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [draftPreview, setDraftPreview] = useState("");

  const handleReachOut = async () => {
    setStatus("loading");
    setMessage("");
    setDraftPreview("");

    try {
      const res = await fetch("/api/sales/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setMessage(data.error || "Outreach failed");
        return;
      }

      setStatus("ok");
      setMessage(`Outreach agent ran for ${companyName}. Review the draft below — email is not auto-sent.`);

      const text =
        typeof data.response === "object" && data.response?.text
          ? String(data.response.text)
          : typeof data.response === "string"
            ? data.response
            : JSON.stringify(data.response ?? {}, null, 2);
      setDraftPreview(text.slice(0, 2500));
    } catch {
      setStatus("error");
      setMessage("Network error calling outreach API");
    }
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <button
        type="button"
        onClick={handleReachOut}
        disabled={status === "loading"}
        className={
          compact
            ? "w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold hover:bg-emerald-500/25 disabled:opacity-50"
            : "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-bold text-sm disabled:opacity-50"
        }
      >
        {status === "loading" ? (
          <Loader2 className={`${compact ? "w-3 h-3" : "w-4 h-4"} animate-spin`} />
        ) : (
          <Mail className={compact ? "w-3 h-3" : "w-4 h-4"} />
        )}
        {status === "loading" ? "Reaching out…" : "Reach out"}
      </button>

      {status === "ok" && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
          <p className="text-xs text-emerald-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{message}</span>
          </p>
          {draftPreview && (
            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {draftPreview}
            </pre>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
