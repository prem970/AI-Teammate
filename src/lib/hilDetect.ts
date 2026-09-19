/**
 * Detect HIL / escalation_create from Orchestrator JSON toolCalls (website only — no MCP changes).
 */

export type HilToolSignal = {
  detected: boolean;
  toolNames: string[];
  escalationIds: string[];
  orderIds: string[];
  txnIds: string[];
};

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function collectStrings(node: unknown, into: string[], depth = 0): void {
  if (depth > 8 || node == null) return;
  if (typeof node === "string") {
    into.push(node);
    return;
  }
  if (typeof node === "number" || typeof node === "boolean") return;
  if (Array.isArray(node)) {
    for (const item of node) collectStrings(item, into, depth + 1);
    return;
  }
  if (typeof node === "object") {
    for (const v of Object.values(node as Record<string, unknown>)) {
      collectStrings(v, into, depth + 1);
    }
  }
}

function collectIds(text: string, pattern: RegExp, into: Set<string>): void {
  const re = new RegExp(pattern.source, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    into.add(m[0].toUpperCase());
  }
}

function looksLikeEscalationTool(name: string): boolean {
  const n = name.toLowerCase();
  return (
    n.includes("escalation_create") ||
    n.includes("escalation.create") ||
    n === "escalation_create" ||
    (n.includes("escalat") && (n.includes("create") || n.includes("hil")))
  );
}

/**
 * Walk toolCalls / nested tool results from n8n Orchestrator response.
 */
export function detectHilFromToolCalls(upstream: unknown): HilToolSignal {
  const toolNames: string[] = [];
  const escalationIds = new Set<string>();
  const orderIds = new Set<string>();
  const txnIds = new Set<string>();

  const root = upstream as Record<string, unknown> | null;
  const candidates = [
    ...asArray(root?.toolCalls),
    ...asArray(root?.tool_calls),
    ...asArray(root?.toolsCalled),
    ...asArray(root?.intermediateSteps),
  ];

  const blobParts: string[] = [];
  collectStrings(upstream, blobParts);
  const blob = blobParts.join("\n");

  for (const call of candidates) {
    if (!call || typeof call !== "object") continue;
    const c = call as Record<string, unknown>;
    const name = String(
      c.toolName || c.tool_name || c.name || c.tool || c.action || ""
    );
    if (name) toolNames.push(name);

    const result = c.result ?? c.output ?? c.data ?? c.response;
    const input = c.input ?? c.args ?? c.arguments;

    if (looksLikeEscalationTool(name) || /escalation_create/i.test(JSON.stringify(c))) {
      if (!toolNames.includes(name) && name) toolNames.push(name);
    }

    const local: string[] = [];
    collectStrings(result, local);
    collectStrings(input, local);
    collectStrings(c, local);
    for (const s of local) {
      collectIds(s, /\bESC-[A-Z0-9-]+\b/i, escalationIds);
      collectIds(s, /\bORD-[A-Z0-9-]+\b/i, orderIds);
      collectIds(s, /\bTXN-[A-Z0-9-]+\b/i, txnIds);
    }
  }

  collectIds(blob, /\bESC-[A-Z0-9-]+\b/i, escalationIds);
  if (/escalation_create/i.test(blob)) {
    toolNames.push("escalation_create");
  }

  const detected =
    toolNames.some(looksLikeEscalationTool) ||
    /escalation_create/i.test(blob) ||
    escalationIds.size > 0;

  return {
    detected,
    toolNames: Array.from(new Set(toolNames)),
    escalationIds: Array.from(escalationIds),
    orderIds: Array.from(orderIds),
    txnIds: Array.from(txnIds),
  };
}
