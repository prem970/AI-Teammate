/** Human-friendly orchestrator / Cloudflare timeout copy for chat UIs. */

export function formatOrchestratorError(
  error: unknown,
  status?: number
): { message: string; retryable: boolean; code?: string } {
  const raw =
    typeof error === "string"
      ? error
      : error && typeof error === "object" && "error" in error
        ? String((error as { error: unknown }).error)
        : error instanceof Error
          ? error.message
          : String(error ?? "Unknown error");

  const blob = `${status ?? ""} ${raw}`.toLowerCase();

  if (
    status === 524 ||
    blob.includes("524") ||
    blob.includes("origin_response_timeout") ||
    blob.includes("proxy read timeout")
  ) {
    return {
      code: "524",
      retryable: true,
      message:
        "Orchestrator timed out (Cloudflare 524 — n8n took longer than 120s). " +
        "Wait a moment, then tap Retry. The workflow may still finish in n8n; check Case status if this was a dispute.",
    };
  }

  if (
    blob.includes("aborted") ||
    blob.includes("abort") ||
    blob.includes("timeout") ||
    blob.includes("timed out") ||
    status === 504
  ) {
    return {
      code: "TIMEOUT",
      retryable: true,
      message:
        "Orchestrator request timed out waiting for a reply. Wait ~30s and tap Retry — slow agent/MCP runs often succeed on a second try.",
    };
  }

  return {
    retryable: /retry|502|503|unreachable|network/i.test(raw),
    message: raw.slice(0, 800),
  };
}
