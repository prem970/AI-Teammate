"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  User,
  ShieldAlert,
  FileCode2,
  Sparkles,
  Terminal,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Tag,
} from "lucide-react";

interface AssistantMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  referencedPolicies?: string[];
}

export default function OpsAssistantPage() {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "asst-welcome",
      sender: "assistant",
      text: "Hello, I am the Autonomous AI OS Internal Policy & Knowledge Assistant for staff. I can explain compliance clauses (e.g. switch code U69, dual debits, hardware acoustic degradation SLA) and multi-agent stage policies. Note: Financial payout execution is disabled in this console.",
      timestamp: "Just now",
      referencedPolicies: ["PAYMENT-DUPLICATE-V2", "POL-SBX-001", "POL-SETTLE-DAILY-V1"],
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (customQuery?: string) => {
    const textToSend = (customQuery || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ops/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSend }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `asst-${Date.now()}`,
            sender: "assistant",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            referencedPolicies: data.referencedPolicies,
          },
        ]);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">
          Internal Policy & Regulatory Knowledge Assistant
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Real retrieval over Azure AI Search + Cosmos policy registry (no invented clauses).
        </p>
      </div>

      {/* Mandatory Safety System Notice */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs font-mono text-amber-300">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          System Notice: Employees get knowledge/policy help; payment execution is not available here.
        </span>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col h-[calc(100vh-14rem)] min-h-[540px] rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-2xl">
        {/* Quick Prompts */}
        <div className="px-5 py-2.5 bg-surface-secondary/70 border-b border-surface-border flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400" /> SOP Prompts:
          </span>

          <button
            type="button"
            onClick={() =>
              handleSend("Explain the rule for bank switch code U69 in PAYMENT-DUPLICATE-V2")
            }
            className="shrink-0 px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated text-slate-300 hover:text-amber-300 border border-surface-border text-xs transition-colors"
          >
            Switch Code U69 Rule
          </button>

          <button
            type="button"
            onClick={() =>
              handleSend("What are the SoundBox acoustic latency thresholds in POL-SBX-001?")
            }
            className="shrink-0 px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated text-slate-300 hover:text-amber-300 border border-surface-border text-xs transition-colors"
          >
            SoundBox Latency SLA
          </button>

          <button
            type="button"
            onClick={() =>
              handleSend("Can sales agents skip quotation stages in the pipeline?")
            }
            className="shrink-0 px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated text-slate-300 hover:text-amber-300 border border-surface-border text-xs transition-colors"
          >
            Sales Stage Skipping Rules
          </button>

          <button
            type="button"
            onClick={() =>
              handleSend("When are daily merchant settlements cleared?")
            }
            className="shrink-0 px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated text-slate-300 hover:text-amber-300 border border-surface-border text-xs transition-colors"
          >
            Daily Settlement Cutoff
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 animate-chat-send ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isUser
                      ? "bg-amber-600 text-white"
                      : "bg-gradient-to-br from-amber-500/30 to-purple-600/30 border border-amber-500/40 text-amber-400"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-2xl ${isUser ? "text-right" : "text-left"}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-medium text-slate-300">
                      {isUser ? "Staff Operator" : "Ops Policy Assistant"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-amber-600 text-white rounded-tr-none shadow-md font-sans"
                        : "bg-surface-secondary border border-surface-border text-slate-100 rounded-tl-none shadow-md font-sans"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Referenced Policies */}
                    {!isUser && msg.referencedPolicies && msg.referencedPolicies.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-surface-border flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                        <span className="text-slate-400">Referenced Policies:</span>
                        {msg.referencedPolicies.map((pol, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-surface border border-surface-border text-purple-300"
                          >
                            § {pol}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3 animate-page-enter">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-surface-secondary border border-surface-border text-xs font-mono text-amber-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Searching vector knowledge store...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-surface-secondary/80 border-t border-surface-border flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask internal assistant about policy clauses, switch codes, or handoff standards..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-surface border border-surface-border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
