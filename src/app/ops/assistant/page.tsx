"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  User,
  ShieldAlert,
  Tag,
  Mic,
  MicOff,
  Volume2,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { stripOrchestratorTraceForDisplay } from "@/lib/stripOrchestratorTrace";
import { formatOrchestratorError } from "@/lib/orchestratorErrors";
import { useSarvamVoice } from "@/hooks/useSarvamVoice";

/** Staff / policy console identity forwarded to CS orchestrator. */
const OPS_POLICY_CUSTOMER_ID = "OPS-POLICY";

interface AssistantMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export default function OpsAssistantPage() {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "asst-welcome",
      sender: "assistant",
      text: "Hello — Internal Policy & Knowledge Assistant. Ask about compliance clauses, duplicate-payment rules, SLAs, or handoffs. Replies come from the CS Orchestrator (same agent stack as merchant chat). Payment execution is disabled here.",
      timestamp: "Just now",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastErrorRetryable, setLastErrorRetryable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSentRef = useRef("");
  const handleSendRef = useRef<
    (customQuery?: string, opts?: { retry?: boolean }) => Promise<void>
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
    setInput(text);
    await handleSendRef.current(text);
  }, isLoading);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const handleSend = async (
    customQuery?: string,
    opts?: { retry?: boolean }
  ) => {
    const textToSend = (customQuery || input || lastSentRef.current).trim();
    if (!textToSend || isLoading) return;

    lastSentRef.current = textToSend;
    setLastError(null);
    setLastErrorRetryable(false);

    if (!opts?.retry) {
      const userMsg: AssistantMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
    }
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          customer_id: OPS_POLICY_CUSTOMER_ID,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        const friendly = formatOrchestratorError(data.error || data, res.status);
        setLastError(friendly.message);
        setLastErrorRetryable(Boolean(data.retryable ?? friendly.retryable));
        return;
      }

      const rawReply =
        typeof data.reply === "string" ? data.reply : String(data.reply ?? "");
      const cleanReply = stripOrchestratorTraceForDisplay(rawReply);
      const asstId = `asst-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: asstId,
          sender: "assistant",
          text: cleanReply || "Orchestrator returned an empty reply.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err: unknown) {
      const friendly = formatOrchestratorError(err);
      setLastError(friendly.message);
      setLastErrorRetryable(friendly.retryable);
    } finally {
      setIsLoading(false);
    }
  };
  handleSendRef.current = handleSend;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">
          Internal Policy & Regulatory Knowledge Assistant
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Posts to N8N_CS_ORCHESTRATOR_URL via /api/chat. Voice via Sarvam STT/TTS.
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs font-mono text-amber-300">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          System Notice: Staff policy Q&amp;A through the orchestrator; payment execution is not
          available here.
        </span>
      </div>

      <div className="flex flex-col h-[calc(100vh-14rem)] min-h-[540px] rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-2xl">
        <div className="px-5 py-2.5 bg-surface-secondary/70 border-b border-surface-border flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400" /> SOP Prompts:
          </span>

          <button
            type="button"
            onClick={() =>
              void handleSend(
                "Explain the rule for bank switch code U69 in PAYMENT-DUPLICATE-V2"
              )
            }
            className="shrink-0 px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated text-slate-300 hover:text-amber-300 border border-surface-border text-xs transition-colors"
          >
            Switch Code U69 Rule
          </button>

          <button
            type="button"
            onClick={() =>
              void handleSend(
                "What are the SoundBox acoustic latency thresholds in POL-SBX-001?"
              )
            }
            className="shrink-0 px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated text-slate-300 hover:text-amber-300 border border-surface-border text-xs transition-colors"
          >
            SoundBox Latency SLA
          </button>

          <button
            type="button"
            onClick={() =>
              void handleSend(
                "Cafe Blue Bean ORD-CBB-DUP-9001 charged twice — under PAYMENT-DUPLICATE-V2 v2.4 do we auto-refund or need human approval?"
              )
            }
            className="shrink-0 px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated text-slate-300 hover:text-amber-300 border border-surface-border text-xs transition-colors"
          >
            Duplicate V2.4 HIL
          </button>

          <button
            type="button"
            onClick={() =>
              void handleSend("When are daily merchant settlements cleared?")
            }
            className="shrink-0 px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated text-slate-300 hover:text-amber-300 border border-surface-border text-xs transition-colors"
          >
            Daily Settlement Cutoff
          </button>
        </div>

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
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isUser
                      ? "bg-amber-600 text-white"
                      : "bg-gradient-to-br from-amber-500/30 to-purple-600/30 border border-amber-500/40 text-amber-400"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

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
                    {!isUser && msg.id !== "asst-welcome" && (
                      <button
                        type="button"
                        onClick={() => void playTts(msg.id, msg.text)}
                        disabled={speakingId === msg.id}
                        className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-surface border border-surface-border text-amber-300 hover:border-amber-400/60 disabled:opacity-50"
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

          {isLoading && (
            <div className="flex items-start gap-3 animate-page-enter">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-surface-secondary border border-surface-border text-xs font-mono text-amber-300 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>
                    Orchestrator working… {waitSeconds}s
                    {waitSeconds >= 60 ? " (often finishes near 90–120s)" : ""}
                  </span>
                </div>
              </div>
            </div>
          )}

          {lastError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="font-mono leading-relaxed">{lastError}</p>
              </div>
              {lastErrorRetryable && (
                <button
                  type="button"
                  onClick={() => void handleSend(undefined, { retry: true })}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/50 font-mono text-xs shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retry
                </button>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
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
                  : "bg-surface border-surface-border text-slate-300 hover:border-amber-400/50 hover:text-amber-300"
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or tap mic to speak…"
              disabled={isLoading || voiceBusy}
              className="flex-1 px-4 py-3 rounded-xl bg-surface border border-surface-border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || voiceBusy || !input.trim()}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
