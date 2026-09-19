"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { recordWavBlob } from "@/lib/recordWav";

type OnTranscript = (text: string) => void | Promise<void>;

/** Shared Sarvam STT (mic) + TTS (speak) for every chatbot surface. */
export function useSarvamVoice(onTranscript: OnTranscript, busy = false) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;
  const wavRecorderRef = useRef<Awaited<ReturnType<typeof recordWavBlob>> | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      wavRecorderRef.current?.cancel();
      audioPlayerRef.current?.pause();
    };
  }, []);

  const playTts = useCallback(async (messageId: string, text: string) => {
    setVoiceError(null);
    try {
      setSpeakingId(messageId);
      const res = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language_code: "en-IN" }),
      });
      const data = await res.json();
      if (!res.ok || !data.audioBase64) {
        throw new Error(data.error || "Voice output failed");
      }
      audioPlayerRef.current?.pause();
      const audio = new Audio(
        `data:${data.mimeType || "audio/wav"};base64,${data.audioBase64}`
      );
      audioPlayerRef.current = audio;
      audio.onended = () => setSpeakingId(null);
      audio.onerror = () => {
        setSpeakingId(null);
        setVoiceError("Could not play audio");
      };
      await audio.play();
    } catch (err: unknown) {
      setSpeakingId(null);
      setVoiceError(err instanceof Error ? err.message : "TTS failed");
    }
  }, []);

  const stopRecordingAndSend = useCallback(async () => {
    const rec = wavRecorderRef.current;
    if (!rec) return;
    setIsRecording(false);
    setIsTranscribing(true);
    setVoiceError(null);
    try {
      const blob = await rec.stop();
      wavRecorderRef.current = null;
      if (blob.size < 1000) {
        setVoiceError("Recording too short — hold the mic and speak clearly.");
        return;
      }
      const form = new FormData();
      form.append("file", blob, "voice.wav");
      form.append("language_code", "en-IN");
      form.append("mode", "transcribe");
      const res = await fetch("/api/voice/stt", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not transcribe audio");
      }
      const text = String(data.transcript || "").trim();
      if (!text) {
        setVoiceError("No speech detected — try again and speak clearly.");
        return;
      }
      await onTranscriptRef.current(text);
    } catch (err: unknown) {
      setVoiceError(err instanceof Error ? err.message : "Speech-to-text failed");
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  const toggleRecording = useCallback(async () => {
    setVoiceError(null);
    if (isRecording) {
      await stopRecordingAndSend();
      return;
    }
    if (busy || isTranscribing) return;
    try {
      const rec = await recordWavBlob(20000);
      wavRecorderRef.current = rec;
      rec.start();
      setIsRecording(true);
    } catch {
      setVoiceError("Microphone permission denied or unavailable.");
    }
  }, [busy, isRecording, isTranscribing, stopRecordingAndSend]);

  return {
    isRecording,
    isTranscribing,
    speakingId,
    voiceError,
    setVoiceError,
    playTts,
    toggleRecording,
    voiceBusy: isRecording || isTranscribing,
  };
}
