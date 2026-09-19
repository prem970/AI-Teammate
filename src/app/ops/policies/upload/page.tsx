"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Database,
  Sparkles,
  Info,
} from "lucide-react";

export default function PolicyUploadPage() {
  const [policyId, setPolicyId] = useState("POL-PAY-REFUND-CREDIT");
  const [policyVersion, setPolicyVersion] = useState("v1.1");
  const [productId, setProductId] = useState("SoundBox");
  const [category, setCategory] = useState("Dispute & Refunds");
  const [source, setSource] = useState("ops_compliance_team");
  const [docType, setDocType] = useState<"markdown" | "text">("markdown");
  const [content, setContent] = useState(
    `# POLICY UPDATE — UPI / SoundBox Refund Credit Timeline (v1.1)\n` +
      `Document ID: POL-PAY-REFUND-CREDIT\n` +
      `Version: v1.1 (was v1.0)\n` +
      `Effective: 2026-09-19\n\n` +
      `## Why this changed\n` +
      `Company shortened the published UPI refund bank credit SLA. Use v1.1 only. Older 7-day answers are examples only.\n\n` +
      `## Credit timeline (UPDATED)\n` +
      `| Channel | Previous (v1.0) | Current (v1.1) — REQUIRED |\n` +
      `|---|---|---|\n` +
      `| UPI / SoundBox QR refund | Up to 7 business days | Up to **3 business days** |\n` +
      `| Card refund | 5–10 business days | Unchanged (issuer dependent) |\n\n` +
      `If Paytm shows refund SUCCESS and bank credit is missing after 3 business days (UPI), escalate to L2 Payments with UTR.\n\n` +
      `## Agent behavior\n` +
      `1. Confirm refund status from tools.\n` +
      `2. Quote POL-PAY-REFUND-CREDIT v1.1 — up to 3 business days for UPI bank credit.\n` +
      `3. If context still says 7 days, prefer v1.1.\n`
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("policy_id");
    const prod = params.get("product_id");
    if (pid) setPolicyId(pid);
    if (prod) setProductId(prod);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/policies/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          policy_id: policyId,
          policy_version: policyVersion,
          product_id: productId,
          category,
          doc_type: docType,
          content,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          success: true,
          message: data.message,
          details: data.ingestStats || data.details,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Policy vector ingestion failed.",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error submitting policy to /api/policies/ingest.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/ops/policies"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Policies Directory</span>
        </Link>
        <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/30">
          Role: Policy Owner
        </span>
      </div>

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Ingest Policy into RAG Vector Store
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
          Upload or update regulatory Markdown documents forwarded to n8n RAG pipeline.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-start gap-3 shadow-md text-xs">
        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1 font-mono text-slate-300">
          <p className="font-bold text-purple-300 uppercase">
            Helper Notice: Only re-ingest the changed policy doc; promote Cosmos active version separately.
          </p>
          <p className="text-slate-400 font-sans leading-relaxed text-[11px]">
            This form POSTs to N8N_RAG_INGEST_URL. If that env var is missing, the API returns 503 — it will not fake embed success.
          </p>
        </div>
      </div>

      <div className="space-y-6">
      {/* Ingest Result Banner */}
      {result && (
        <div
          className={`p-5 rounded-2xl border font-mono text-xs animate-page-enter space-y-2 ${
            result.success
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/40 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            )}
            <span>{result.success ? "RAG Ingestion Successful" : "Ingestion Failed"}</span>
          </div>
          <p className="text-slate-200 font-sans">{result.message}</p>

          {result.details && (
            <div className="p-3 rounded-lg bg-surface-secondary/80 border border-surface-border text-[11px] space-y-1 mt-2 text-slate-300">
              <p className="font-bold text-purple-300">Embedding Pipeline Stats:</p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-slate-400">
                <span>Policy ID: <strong className="text-white">{result.details.policyId}</strong></span>
                <span>Version: <strong className="text-white">{result.details.version}</strong></span>
                <span>Chunks Indexed: <strong className="text-emerald-400">{result.details.chunksIndexed} chunks</strong></span>
                <span>Model: <strong className="text-white">{result.details.embeddingModel}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border space-y-6 shadow-xl"
      >
        {/* Metadata Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1">
              Policy ID *
            </label>
            <input
              type="text"
              required
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-secondary border border-surface-border text-white text-xs font-mono focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1">
              Policy Version *
            </label>
            <input
              type="text"
              required
              value={policyVersion}
              onChange={(e) => setPolicyVersion(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-secondary border border-surface-border text-white text-xs font-mono focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1">
              Product Category *
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-secondary border border-surface-border text-white text-xs font-mono focus:outline-none focus:border-purple-400"
            >
              <option value="SoundBox">SoundBox</option>
              <option value="Smart POS">Smart POS</option>
              <option value="Payment Gateway">Payment Gateway</option>
              <option value="Core Settlement">Core Settlement</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-secondary border border-surface-border text-white text-xs font-mono focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1">
              Ingest Source
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-secondary border border-surface-border text-white text-xs font-mono focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1">
              Document Format
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as "markdown" | "text")}
              className="w-full p-2.5 rounded-lg bg-surface-secondary border border-surface-border text-white text-xs font-mono focus:outline-none focus:border-purple-400"
            >
              <option value="markdown">Markdown (.md)</option>
              <option value="text">Plain Text (.txt)</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <label className="block text-slate-400 uppercase text-[10px]">
              Policy Markdown Document Body:
            </label>
            <span className="text-[10px] text-slate-500">
              {content.length} characters ({Math.ceil(content.length / 450)} vector chunks)
            </span>
          </div>
          <textarea
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 rounded-xl bg-surface-secondary border border-surface-border text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 font-mono">
            Pipeline destination: <code className="text-purple-300">N8N_RAG_INGEST_URL</code>
          </p>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>{isSubmitting ? "Indexing in Vector Store..." : "Submit to RAG Ingest Pipeline"}</span>
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
