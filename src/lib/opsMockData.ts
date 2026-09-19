import {
  EmployeeUser,
  EscalationPackage,
  PolicyRecord,
  Lead,
  HumanActionType,
} from "./opsTypes";

export const MOCK_EMPLOYEES: Record<string, EmployeeUser> = {
  support: {
    id: "EMP-SUPP-101",
    name: "Vikram Mehta",
    email: "support.agent@company.mock",
    role: "support",
    department: "Tier-2 Merchant Dispute & Hardware Operations",
    badgeId: "OPS-9921",
  },
  sales_ops: {
    id: "EMP-SALES-202",
    name: "Priya Iyer",
    email: "sales.ops@company.mock",
    role: "sales_ops",
    department: "Merchant Pipeline & Multi-Agent Revenue Ops",
    badgeId: "REV-4481",
  },
  policy_owner: {
    id: "EMP-POL-303",
    name: "Devashish Roy",
    email: "policy.owner@company.mock",
    role: "policy_owner",
    department: "Regulatory Compliance & AI Policy Governance",
    badgeId: "POL-7712",
  },
};

export const INITIAL_ESCALATIONS: EscalationPackage[] = [
  {
    escalationId: "ESC-90214",
    customerId: "CUST-10291",
    orderId: "ORD-DUP-1001",
    workflowId: "WF-NPCI-DUAL-DEBIT-77",
    priority: "P1",
    status: "open",
    policyId: "PAYMENT-DUPLICATE-V2",
    issue: "Dual customer debit detected during transient NPCI timeout; SoundBox played single audio prompt",
    evidence: {
      orderId: "ORD-DUP-1001",
      amount: 1450.0,
      currency: "INR",
      timestamp: "2026-09-19 16:12:08 IST",
      bankSwitchCode: "NPCI-RESP-U69 (TRANSIENT_TIMEOUT_REVERSAL)",
      terminalId: "TID-SBX-82931",
      telemetryStatus: "SoundBox played single audio prompt for INR 1,450.00 at 16:12:15 IST",
      txns: [
        {
          txnId: "TXN-001",
          gatewayRef: "GW-AXIS-9928101",
          utr: "UTR-428901829001-A",
          status: "SUCCESS_SETTLED",
          amount: 1450.0,
          channel: "UPI Intent",
        },
        {
          txnId: "TXN-002",
          gatewayRef: "GW-AXIS-9928102",
          utr: "UTR-428901829001-B",
          status: "FAILED_REVERSED_OR_PENDING",
          amount: 1450.0,
          channel: "UPI Intent Duplicate",
        },
      ],
      merchantMemory: {
        disputeCount30d: 1,
        settlementRiskScore: 0.04,
        segment: "Tier-1 SoundBox Retail Merchant",
      },
      anomalyDetails: {
        suspectedCause: "Axis Bank remitter switch dropped first ACK; customer app retried simultaneously.",
        npciLatencyMs: 4890,
        dualDebitConfirmed: true,
      },
    },
    applicablePolicy: {
      id: "PAYMENT-DUPLICATE-V2",
      name: "Autonomous Dual-Debit Resolution Standard",
      version: "v2.4.1",
      clause: "Section 4.1 - Switch Code U69 Transient Duplicate",
      textSnippet:
        "When NPCI returns code U69 with dual debit confirmation on remitter switch, merchant ledger must hold first captured txn while secondary duplicate debit must be released to remitter within 2 hours. MCP does not auto-refund; human decision required.",
      linkUrl: "/ops/policies",
    },
    agentConclusion:
      "Autonomous Supervisor verified that remitter account was charged twice (₹1,450 x 2). TXN-001 is legitimate. TXN-002 is duplicate. Recommend releasing refund on TXN-002 to customer Rahul Sharma while preserving merchant payout on TXN-001.",
    recommendedAction:
      "Approve instant UPI credit reversal of INR 1,450.00 for TXN-002; mark merchant ledger balanced.",
    humanCan: ["approve", "reject", "modify", "take_over", "resolve", "return_to_agent"],
    createdAt: "2026-09-19 16:15 IST",
    updatedAt: "2026-09-19 16:18 IST",
  },
  {
    escalationId: "ESC-88410",
    customerId: "CUST-10291",
    orderId: "N/A - Hardware",
    workflowId: "WF-HW-TELEMETRY-MONITOR-12",
    priority: "P2",
    status: "open",
    policyId: "POL-SBX-001",
    issue: "Acoustic latency spike (>4200ms) on SoundBox TID-SBX-10928 in basement retail wing",
    evidence: {
      orderId: "N/A",
      amount: 0,
      currency: "INR",
      timestamp: "2026-09-18 11:15:00 IST",
      bankSwitchCode: "N/A - IoT Hardware",
      terminalId: "TID-SBX-10928",
      telemetryStatus: "Packet latency 4200ms, cellular signal -108 dBm on 3G fallback SIM",
      txns: [],
      merchantMemory: {
        disputeCount30d: 0,
        settlementRiskScore: 0.02,
        segment: "Tier-1 SoundBox Retail Merchant",
      },
      anomalyDetails: {
        suspectedCause: "Cellular handover failure between Airtel M2M and Jio IoT roaming profile.",
        npciLatencyMs: 0,
        dualDebitConfirmed: false,
      },
    },
    applicablePolicy: {
      id: "POL-SBX-001",
      name: "SoundBox Acoustic & Telemetry Resilience Standard",
      version: "v1.8.0",
      clause: "Section 2.3 - Degradation Thresholds",
      textSnippet:
        "If cellular latency exceeds 3500ms across 3 consecutive pings, agent must recommend remote SIM carrier toggle before dispatching field hardware replacement.",
    },
    agentConclusion:
      "Terminal TID-SBX-10928 is struggling on 3G fallback. Firmware OTA ping is acknowledged but voice packet latency degraded merchant experience.",
    recommendedAction:
      "Dispatch remote OTA profile refresh to force 4G carrier renegotiation; or queue territory hardware visit.",
    humanCan: ["approve", "reject", "modify", "take_over", "resolve", "return_to_agent"],
    createdAt: "2026-09-18 11:20 IST",
    updatedAt: "2026-09-18 14:05 IST",
  },
  {
    escalationId: "ESC-77102",
    customerId: "CUST-20442",
    orderId: "ORD-33219",
    workflowId: "WF-SETTLEMENT-RECON-99",
    priority: "P3",
    status: "in_review",
    policyId: "POL-SETTLE-DAILY-V1",
    issue: "Settlement payout window hold for high-value NetBanking batch ₹5,100",
    evidence: {
      orderId: "ORD-33219",
      amount: 5100.0,
      currency: "INR",
      timestamp: "2026-09-17 08:58:12 IST",
      bankSwitchCode: "NPCI-MATCH-SUCCESS",
      telemetryStatus: "Payment Gateway API checkout transaction",
      txns: [
        {
          txnId: "TXN-8812",
          gatewayRef: "GW-SBI-11029",
          utr: "UTR-428781992018",
          status: "SUCCESS",
          amount: 5100.0,
          channel: "NetBanking SBI",
        },
      ],
      merchantMemory: {
        disputeCount30d: 0,
        settlementRiskScore: 0.01,
        segment: "Tier-2 Smart POS & Gateway Merchant",
      },
      anomalyDetails: {
        suspectedCause: "Scheduled clearing bank maintenance window delayed batch release by 30 mins.",
        npciLatencyMs: 210,
        dualDebitConfirmed: false,
      },
    },
    applicablePolicy: {
      id: "POL-SETTLE-DAILY-V1",
      name: "Daily Merchant Settlement Clearing Policy",
      version: "v3.1.0",
      clause: "Section 7.2 - Bank Batch Delays",
      textSnippet:
        "Settlement releases over ₹5,000 experiencing bank maintenance holds require support ops verification before manual bypass.",
    },
    agentConclusion:
      "Bank clearing files confirmed clean credit to merchant ICICI escrow account. No financial discrepancy.",
    recommendedAction:
      "Approve automated release bypass and mark escalation resolved.",
    humanCan: ["approve", "reject", "modify", "take_over", "resolve", "return_to_agent"],
    createdAt: "2026-09-17 09:00 IST",
    updatedAt: "2026-09-17 09:15 IST",
  },
  {
    escalationId: "ESC-66019",
    customerId: "CUST-10291",
    orderId: "N/A - Merchant Ops",
    workflowId: "WF-QR-REPRINT-01",
    priority: "P4",
    status: "resolved",
    policyId: "POL-SBX-001",
    issue: "Dynamic QR standee replacement request following store remodeling",
    evidence: {
      orderId: "N/A",
      amount: 0,
      currency: "INR",
      timestamp: "2026-09-16 10:00:00 IST",
      bankSwitchCode: "N/A",
      telemetryStatus: "N/A",
      txns: [],
      merchantMemory: {
        disputeCount30d: 0,
        settlementRiskScore: 0.01,
        segment: "Tier-1 SoundBox Retail Merchant",
      },
      anomalyDetails: {
        suspectedCause: "Merchant physical renovation damaged acrylic standee.",
        npciLatencyMs: 0,
        dualDebitConfirmed: false,
      },
    },
    applicablePolicy: {
      id: "POL-SBX-001",
      name: "SoundBox Hardware & QR Accessory Provisioning",
      version: "v1.8.0",
      clause: "Section 5 - Merchant Collateral",
      textSnippet: "Verified Tier-1 merchants are eligible for up to 2 free QR replacements annually.",
    },
    agentConclusion: "Merchant quota verified. Free replacement standee authorized.",
    recommendedAction: "Dispatch acrylic QR standee to merchant registered business address.",
    humanCan: ["resolve"],
    createdAt: "2026-09-16 10:05 IST",
    updatedAt: "2026-09-16 10:30 IST",
    resolutionDecision: {
      action: "resolve",
      decidedBy: "Vikram Mehta (support)",
      decidedAt: "2026-09-16 10:30 IST",
      notes: "Standee dispatched via Bluedart tracking #BD9928104. Ticket closed.",
    },
  },
];

export const MOCK_POLICIES: PolicyRecord[] = [
  {
    policyId: "PAYMENT-DUPLICATE-V2",
    version: "v2.4.1",
    title: "Autonomous Dual-Debit Resolution & Settlement Protection Standard",
    product: "SoundBox",
    status: "active",
    effectiveDate: "2026-08-01",
    category: "Dispute & Refunds",
    scope: "All Paytm SoundBox QR transactions with duplicate customer debits",
    ruleSummary:
      "Governs automated dispute reconciliation when a customer is debited twice for a single SoundBox voice prompt. The primary txn is preserved in merchant ledger; the secondary duplicate debit is queued for human authorization and remitter refund.",
    lastIngestedAt: "2026-08-15 04:30 IST",
    ingestedBy: "Devashish Roy (policy_owner)",
  },
  {
    policyId: "POL-SBX-001",
    version: "v1.8.0",
    title: "SoundBox Hardware Acoustic Latency & IoT Resiliency Guideline",
    product: "SoundBox",
    status: "active",
    effectiveDate: "2026-06-15",
    category: "Hardware Telemetry",
    scope: "SoundBox 4G Dual Sim, Pocket SoundBox, and Smart POS audio units",
    ruleSummary:
      "Defines SLA boundaries for audio confirmation prompts (<1200ms). Sets automated trigger thresholds for OTA profile re-negotiation and field technician dispatch when latency exceeds 3500ms.",
    lastIngestedAt: "2026-07-02 11:20 IST",
    ingestedBy: "Devashish Roy (policy_owner)",
  },
  {
    policyId: "POL-SETTLE-DAILY-V1",
    version: "v3.1.0",
    title: "Daily Merchant Escrow Settlement & Clearing Governance",
    product: "Core Settlement",
    status: "active",
    effectiveDate: "2026-05-10",
    category: "Settlement Reversal",
    scope: "All merchant tier daily clearing batches via RBI NEFT/RTGS/IMPS",
    ruleSummary:
      "Automates daily clearing cutoffs at 18:00 IST. Imposes automated settlement holds on high-risk transaction anomalies until multi-agent reconciliation affirms clean funds.",
    lastIngestedAt: "2026-05-12 18:00 IST",
    ingestedBy: "Devashish Roy (policy_owner)",
  },
  {
    policyId: "POL-POS-AUTH-LEGACY",
    version: "v1.0.0",
    title: "Smart POS Magnetic Stripe Fallback (Deprecated Standard)",
    product: "Smart POS",
    status: "deprecated",
    effectiveDate: "2024-01-01",
    category: "Merchant Risk",
    scope: "Deprecated legacy POS swipe terminals",
    ruleSummary:
      "Superseded by EMV chip and contactless Tap-to-Pay rules. Historical reference only; current active policies strictly beat historical precedents.",
    lastIngestedAt: "2024-01-10 12:00 IST",
    ingestedBy: "Devashish Roy (policy_owner)",
  },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: "LEAD-401",
    businessName: "Aroma Coffee Roasters (12 Outlets)",
    contactName: "Sunil Shenoy",
    phone: "+91 98200 44910",
    email: "sunil@aromacoffee.in",
    city: "Bengaluru",
    currentStage: "Quoting",
    assignedAgent: "Agent2-QuoteNegotiate",
    dealValue: 45000,
    productPitch: "Paytm SoundBox 4G Dual Sim",
    hardwareCount: 12,
    createdAt: "2026-09-15",
    updatedAt: "2026-09-19 11:20 IST",
    stageLogs: [
      {
        id: "log-401-1",
        timestamp: "2026-09-15 09:30 IST",
        stage: "Outreach",
        agentId: "Agent1-Outreach",
        actionTaken: "Cold email & WhatsApp outreach to founder Sunil Shenoy.",
        reasoning: "High footfall specialty cafe chain expanding to 12 outlets across Indiranagar and Koramangala.",
        nextStep: "Wait for founder response or trigger follow-up in 48h.",
      },
      {
        id: "log-401-2",
        timestamp: "2026-09-16 14:15 IST",
        stage: "Follow-ups",
        agentId: "Agent1-Outreach",
        actionTaken: "Scheduled automated demo call via WhatsApp bot.",
        reasoning: "Merchant responded showing interest in English + Kannada voice prompts for busy coffee bar.",
        nextStep: "Hand off to Agent2 for commercial proposal generation.",
      },
      {
        id: "log-401-3",
        timestamp: "2026-09-18 10:45 IST",
        stage: "Quoting",
        agentId: "Agent2-QuoteNegotiate",
        actionTaken: "Generated commercial quote: 12 units at ₹199/mo rental with 0% UPI MDR.",
        reasoning: "Volume discount applied per standard SaaS pricing tier-2.",
        nextStep: "Awaiting merchant feedback on hardware rental vs outright purchase.",
      },
    ],
  },
  {
    id: "LEAD-388",
    businessName: "Metro Pharma Retail Network",
    contactName: "Dr. K. S. Rao",
    phone: "+91 99400 81290",
    email: "ksrao@metropharma.mock",
    city: "Hyderabad",
    currentStage: "Negotiation",
    assignedAgent: "Agent2-QuoteNegotiate",
    dealValue: 84000,
    productPitch: "All-in-One Linux POS",
    hardwareCount: 20,
    createdAt: "2026-09-12",
    updatedAt: "2026-09-19 14:00 IST",
    stageLogs: [
      {
        id: "log-388-1",
        timestamp: "2026-09-12 10:00 IST",
        stage: "Outreach",
        agentId: "Agent1-Outreach",
        actionTaken: "Targeted outreach to pharmacy operations director.",
        reasoning: "Pharma chains need integrated GST invoice printing on Android POS terminals.",
        nextStep: "Send technical spec sheet.",
      },
      {
        id: "log-388-2",
        timestamp: "2026-09-14 11:30 IST",
        stage: "Quoting",
        agentId: "Agent2-QuoteNegotiate",
        actionTaken: "Sent proposal for 20 Smart POS Linux V3 terminals.",
        reasoning: "Standard enterprise pricing proposal.",
        nextStep: "Engage in commercial contract negotiation.",
      },
      {
        id: "log-388-3",
        timestamp: "2026-09-17 16:30 IST",
        stage: "Negotiation",
        agentId: "Agent2-QuoteNegotiate",
        actionTaken: "Offered 3 months waived device rental in exchange for 2-year exclusivity agreement.",
        reasoning: "Competitor terminal replacement requested; customer agreed in principle.",
        nextStep: "Send master merchant agreement for legal review.",
      },
    ],
  },
  {
    id: "LEAD-512",
    businessName: "QuickBite Express Bakeries",
    contactName: "Tanya Sen",
    phone: "+91 98310 99011",
    email: "tanya@quickbite.in",
    city: "Kolkata",
    currentStage: "Outreach",
    assignedAgent: "Agent1-Outreach",
    dealValue: 18000,
    productPitch: "Paytm SoundBox 4G Dual Sim",
    hardwareCount: 6,
    createdAt: "2026-09-18",
    updatedAt: "2026-09-18 17:00 IST",
    stageLogs: [
      {
        id: "log-512-1",
        timestamp: "2026-09-18 17:00 IST",
        stage: "Outreach",
        agentId: "Agent1-Outreach",
        actionTaken: "Initial multi-channel touchpoint initiated on verified merchant database.",
        reasoning: "Fast-casual bakery counters suffering peak hour queue congestion.",
        nextStep: "Track email open and send follow-up prompt in 24 hours.",
      },
    ],
  },
  {
    id: "LEAD-290",
    businessName: "Apex Hypermarket & Mart",
    contactName: "Manish Agarwal",
    phone: "+91 97110 55192",
    email: "manish@apexmart.mock",
    city: "Noida / Delhi NCR",
    currentStage: "Onboarding",
    assignedAgent: "Agent3-Onboarding",
    dealValue: 120000,
    productPitch: "Payment Gateway Enterprise",
    hardwareCount: 35,
    createdAt: "2026-09-01",
    updatedAt: "2026-09-19 12:10 IST",
    stageLogs: [
      {
        id: "log-290-1",
        timestamp: "2026-09-01 10:00 IST",
        stage: "Outreach",
        agentId: "Agent1-Outreach",
        actionTaken: "Inbound enterprise lead assigned.",
        reasoning: "Merchant migrating 35 cashier billing lanes from legacy bank.",
        nextStep: "Commercial quote dispatch.",
      },
      {
        id: "log-290-2",
        timestamp: "2026-09-08 15:00 IST",
        stage: "Quoting",
        agentId: "Agent2-QuoteNegotiate",
        actionTaken: "Issued enterprise proposal with 0.85% debit card MDR.",
        reasoning: "Matched enterprise rate card.",
        nextStep: "Finalize agreement.",
      },
      {
        id: "log-290-3",
        timestamp: "2026-09-15 11:00 IST",
        stage: "Negotiation",
        agentId: "Agent2-QuoteNegotiate",
        actionTaken: "Contract signed by VP Finance.",
        reasoning: "All pricing terms approved by leadership.",
        nextStep: "Hand off to Agent3 for technical onboarding.",
      },
      {
        id: "log-290-4",
        timestamp: "2026-09-19 12:10 IST",
        stage: "Onboarding",
        agentId: "Agent3-Onboarding",
        actionTaken: "Generated API keys, dispatching 35 SoundBox units and configuring billing webhook.",
        reasoning: "Hardware in transit; technical integration tests passing in sandbox.",
        nextStep: "Confirm terminal delivery and run live ₹1 test payment.",
      },
    ],
  },
  {
    id: "LEAD-104",
    businessName: "Sagar Sweets & Dairy",
    contactName: "Gopal Yadav",
    phone: "+91 94140 22091",
    email: "gopal@sagarsweets.mock",
    city: "Jaipur",
    currentStage: "Follow-ups",
    assignedAgent: "Agent1-Outreach",
    dealValue: 32000,
    productPitch: "Paytm SoundBox 4G Dual Sim",
    hardwareCount: 8,
    createdAt: "2026-09-16",
    updatedAt: "2026-09-19 09:40 IST",
    stageLogs: [
      {
        id: "log-104-1",
        timestamp: "2026-09-16 11:00 IST",
        stage: "Outreach",
        agentId: "Agent1-Outreach",
        actionTaken: "WhatsApp catalog shared.",
        reasoning: "Festive season sales surge expected.",
        nextStep: "Follow up with owner.",
      },
      {
        id: "log-104-2",
        timestamp: "2026-09-19 09:40 IST",
        stage: "Follow-ups",
        agentId: "Agent1-Outreach",
        actionTaken: "Owner asked for Hindi voice prompt sample.",
        reasoning: "Merchant requested audio demo.",
        nextStep: "Send audio snippet and pass to Agent2 for quote.",
      },
    ],
  },
  {
    id: "LEAD-077",
    businessName: "Velvet Fashion & Apparels",
    contactName: "Ritu Kapoor",
    phone: "+91 98100 77291",
    email: "ritu@velvetfashion.mock",
    city: "Mumbai",
    currentStage: "Closed-Won",
    assignedAgent: "Agent3-Onboarding",
    dealValue: 96000,
    productPitch: "All-in-One Linux POS",
    hardwareCount: 16,
    createdAt: "2026-08-20",
    updatedAt: "2026-09-18 18:00 IST",
    stageLogs: [
      {
        id: "log-077-1",
        timestamp: "2026-09-18 18:00 IST",
        stage: "Closed-Won",
        agentId: "Agent3-Onboarding",
        actionTaken: "All 16 POS terminals deployed and active. First settlement processed.",
        reasoning: "Successful deployment sign-off received from merchant.",
        nextStep: "Move to customer success monitoring.",
      },
    ],
  },
];

// In-memory escalation storage for demo state mutations (PATCH)
let escalationsStore = [...INITIAL_ESCALATIONS];

export function getEscalationsStore(): EscalationPackage[] {
  return escalationsStore;
}

export function getEscalationById(id: string): EscalationPackage | undefined {
  return escalationsStore.find(
    (e) => e.escalationId.toLowerCase() === id.toLowerCase()
  );
}

export function updateEscalationDecision(
  id: string,
  action: HumanActionType,
  decidedBy: string,
  notes: string,
  refundAmount?: number
): EscalationPackage | null {
  const index = escalationsStore.findIndex(
    (e) => e.escalationId.toLowerCase() === id.toLowerCase()
  );
  if (index === -1) return null;

  const current = escalationsStore[index];
  let newStatus = current.status;

  if (action === "approve" || action === "resolve") {
    newStatus = "resolved";
  } else if (action === "reject") {
    newStatus = "resolved";
  } else if (action === "return_to_agent") {
    newStatus = "returned";
  } else if (action === "take_over" || action === "modify") {
    newStatus = "in_review";
  }

  const updated: EscalationPackage = {
    ...current,
    status: newStatus,
    updatedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST",
    resolutionDecision: {
      action,
      decidedBy,
      decidedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST",
      notes: notes || `Human decision executed: ${action}`,
      refundAmount,
    },
  };

  escalationsStore[index] = updated;
  return updated;
}
