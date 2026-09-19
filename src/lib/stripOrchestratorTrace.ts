/**
 * Strip orchestrator execution-trace text from customer-facing reply.
 * Used by /api/chat so `reply` is the message body only; structured `trace` stays separate.
 */
export function stripOrchestratorTraceForDisplay(reply: string): string {
  if (!reply || typeof reply !== "string") return "";

  let text = reply.replace(/\r\n/g, "\n").trim();

  // Single-line pipe trace: Intent → … | Agents called → … | Decision → …
  text = text.replace(
    /\n*\s*Intent\s*(?:→|->)\s*.*?(?:Agents?\s+called|Key\s+evidence|Decision)\s*(?:→|->)[\s\S]*$/i,
    ""
  );

  // Block starting with "Trace:" / "Execution trace:"
  text = text.replace(/\n*\s*(?:Execution\s+)?Trace\s*:[\s\S]*$/i, "");

  // Multiline labeled lines (Intent / Agents called / Key evidence / Decision / Reply →)
  const lines = text.split("\n");
  const kept: string[] = [];
  let droppingTrace = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      /^(?:Intent|Agents?\s+called|Key\s+evidence|Decision|Reply)\s*(?:→|->|:)/i.test(
        trimmed
      ) ||
      /^(?:Execution\s+)?Trace\s*:/i.test(trimmed)
    ) {
      droppingTrace = true;
      continue;
    }
    if (droppingTrace) {
      // Continue dropping while lines still look like trace fragments
      if (
        /^(?:Intent|Agents?\s+called|Key\s+evidence|Decision|Reply)\s*(?:→|->|:)/i.test(
          trimmed
        ) ||
        trimmed === ""
      ) {
        continue;
      }
      droppingTrace = false;
    }
    kept.push(line);
  }

  return kept.join("\n").trim();
}
