import React from "react";

interface PulseIndicatorProps {
  label?: string;
  sublabel?: string;
  size?: "sm" | "md";
}

export function PulseIndicator({
  label = "Autonomous AI Active",
  sublabel = "All agents operational",
  size = "md",
}: PulseIndicatorProps) {
  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface-secondary/80 border border-cyber-cyan/30 backdrop-blur-md shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_#00e5ff]" />
      </span>
      <div className="flex flex-col text-left">
        <span className="text-[11px] font-mono tracking-wider font-semibold text-cyan-300 uppercase">
          {label}
        </span>
        {sublabel && (
          <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
