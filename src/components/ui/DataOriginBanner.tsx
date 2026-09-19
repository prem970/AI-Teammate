import React from "react";
import { Database, AlertTriangle } from "lucide-react";

export function DataOriginBanner({
  origin,
  label = "Cosmos DB (ai_os)",
}: {
  origin: "cosmos" | "demo" | "unavailable";
  label?: string;
}) {
  if (origin === "cosmos") {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] font-mono text-emerald-300">
        <Database className="h-3.5 w-3.5" />
        Data source: {label} — live seed records
      </div>
    );
  }
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] font-mono text-amber-200">
      <AlertTriangle className="h-3.5 w-3.5" />
      Demo / unavailable — configure Azure Cosmos env to load original records
    </div>
  );
}
