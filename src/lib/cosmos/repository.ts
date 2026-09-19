import { queryAll, getContainer, cosmosConfigured } from "./client";
import type { Customer, Order, Device, Escalation, OrderStatus, DeviceStatus } from "../types";
import type {
  EscalationPackage,
  EscalationState,
  PriorityLevel,
  PolicyRecord,
  Lead,
  SalesStage,
  SalesAgentId,
  HumanActionType,
} from "../opsTypes";

export type DataOrigin = "cosmos" | "unavailable";

export function isCosmosLive(): boolean {
  return cosmosConfigured();
}

// ---------- Customers ----------

type CosmosCustomer = {
  customerId: string;
  legalName?: string;
  displayName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  segment?: string;
  preferredChannel?: string;
  kycStatus?: string;
  status?: string;
  createdAt?: string;
  city?: string;
  state?: string;
};

type CosmosAccount = {
  customerId: string;
  mid?: string;
  bankAccountLast4?: string;
  settlementCycle?: string;
  businessCategory?: string;
};

function mapPreferredChannel(
  ch?: string
): Customer["preferredChannel"] {
  const c = (ch || "").toLowerCase();
  if (c.includes("email")) return "Email";
  if (c.includes("sms")) return "SMS";
  if (c.includes("chat") || c.includes("web")) return "Autonomous Web Push";
  return "WhatsApp";
}

function mapCustomer(doc: CosmosCustomer, account?: CosmosAccount): Customer {
  return {
    id: doc.customerId,
    mid: account?.mid || `MID-${doc.customerId.replace("CUST-", "")}`,
    name: doc.ownerName || doc.displayName || doc.legalName || doc.customerId,
    email: doc.email || `${doc.customerId.toLowerCase()}@example.com`,
    businessName: doc.displayName || doc.legalName || doc.customerId,
    businessType: account?.businessCategory || doc.segment || "Merchant",
    segment: doc.segment || "merchant",
    preferredChannel: mapPreferredChannel(doc.preferredChannel),
    phone: doc.phone || "",
    registeredDate: doc.createdAt ? doc.createdAt.slice(0, 10) : "",
    settlementAccount: account?.bankAccountLast4
      ? `Settlement •••• ${account.bankAccountLast4} (${account.settlementCycle || "T+1"})`
      : "Settlement account on file",
    kycStatus:
      (doc.kycStatus || "").toLowerCase() === "verified" ? "VERIFIED" : "PENDING_UPDATE",
  };
}

export async function findCustomerById(customerId: string): Promise<Customer | null> {
  const rows = await queryAll<CosmosCustomer>(
    "customers",
    "SELECT * FROM c WHERE c.customerId = @id",
    [{ name: "@id", value: customerId }]
  );
  if (!rows[0]) return null;
  const accounts = await queryAll<CosmosAccount>(
    "accounts",
    "SELECT * FROM c WHERE c.customerId = @id",
    [{ name: "@id", value: customerId }]
  );
  return mapCustomer(rows[0], accounts[0]);
}

export async function findCustomerByEmail(email: string): Promise<Customer | null> {
  const normalized = email.trim().toLowerCase();
  const rows = await queryAll<CosmosCustomer>("customers", "SELECT * FROM c");
  const match = rows.find((r) => (r.email || "").toLowerCase() === normalized);
  if (!match) return null;
  return findCustomerById(match.customerId);
}

export async function listCustomers(): Promise<Customer[]> {
  const rows = await queryAll<CosmosCustomer>("customers", "SELECT * FROM c");
  const accounts = await queryAll<CosmosAccount>("accounts", "SELECT * FROM c");
  const byCust = new Map(accounts.map((a) => [a.customerId, a]));
  return rows.map((r) => mapCustomer(r, byCust.get(r.customerId)));
}

// ---------- Orders ----------

type CosmosOrder = {
  orderId: string;
  customerId: string;
  amountInr?: number;
  currency?: string;
  status?: string;
  orderedAt?: string;
  updatedAt?: string;
  productId?: string;
  channel?: string;
  tid?: string;
  description?: string;
  trackingId?: string;
  mid?: string;
};

function mapOrderStatus(status?: string): OrderStatus {
  const s = (status || "").toLowerCase();
  if (s.includes("disput")) return "disputed";
  if (s.includes("refund")) return "refunded";
  if (s.includes("pending") || s.includes("await")) return "pending";
  if (s.includes("paid") || s.includes("deliver") || s.includes("live") || s.includes("activ"))
    return "settled";
  return "pending";
}

function mapProductType(productId?: string, channel?: string): Order["productType"] {
  const p = (productId || "").toLowerCase();
  const c = (channel || "").toLowerCase();
  if (p.includes("api")) return "Payment Gateway API";
  if (p.includes("card") || p.includes("pos")) return "Card Swipe";
  if (c.includes("dynamic")) return "POS Dynamic QR";
  return "SoundBox QR";
}

function mapOrder(doc: CosmosOrder & { disputeResolution?: { escalationId?: string } }): Order {
  const status = mapOrderStatus(doc.status);
  return {
    orderId: doc.orderId,
    customerId: doc.customerId,
    amount: Number(doc.amountInr ?? 0),
    currency: doc.currency || "INR",
    status,
    timestamp: doc.orderedAt || doc.updatedAt || "",
    productType: mapProductType(doc.productId, doc.channel),
    utr: doc.trackingId || `REF-${doc.orderId}`,
    customerIdentifier: doc.description,
    disputeReason: status === "disputed" ? doc.description : undefined,
    disputeEscalationId:
      status === "disputed"
        ? doc.disputeResolution?.escalationId || undefined
        : undefined,
    tracking: {
      terminalId: doc.tid,
      settlementBatch: doc.mid,
      channel: doc.channel || "upi",
      responseCode: doc.status || "UNKNOWN",
    },
  };
}

export async function listOrders(customerId?: string): Promise<Order[]> {
  const rows = customerId
    ? await queryAll<CosmosOrder>(
        "orders",
        "SELECT * FROM c WHERE c.customerId = @id",
        [{ name: "@id", value: customerId }]
      )
    : await queryAll<CosmosOrder>("orders", "SELECT * FROM c");
  return rows.map(mapOrder).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

// ---------- Devices ----------

type CosmosDevice = {
  tid: string;
  customerId: string;
  productId?: string;
  sku?: string;
  network?: string;
  firmware?: string;
  volume?: number;
  pairingStatus?: string;
  status?: string;
  lastSeenAt?: string;
  serialNumber?: string;
};

function mapDeviceStatus(status?: string): DeviceStatus {
  const s = (status || "").toLowerCase();
  if (s.includes("suspend") || s.includes("offline")) return "offline";
  if (s.includes("attention") || s.includes("degraded")) return "needs_attention";
  return "active";
}

function mapDevice(doc: CosmosDevice): Device {
  const isSoundbox = (doc.productId || "").includes("soundbox");
  const net = (doc.network || "").toLowerCase();
  return {
    tid: doc.tid,
    model: isSoundbox
      ? `Paytm SoundBox (${doc.sku || "SBX"})`
      : `Paytm Card Machine (${doc.sku || "POS"})`,
    category: isSoundbox ? "SoundBox" : "POS Terminal",
    status: mapDeviceStatus(doc.status),
    paired: (doc.pairingStatus || "").toLowerCase() === "paired",
    pairedPhone: "",
    network: net.includes("wifi") ? "Wi-Fi" : net.includes("3g") ? "3G Fallback" : "4G VoLTE",
    signalStrength: mapDeviceStatus(doc.status) === "active" ? 78 : 20,
    lastSeen: doc.lastSeenAt || "",
    simStatus: net.includes("sim") ? "Active - Airtel M2M" : "No Signal",
    firmwareVersion: doc.firmware || "unknown",
    volumeLevel: doc.volume ?? 5,
    audioHeartbeatOk: mapDeviceStatus(doc.status) === "active",
  };
}

export async function listDevices(customerId?: string): Promise<Device[]> {
  const rows = customerId
    ? await queryAll<CosmosDevice>(
        "devices",
        "SELECT * FROM c WHERE c.customerId = @id",
        [{ name: "@id", value: customerId }]
      )
    : await queryAll<CosmosDevice>("devices", "SELECT * FROM c");
  return rows.map(mapDevice);
}

// ---------- Escalations (customer view + ops package) ----------

type CosmosEscalation = {
  id?: string;
  escalationId: string;
  customerId: string;
  workflowId?: string;
  issue?: string;
  order?: string | null;
  evidence?: Record<string, unknown>;
  transactions?: string[];
  detectedSituation?: string;
  applicablePolicy?: { policyId?: string; version?: string };
  agentConclusion?: string;
  recommendedAction?: string;
  status?: string;
  priority?: string;
  assignedTo?: string | null;
  humanCan?: string[];
  createdAt?: string;
  updatedAt?: string;
  resolutionDecision?: EscalationPackage["resolutionDecision"];
};

function mapPriority(p?: string): PriorityLevel {
  const u = (p || "P2").toUpperCase();
  if (u === "P1" || u === "CRITICAL") return "P1";
  if (u === "P3" || u === "MEDIUM") return "P3";
  if (u === "P4" || u === "LOW") return "P4";
  return "P2";
}

function mapEscalationState(status?: string): EscalationState {
  const s = (status || "").toLowerCase();
  if (s.includes("resolv")) return "resolved";
  if (s.includes("return")) return "returned";
  if (s.includes("review") || s.includes("in_")) return "in_review";
  return "open";
}

function mapCustomerEscalation(doc: CosmosEscalation): Escalation {
  const pri = mapPriority(doc.priority);
  const state = mapEscalationState(doc.status);
  const raw = (doc.evidence || {}) as Record<string, unknown>;
  const orderObj =
    raw.order && typeof raw.order === "object" && !Array.isArray(raw.order)
      ? (raw.order as Record<string, unknown>)
      : null;
  const policyObj =
    raw.policy && typeof raw.policy === "object" && !Array.isArray(raw.policy)
      ? (raw.policy as Record<string, unknown>)
      : null;

  const relatedOrderId =
    (typeof doc.order === "string" && doc.order) ||
    (typeof raw.order_id === "string" && raw.order_id) ||
    (typeof raw.orderId === "string" && raw.orderId) ||
    (typeof orderObj?.order_id === "string" && orderObj.order_id) ||
    (typeof orderObj?.orderId === "string" && orderObj.orderId) ||
    undefined;

  const policyId =
    doc.applicablePolicy?.policyId ||
    (typeof policyObj?.policy_id === "string" ? policyObj.policy_id : undefined) ||
    "UNKNOWN";

  return {
    escalationId: doc.escalationId,
    customerId: doc.customerId,
    issue: doc.issue || "Escalation",
    priority:
      pri === "P1" ? "CRITICAL" : pri === "P2" ? "HIGH" : pri === "P3" ? "MEDIUM" : "LOW",
    status:
      state === "resolved"
        ? "RESOLVED"
        : state === "in_review"
          ? "AUTONOMOUS_INVESTIGATION"
          : "QUEUED_FOR_HUMAN",
    recommendedAction: doc.recommendedAction || "Awaiting human review",
    createdAt: doc.createdAt || "",
    updatedAt: doc.updatedAt || "",
    relatedOrderId,
    evidenceSummary: {
      transactionTimestamp: doc.createdAt || "",
      bankSwitchCode: "N/A",
      telemetryStatus: doc.detectedSituation || "n/a",
      customerClaims: doc.issue || "",
      detectedAnomaly: doc.detectedSituation || doc.issue || "",
    },
    policyId,
    policyConfidence: 0.9,
    humanCan: [], // never expose HIL action verbs to customers
    resolutionDecision: doc.resolutionDecision
      ? {
          action: String(doc.resolutionDecision.action),
          decidedBy: String(doc.resolutionDecision.decidedBy),
          decidedAt: String(doc.resolutionDecision.decidedAt),
          notes: doc.resolutionDecision.notes,
          refundAmount: doc.resolutionDecision.refundAmount,
        }
      : undefined,
  };
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function numField(...vals: unknown[]): number | undefined {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v))) return Number(v);
  }
  return undefined;
}

/** Map agent/Cosmos evidence shapes (amount | amount_inr | nested order/txns) into Ops UI evidence. */
function normalizeOpsEvidence(doc: CosmosEscalation): EscalationPackage["evidence"] {
  const raw = (doc.evidence || {}) as Record<string, unknown>;
  const orderObj = asRecord(raw.order);
  const determination = asRecord(raw.determination);

  const rawTxns = Array.isArray(raw.txns)
    ? raw.txns
    : Array.isArray(raw.transactions)
      ? raw.transactions
      : [];

  const txns = rawTxns.map((t, i) => {
    if (typeof t === "string") {
      return {
        txnId: t,
        gatewayRef: t,
        utr: t,
        status: "recorded",
        amount: 0,
        channel: "upi",
      };
    }
    const row = asRecord(t) || {};
    const txnId = String(row.txnId || row.txn_id || `TXN-${i + 1}`);
    return {
      txnId,
      gatewayRef: String(row.gatewayRef || row.gateway_ref || txnId),
      utr: String(row.utr || row.UTR || txnId),
      status: String(row.status || row.settlement_status || "recorded"),
      amount: numField(row.amount, row.amount_inr) ?? 0,
      channel: String(row.channel || "upi"),
    };
  });

  // Prefer explicit amount; else order amount; else single-txn duplicate amount (not sum of both).
  const amount =
    numField(raw.amount, raw.amount_inr, orderObj?.amount_inr, orderObj?.amount) ??
    (txns.length ? txns[0].amount : 0);

  const orderId =
    (typeof doc.order === "string" && doc.order) ||
    String(raw.orderId || raw.order_id || orderObj?.order_id || orderObj?.orderId || "");

  return {
    orderId,
    amount,
    currency: String(raw.currency || "INR"),
    timestamp: String(
      raw.timestamp || orderObj?.ordered_at || doc.createdAt || ""
    ),
    bankSwitchCode: String(raw.bankSwitchCode || "PENDING_VERIFY"),
    terminalId:
      typeof raw.terminalId === "string"
        ? raw.terminalId
        : typeof raw.terminal_id === "string"
          ? raw.terminal_id
          : undefined,
    telemetryStatus: String(
      raw.telemetryStatus || doc.detectedSituation || "n/a"
    ),
    txns:
      txns.length > 0
        ? txns
        : (doc.transactions || []).map((txnId) => ({
            txnId,
            gatewayRef: txnId,
            utr: txnId,
            status: "recorded",
            amount: 0,
            channel: "upi",
          })),
    merchantMemory: (asRecord(raw.merchantMemory) as EscalationPackage["evidence"]["merchantMemory"]) || {
      disputeCount30d: 0,
      settlementRiskScore: 0,
      segment: "merchant",
    },
    anomalyDetails: (asRecord(raw.anomalyDetails) as EscalationPackage["evidence"]["anomalyDetails"]) || {
      suspectedCause: doc.detectedSituation || doc.issue || "",
      npciLatencyMs: 0,
      dualDebitConfirmed: Boolean(determination?.duplicate_charge_verified),
    },
  };
}

function mapOpsEscalation(doc: CosmosEscalation): EscalationPackage {
  const evidence = normalizeOpsEvidence(doc);
  const raw = (doc.evidence || {}) as Record<string, unknown>;
  const policyFromEvidence = asRecord(raw.policy);
  const policyId =
    doc.applicablePolicy?.policyId ||
    (typeof policyFromEvidence?.policy_id === "string"
      ? policyFromEvidence.policy_id
      : undefined) ||
    "UNKNOWN";
  const policyVersion =
    doc.applicablePolicy?.version ||
    (typeof policyFromEvidence?.version === "string" ? policyFromEvidence.version : "") ||
    "";

  return {
    escalationId: doc.escalationId,
    customerId: doc.customerId,
    orderId: evidence.orderId,
    workflowId:
      doc.workflowId ||
      (typeof raw.workflow_id === "string" ? raw.workflow_id : "") ||
      "",
    priority: mapPriority(doc.priority),
    status: mapEscalationState(doc.status),
    policyId,
    issue: doc.issue || "",
    evidence,
    applicablePolicy: {
      id: policyId,
      name: policyId,
      version: policyVersion,
      clause: "See policy registry",
      textSnippet: doc.agentConclusion || doc.detectedSituation || "",
    },
    agentConclusion: doc.agentConclusion || "",
    recommendedAction: doc.recommendedAction || "",
    humanCan: (doc.humanCan as HumanActionType[]) || [
      "approve",
      "reject",
      "modify",
      "take_over",
      "resolve",
      "return_to_agent",
    ],
    createdAt: doc.createdAt || "",
    updatedAt: doc.updatedAt || "",
    assignedTo: doc.assignedTo || undefined,
    resolutionDecision: doc.resolutionDecision,
  };
}

export async function listCustomerEscalations(customerId?: string): Promise<Escalation[]> {
  const rows = customerId
    ? await queryAll<CosmosEscalation>(
        "escalations",
        "SELECT * FROM c WHERE c.customerId = @id",
        [{ name: "@id", value: customerId }]
      )
    : await queryAll<CosmosEscalation>("escalations", "SELECT * FROM c");
  return rows.map(mapCustomerEscalation);
}

/** DB lookup for HIL packages by customer + optional order / escalation ids (no MCP). */
export async function findCustomerEscalationsMatching(opts: {
  customerId: string;
  orderId?: string;
  escalationIds?: string[];
}): Promise<Escalation[]> {
  const all = await listCustomerEscalations(opts.customerId);
  if (!all.length) return [];

  const escWant = new Set((opts.escalationIds || []).map((x) => x.toUpperCase()));
  const orderWant = (opts.orderId || "").toUpperCase();

  const matched = all.filter((e) => {
    if (escWant.size && escWant.has(e.escalationId.toUpperCase())) return true;
    if (orderWant && (e.relatedOrderId || "").toUpperCase() === orderWant) return true;
    return false;
  });

  // If tool said HIL but no id yet, return open packages for this customer (status from DB)
  if (!matched.length && (escWant.size || orderWant)) {
    return all.filter((e) => e.status !== "RESOLVED");
  }
  return matched.length ? matched : all.filter((e) => e.status !== "RESOLVED");
}

export async function listOpsEscalations(): Promise<EscalationPackage[]> {
  const rows = await queryAll<CosmosEscalation>("escalations", "SELECT * FROM c");
  return rows.map(mapOpsEscalation);
}

export async function getOpsEscalationById(id: string): Promise<EscalationPackage | null> {
  const rows = await queryAll<CosmosEscalation>(
    "escalations",
    "SELECT * FROM c WHERE c.escalationId = @id OR c.id = @idLower",
    [
      { name: "@id", value: id },
      { name: "@idLower", value: id.toLowerCase() },
    ]
  );
  return rows[0] ? mapOpsEscalation(rows[0]) : null;
}

export async function getCustomerEscalationById(id: string): Promise<Escalation | null> {
  const rows = await queryAll<CosmosEscalation>(
    "escalations",
    "SELECT * FROM c WHERE c.escalationId = @id OR c.id = @idLower",
    [
      { name: "@id", value: id },
      { name: "@idLower", value: id.toLowerCase() },
    ]
  );
  return rows[0] ? mapCustomerEscalation(rows[0]) : null;
}

export async function patchEscalationDecision(
  escalationId: string,
  action: HumanActionType,
  decidedBy: string,
  notes: string,
  refundAmount?: number
): Promise<EscalationPackage | null> {
  const container = getContainer("escalations");
  if (!container) return null;

  const rows = await queryAll<CosmosEscalation & { id: string; _rid?: string }>(
    "escalations",
    "SELECT * FROM c WHERE c.escalationId = @id",
    [{ name: "@id", value: escalationId }]
  );
  const existing = rows[0];
  if (!existing?.id) return null;

  const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const nextStatus =
    action === "return_to_agent"
      ? "returned"
      : action === "take_over" || action === "modify"
        ? "in_review"
        : action === "resolve" || action === "approve" || action === "reject"
          ? "resolved"
          : existing.status || "open";

  const updated = {
    ...existing,
    status: nextStatus,
    updatedAt: now,
    assignedTo: decidedBy,
    resolutionDecision: {
      action,
      decidedBy,
      decidedAt: now,
      notes,
      refundAmount,
    },
  };

  await container.items.upsert(updated);

  // Keep merchant order ledger in sync when Ops settles a dispute
  const orderIdForSync =
    (typeof updated.order === "string" && updated.order) ||
    mapOpsEscalation(updated).orderId ||
    "";
  if (orderIdForSync && (action === "approve" || action === "reject" || action === "resolve")) {
    await syncOrderAfterHilDecision({
      customerId: updated.customerId,
      orderId: orderIdForSync,
      action,
      escalationId: updated.escalationId,
      refundAmount,
      now,
    });
  }

  return mapOpsEscalation(updated);
}

async function syncOrderAfterHilDecision(opts: {
  customerId: string;
  orderId: string;
  action: HumanActionType;
  escalationId: string;
  refundAmount?: number;
  now: string;
}) {
  const orders = getContainer("orders");
  if (!orders) return;
  try {
    const rows = await queryAll<CosmosOrder & { id: string }>(
      "orders",
      "SELECT * FROM c WHERE c.customerId = @cid AND c.orderId = @oid",
      [
        { name: "@cid", value: opts.customerId },
        { name: "@oid", value: opts.orderId },
      ]
    );
    const order = rows[0];
    if (!order?.id) return;

    const nextStatus =
      opts.action === "approve"
        ? "refunded"
        : opts.action === "reject"
          ? "paid_settled"
          : "paid_settled";

    await orders.items.upsert({
      ...order,
      status: nextStatus,
      updatedAt: opts.now,
      disputeResolution: {
        escalationId: opts.escalationId,
        action: opts.action,
        refundAmount: opts.refundAmount ?? null,
        resolvedAt: opts.now,
      },
    });
  } catch {
    /* best-effort; escalation decision already persisted */
  }
}

// ---------- Policies ----------

type CosmosPolicy = {
  policyId: string;
  version?: string;
  title?: string;
  productId?: string;
  status?: string;
  effectiveDate?: string;
  ownerTeam?: string;
  keyRules?: Record<string, unknown>;
  updatedAt?: string;
};

function mapPolicyProduct(productId?: string): PolicyRecord["product"] {
  const p = (productId || "").toLowerCase();
  if (p.includes("soundbox")) return "SoundBox";
  if (p.includes("card") || p.includes("pos")) return "Smart POS";
  if (p.includes("api")) return "Payment Gateway";
  return "Core Settlement";
}

function mapPolicy(doc: CosmosPolicy): PolicyRecord {
  const status = (doc.status || "").toLowerCase();
  return {
    policyId: doc.policyId,
    version: doc.version || "v1",
    title: doc.title || doc.policyId,
    product: mapPolicyProduct(doc.productId),
    status: status === "active" ? "active" : status === "draft" ? "draft" : "deprecated",
    effectiveDate: doc.effectiveDate || "",
    category: "Dispute & Refunds",
    scope: doc.ownerTeam || "Ops",
    ruleSummary: doc.keyRules
      ? JSON.stringify(doc.keyRules).slice(0, 240)
      : "See Cosmos policy registry",
    lastIngestedAt: doc.updatedAt || "",
    ingestedBy: "cosmos-registry",
  };
}

export async function listPolicies(): Promise<PolicyRecord[]> {
  const rows = await queryAll<CosmosPolicy>("policies", "SELECT * FROM c");
  return rows.map(mapPolicy);
}

/** Active Cosmos policy row with keyRules (for chat grounding). */
export async function getActivePolicyById(policyId: string): Promise<{
  policyId: string;
  version: string;
  title: string;
  status: string;
  keyRules: Record<string, unknown>;
  supersedes?: string;
} | null> {
  const rows = await queryAll<CosmosPolicy>(
    "policies",
    "SELECT * FROM c WHERE c.policyId = @pid AND c.status = @st",
    [
      { name: "@pid", value: policyId },
      { name: "@st", value: "active" },
    ]
  );
  const doc = rows[0];
  if (!doc) return null;
  return {
    policyId: doc.policyId,
    version: doc.version || "v1",
    title: doc.title || doc.policyId,
    status: doc.status || "active",
    keyRules: doc.keyRules || {},
    supersedes: (doc as { supersedes?: string }).supersedes,
  };
}

// ---------- Sales leads ----------

type CosmosLead = {
  leadId: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  city?: string;
  stage?: string;
  interestedProducts?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

function mapLeadStage(stage?: string): SalesStage {
  const s = (stage || "").toLowerCase();
  if (s.includes("won") || s.includes("onboard")) return "Onboarding";
  if (s.includes("propos") || s.includes("quote")) return "Quoting";
  if (s.includes("negot")) return "Negotiation";
  if (s.includes("follow")) return "Follow-ups";
  if (s.includes("closed")) return "Closed-Won";
  return "Outreach";
}

function mapLeadAgent(stage: SalesStage): SalesAgentId {
  if (stage === "Onboarding" || stage === "Closed-Won") return "Agent3-Onboarding";
  if (stage === "Quoting" || stage === "Negotiation") return "Agent2-QuoteNegotiate";
  return "Agent1-Outreach";
}

function mapLeadProduct(products?: string[]): Lead["productPitch"] {
  const joined = (products || []).join(" ").toLowerCase();
  if (joined.includes("api")) return "Payment Gateway Enterprise";
  if (joined.includes("card") || joined.includes("pos")) return "All-in-One Linux POS";
  return "Paytm SoundBox 4G Dual Sim";
}

function mapLead(doc: CosmosLead): Lead {
  const currentStage = mapLeadStage(doc.stage);
  return {
    id: doc.leadId,
    businessName: doc.companyName || doc.leadId,
    contactName: doc.contactName || "",
    phone: doc.phone || "",
    email: doc.email || "",
    city: doc.city || "",
    currentStage,
    assignedAgent: mapLeadAgent(currentStage),
    dealValue: 0,
    productPitch: mapLeadProduct(doc.interestedProducts),
    hardwareCount: (doc.interestedProducts || []).length || 1,
    createdAt: doc.createdAt || "",
    updatedAt: doc.updatedAt || "",
    stageLogs: [
      {
        id: `${doc.leadId}-log-1`,
        timestamp: doc.updatedAt || doc.createdAt || "",
        stage: currentStage,
        agentId: mapLeadAgent(currentStage),
        actionTaken: doc.notes || `Stage: ${doc.stage || currentStage}`,
        reasoning: "Loaded from Cosmos sales_leads",
        nextStep: "Continue sequential stage handoff via Orchestrator/MCP",
      },
    ],
  };
}

export async function listLeads(): Promise<Lead[]> {
  const rows = await queryAll<CosmosLead>("sales_leads", "SELECT * FROM c");
  return rows.map(mapLead);
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const rows = await queryAll<CosmosLead>(
    "sales_leads",
    "SELECT * FROM c WHERE c.leadId = @id",
    [{ name: "@id", value: id }]
  );
  return rows[0] ? mapLead(rows[0]) : null;
}
