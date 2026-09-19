/**
 * Ground customer-chat answers for known policy-change demos.
 * Current active Cosmos policy beats historical cases / old phrasing.
 */

export type PolicyChatGrounding = {
  matched: boolean;
  policyId: string;
  version: string;
  title: string;
  answerForMerchant: string;
  orchestratorHint: string;
  relatedOrderId?: string;
  relatedEscalationId?: string;
};

export function isRefundBankCreditQuestion(message: string): boolean {
  const m = message.toLowerCase();
  const aboutRefund =
    m.includes("refund") ||
    m.includes("ord-dup") ||
    m.includes("duplicate") ||
    m.includes("money") ||
    m.includes("credited") ||
    m.includes("credit");
  const aboutWhen =
    m.includes("day") ||
    m.includes("how long") ||
    m.includes("when") ||
    m.includes("timeline") ||
    m.includes("take") ||
    m.includes("7") ||
    m.includes("bank");
  return (
    aboutRefund &&
    aboutWhen &&
    (m.includes("bank") ||
      m.includes("day") ||
      m.includes("how long") ||
      m.includes("when") ||
      m.includes("pol-pay-refund") ||
      m.includes("7"))
  );
}

export function buildRefundCreditGrounding(active: {
  policyId: string;
  version: string;
  title: string;
  keyRules: Record<string, unknown>;
  supersedes?: string;
}): PolicyChatGrounding {
  const days = Number(active.keyRules.upiRefundBankCreditBusinessDays ?? 3);
  return {
    matched: true,
    policyId: active.policyId,
    version: active.version,
    title: active.title,
    relatedOrderId: "ORD-DUP-1001",
    relatedEscalationId: "ESC-PAY-REFUND-601",
    answerForMerchant:
      `For your UPI / SoundBox refund on **ORD-DUP-1001**, bank credit now takes up to **${days} business days** ` +
      `under current policy **${active.policyId} ${active.version}** (${active.title}).\n\n` +
      `The older **7 business days** rule was from **${active.supersedes || "POL-PAY-REFUND-CREDIT v1.0"}** and is **superseded** — ` +
      `do not use it for new questions. If Paytm already shows refund SUCCESS and the bank still has not credited after ${days} business days, ` +
      `Ops can escalate with your UTR / refund reference.\n\n` +
      `Case on file: **ESC-PAY-REFUND-601** (view-only under Case status).`,
    orchestratorHint:
      `CURRENT POLICY (authoritative): ${active.policyId} ${active.version}. ` +
      `UPI refund bank credit = up to ${days} business days. ` +
      `Supersedes older 7-day guidance. Historical cases are examples only. ` +
      `Answer the merchant with ${days} business days and cite ${active.policyId} ${active.version}.`,
  };
}

/** If upstream reply missed the new SLA, append grounded policy change. */
export function ensurePolicyChangeInReply(
  upstreamReply: string,
  grounding: PolicyChatGrounding
): string {
  const text = (upstreamReply || "").trim();
  const days = grounding.answerForMerchant.match(/up to \*\*(\d+) business days\*\*/)?.[1] || "3";
  const alreadyHas =
    text.toLowerCase().includes(`${days} business day`) ||
    text.toLowerCase().includes(`up to ${days}`) ||
    (text.includes(grounding.policyId) && text.includes(grounding.version));

  if (alreadyHas && !/\b7\s+business\s+day/i.test(text)) {
    return text;
  }

  if (!text || text.length < 40) {
    return grounding.answerForMerchant;
  }

  return (
    `${text}\n\n---\n` +
    `**Policy update (current):** ${grounding.policyId} ${grounding.version} — ` +
    `UPI refund bank credit is up to **${days} business days**. ` +
    `The previous 7-day timeline is superseded.`
  );
}
