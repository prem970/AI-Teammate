"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Cpu,
  User,
  AlertTriangle,
  RotateCcw,
  Tag,
  Radio,
  Receipt,
  ExternalLink,
  Mic,
  MicOff,
  Volume2,
  Loader2,
} from "lucide-react";
import { ChatMessage, Customer } from "@/lib/types";
import { stripOrchestratorTraceForDisplay } from "@/lib/stripOrchestratorTrace";
import { formatOrchestratorError } from "@/lib/orchestratorErrors";
import { useSarvamVoice } from "@/hooks/useSarvamVoice";

interface ChatInterfaceProps {
  customer: Customer;
  initialOrderId?: string;
  initialTid?: string;
  /** Prefill + optional auto-send for demo customer issues */
  initialPrompt?: string;
  autoSendPrompt?: boolean;
  issueBanner?: { escalationId: string; issue: string };
}

export function ChatInterface({
  customer,
  initialOrderId,
  initialTid,
  initialPrompt,
  autoSendPrompt = false,
  issueBanner,
}: ChatInterfaceProps) {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: `Hello ${customer.name}. I'm your support assistant for **${customer.businessName}**. Ask about orders, devices, or settlements. If human judgment is required, I'll open a case for Ops automatically — you don't need to escalate.`,
      timestamp: "Just now",
    },
  ]);

  const [inputMessage, setInputMessage] = useState(initialPrompt || "");
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(
    initialOrderId
  );
  const [selectedTid, setSelectedTid] = useState<string | undefined>(initialTid);
  const [isLoading, setIsLoading] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastErrorRetryable, setLastErrorRetryable] = useState(false);
  const [openCases, setOpenCases] = useState<
    Array<{ escalationId: string; issue: string; status: string }>
  >([]);
  const autoSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSentRef = useRef<string>("");
  const handleSendRef = useRef<
    (customText?: string, opts?: { retry?: boolean }) => Promise<void>
  >(async () => {});

  const {
    isRecording,
    isTranscribing,
    speakingId,
    voiceError,
    playTts,
    toggleRecording,
    voiceBusy,
  } = useSarvamVoice(async (text) => {
    setInputMessage(text);
    await handleSendRef.current(text);
  }, isLoading);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setWaitSeconds(0);
      return;
    }
    setWaitSeconds(0);
    const id = setInterval(() => setWaitSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isLoading]);

  const handleSendMessage = async (
    customText?: string,
    opts?: { retry?: boolean }
  ) => {
    const textToSend = (customText || inputMessage || lastSentRef.current).trim();
    if (!textToSend || isLoading) return;

    setLastError(null);
    setLastErrorRetryable(false);
    lastSentRef.current = textToSend;

    if (!opts?.retry) {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "customer",
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          customer_id: customer.id,
          order_id: selectedOrderId,
          tid: selectedTid,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const friendly = formatOrchestratorError(data.error || data, response.status);
        setLastError(friendly.message);
        setLastErrorRetryable(Boolean(data.retryable ?? friendly.retryable));
        return;
      }

      const rawReply =
        typeof data.reply === "string" ? data.reply : String(data.reply ?? "");
      const cleanReply = stripOrchestratorTraceForDisplay(rawReply);
      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        text: cleanReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (Array.isArray(data.open_escalations)) {
        setOpenCases(
          data.open_escalations.map(
            (e: { escalationId: string; issue: string; status: string }) => ({
              escalationId: e.escalationId,
              issue: e.issue,
              status: e.status,
            })
          )
        );
      }
    } catch (err: unknown) {
      const friendly = formatOrchestratorError(err);
      setLastError(friendly.message);
      setLastErrorRetryable(friendly.retryable);
    } finally {
      setIsLoading(false);
    }
  };
  handleSendRef.current = handleSendMessage;

  useEffect(() => {
    if (!autoSendPrompt || !initialPrompt?.trim() || autoSentRef.current) return;
    autoSentRef.current = true;
    void handleSendMessage(initialPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot demo auto-send
  }, [autoSendPrompt, initialPrompt]);

  const handleActionClick = (action: string, targetId?: string) => {
    if (action === "VIEW_ESCALATION" && targetId) {
      router.push(`/customer/escalations/${targetId}`);
    } else if (action === "VIEW_ORDER") {
      router.push("/customer/orders");
    } else if (action === "VIEW_DEVICE") {
      router.push("/customer/devices");
    } else if (action === "VIEW_ORDERS") {
      router.push("/customer/orders");
    } else if (action === "RUN_QUERY" && targetId) {
      handleSendMessage(targetId);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[580px] rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-2xl">
      {/* Chat Top Bar & Context Controls */}
      <div className="px-5 py-3.5 border-b border-surface-border bg-surface-secondary/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-display text-white">
                Support chat (CS Orchestrator)
              </h2>
              <span className="flex h-2 w-2 relative">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Cases with Ops open automatically when needed — you cannot self-escalate.
            </p>
          </div>
        </div>

        {/* Dynamic Context Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 text-[11px] hidden sm:inline">Attached Context:</span>

          {selectedOrderId && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <Receipt className="w-3 h-3 text-rose-400" />
              <span>{selectedOrderId}</span>
              <button
                onClick={() => setSelectedOrderId(undefined)}
                className="hover:text-white ml-1 text-rose-400"
                title="Detach order"
              >
                ×
              </button>
            </div>
          )}

          {selectedTid && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <Radio className="w-3 h-3 text-cyan-400" />
              <span>{selectedTid}</span>
              <button
                onClick={() => setSelectedTid(undefined)}
                className="hover:text-white ml-1 text-cyan-400"
                title="Detach device"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {openCases.length > 0 && (
        <div className="px-5 py-2.5 border-b border-amber-500/30 bg-amber-500/10 text-xs text-amber-100 flex flex-wrap items-center gap-3">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-mono">{openCases.length} case(s) with Ops (view-only):</span>
          {openCases.slice(0, 3).map((c) => (
            <button
              key={c.escalationId}
              type="button"
              onClick={() => router.push(`/customer/escalations/${c.escalationId}`)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-amber-500/40 text-amber-200 hover:bg-amber-500/20 font-mono"
            >
              {c.escalationId}
              <ExternalLink className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Quick Prompts Bar */}
      <div className="px-5 py-2.5 bg-surface-elevated/40 border-b border-surface-border flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
          <Tag className="w-3 h-3 text-cyan-400" /> Quick Prompts:
        </span>
        <button
          type="button"
          onClick={() =>
            handleSendMessage(
              "Order ORD-DUP-1001 duplicate payment refund was done. How many days will it take for the money to show in my bank? Someone said 7 days — is that still correct? (policy POL-PAY-REFUND-CREDIT)"
            )
          }
          className="shrink-0 px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/40 text-xs transition-colors"
        >
          Refund bank days (v1.1 demo)
        </button>
        <button
          type="button"
          onClick={() =>
            handleSendMessage(
              "Hot SoundBox demo lead this morning for weekend rush — what is the first-touch SLA now? Is 3 hours still OK? (policy POL-SBX-LEAD-SLA)"
            )
          }
          className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 text-xs transition-colors"
        >
          Hot lead SLA (v1.1 demo)
        </button>
        <button
          type="button"
          onClick={() =>
            handleSendMessage("What is the status of order ORD-DUP-1001?")
          }
          className="shrink-0 px-2.5 py-1 rounded-full bg-surface-secondary hover:bg-surface-elevated text-slate-300 hover:text-cyan-300 border border-surface-border text-xs transition-colors"
        >
          ORD-DUP-1001 status
        </button>
        <button
          type="button"
          onClick={() =>
            handleSendMessage("What is my SoundBox status for TID-SBX-82931?")
          }
          className="shrink-0 px-2.5 py-1 rounded-full bg-surface-secondary hover:bg-surface-elevated text-slate-300 hover:text-cyan-300 border border-surface-border text-xs transition-colors"
        >
          SoundBox status
        </button>
        <button
          type="button"
          onClick={() =>
            handleSendMessage("Do I have any cases currently with Ops?")
          }
          className="shrink-0 px-2.5 py-1 rounded-full bg-surface-secondary hover:bg-surface-elevated text-slate-300 hover:text-cyan-300 border border-surface-border text-xs transition-colors"
        >
          Cases with Ops?
        </button>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "customer";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 animate-chat-send ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/40 text-cyan-400"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-2xl ${isUser ? "text-right" : "text-left"}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-medium text-slate-300">
                    {isUser ? customer.name : "Autonomous AI OS"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {msg.timestamp}
                  </span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-none shadow-md"
                      : "bg-surface-secondary border border-surface-border text-slate-100 rounded-tl-none shadow-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {!isUser && msg.sender === "assistant" && msg.id !== "msg-welcome" && (
                    <button
                      type="button"
                      onClick={() => playTts(msg.id, msg.text)}
                      disabled={speakingId === msg.id}
                      className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-surface border border-surface-border text-cyan-300 hover:border-cyan-400/60 disabled:opacity-50"
                      title="Play with Sarvam voice"
                    >
                      {speakingId === msg.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      {speakingId === msg.id ? "Speaking…" : "Speak"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-page-enter">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-surface-secondary border border-surface-border max-w-md">
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>
                  Orchestrator working… {waitSeconds}s
                  {waitSeconds >= 60 ? " (often finishes near 90–120s)" : ""}
                </span>
              </div>
              {waitSeconds >= 90 && (
                <p className="mt-2 text-[10px] font-mono text-slate-500 leading-relaxed">
                  n8n.cloud may cut at 120s (Cloudflare 524). If that happens, use Retry.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Realistic Error State Banner */}
        {lastError && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start justify-between gap-3 animate-page-enter">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold font-mono text-rose-300">
                  Orchestrator Request Failed
                </p>
                <p className="mt-1 text-rose-200/90 leading-relaxed font-mono">
                  {lastError}
                </p>
              </div>
            </div>
            {lastErrorRetryable && (
              <button
                type="button"
                onClick={() => void handleSendMessage(undefined, { retry: true })}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/50 font-mono text-xs shrink-0 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 bg-surface-secondary/80 border-t border-surface-border space-y-2"
      >
        {(voiceError || isTranscribing || isRecording) && (
          <p className="text-[11px] font-mono text-slate-400 px-1">
            {isRecording
              ? "Listening… tap mic again to stop & send"
              : isTranscribing
                ? "Transcribing with Sarvam…"
                : voiceError}
          </p>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void toggleRecording()}
            disabled={isLoading || isTranscribing}
            className={`px-3 py-3 rounded-xl border shrink-0 transition-colors disabled:opacity-50 ${
              isRecording
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse"
                : "bg-surface border-surface-border text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300"
            }`}
            title={isRecording ? "Stop recording" : "Voice input (Sarvam STT)"}
          >
            {isTranscribing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type or tap mic to speak…"
            disabled={isLoading || voiceBusy}
            className="flex-1 px-4 py-3 rounded-xl bg-surface border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || voiceBusy || !inputMessage.trim()}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
