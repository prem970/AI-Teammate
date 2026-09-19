import { Customer, Order, Device, Escalation } from "./types";

export const MOCK_CUSTOMERS: Record<string, Customer> = {
  "CUST-10291": {
    id: "CUST-10291",
    mid: "MID-992810482",
    name: "Rajesh Kumar",
    email: "rajesh.retail@merchants.paytm.mock",
    businessName: "Rajesh Supermarket & Provision Store",
    businessType: "FMCG / Grocery & Departmental",
    segment: "Tier-1 Autonomous SoundBox & POS Merchant",
    preferredChannel: "WhatsApp",
    phone: "+91 98450 12931",
    registeredDate: "14 Jan 2023",
    settlementAccount: "HDFC Bank •••• 8109 (IFSC: HDFC0001248)",
    kycStatus: "VERIFIED",
  },
  "CUST-20442": {
    id: "CUST-20442",
    mid: "MID-881920311",
    name: "Anita Sharma",
    email: "anita.sharma@digitalmart.mock",
    businessName: "Sharma Digital Electronics",
    businessType: "Consumer Electronics & Mobile Accessories",
    segment: "Tier-2 Smart POS & Gateway Merchant",
    preferredChannel: "Autonomous Web Push",
    phone: "+91 97110 44290",
    registeredDate: "03 Aug 2023",
    settlementAccount: "ICICI Bank •••• 4022 (IFSC: ICIC0000042)",
    kycStatus: "VERIFIED",
  },
};

export const MOCK_ORDERS: Order[] = [
  {
    orderId: "ORD-DUP-1001",
    customerId: "CUST-10291",
    amount: 1450.0,
    currency: "INR",
    status: "disputed",
    timestamp: "Today, 04:12 PM",
    productType: "SoundBox QR",
    utr: "UTR-428901829001",
    customerIdentifier: "UPI: rahul.sharma@okaxis",
    disputeReason: "Dual customer debit reported; merchant received single audio prompt",
    disputeEscalationId: "ESC-90214",
    tracking: {
      terminalId: "TID-SBX-82931",
      settlementBatch: "SETTLE-HOLD-20260919",
      channel: "UPI Intent via SoundBox QR",
      responseCode: "U69_DUPLICATE_DEBIT_SUSPECT",
    },
  },
  {
    orderId: "ORD-82931",
    customerId: "CUST-10291",
    amount: 820.0,
    currency: "INR",
    status: "settled",
    timestamp: "Today, 03:45 PM",
    productType: "SoundBox QR",
    utr: "UTR-428901114920",
    customerIdentifier: "UPI: priya.v@paytm",
    tracking: {
      terminalId: "TID-SBX-82931",
      settlementBatch: "BATCH-20260919-T1",
      channel: "UPI QR Audio Prompt",
      responseCode: "SUCCESS_00",
    },
  },
  {
    orderId: "ORD-99120",
    customerId: "CUST-10291",
    amount: 3499.0,
    currency: "INR",
    status: "settled",
    timestamp: "Today, 01:10 PM",
    productType: "POS Dynamic QR",
    utr: "UTR-428900889214",
    customerIdentifier: "Card: Visa Contactless •••• 7192",
    tracking: {
      terminalId: "TID-POS-44019",
      settlementBatch: "BATCH-20260919-T1",
      channel: "Card Tap & Pay",
      responseCode: "AUTH_APPROVED",
    },
  },
  {
    orderId: "ORD-55104",
    customerId: "CUST-10291",
    amount: 250.0,
    currency: "INR",
    status: "pending",
    timestamp: "Today, 11:32 AM",
    productType: "SoundBox QR",
    utr: "UTR-428899401294",
    customerIdentifier: "UPI: amit.k@ybl",
    tracking: {
      terminalId: "TID-SBX-82931",
      settlementBatch: "AWAITING_NPCI_ACK",
      channel: "UPI Dynamic QR",
      responseCode: "PENDING_NPCI",
    },
  },
  {
    orderId: "ORD-33219",
    customerId: "CUST-10291",
    amount: 5100.0,
    currency: "INR",
    status: "refunded",
    timestamp: "Yesterday, 06:14 PM",
    productType: "Payment Gateway API",
    utr: "UTR-428781992018",
    customerIdentifier: "NetBanking: SBI Corporate",
    tracking: {
      terminalId: "API-GATEWAY-PROD",
      settlementBatch: "REFUND-PROCESSED",
      channel: "Checkout API v3",
      responseCode: "REFUND_SETTLED",
    },
  },
];

export const MOCK_DEVICES: Device[] = [
  {
    tid: "TID-SBX-82931",
    model: "Paytm SoundBox 4G Dual Sim Edition (English/Hindi/Tamil)",
    category: "SoundBox",
    status: "active",
    paired: true,
    pairedPhone: "+91 98450 12931",
    network: "4G VoLTE",
    signalStrength: 94,
    batteryLevel: 88,
    lastSeen: "1 minute ago",
    simStatus: "Active - Airtel M2M",
    firmwareVersion: "SBX-v4.2.11-AUTO",
    volumeLevel: 8,
    audioHeartbeatOk: true,
  },
  {
    tid: "TID-POS-44019",
    model: "Paytm All-in-One Smart POS Linux V3",
    category: "POS Terminal",
    status: "active",
    paired: true,
    pairedPhone: "+91 98450 12931",
    network: "Wi-Fi",
    signalStrength: 98,
    batteryLevel: 72,
    lastSeen: "Just now",
    simStatus: "Active - Jio IoT",
    firmwareVersion: "POS-OS-8.9.2-STABLE",
    volumeLevel: 7,
    audioHeartbeatOk: true,
  },
  {
    tid: "TID-SBX-10928",
    model: "Paytm SoundBox Pocket Edition",
    category: "SoundBox",
    status: "needs_attention",
    paired: false,
    pairedPhone: "+91 98450 12931",
    network: "3G Fallback",
    signalStrength: 32,
    batteryLevel: 14,
    lastSeen: "4 hours ago",
    simStatus: "No Signal",
    firmwareVersion: "SBX-v3.8.0-PATCH",
    volumeLevel: 5,
    audioHeartbeatOk: false,
  },
];

export const MOCK_ESCALATIONS: Escalation[] = [
  {
    escalationId: "ESC-90214",
    customerId: "CUST-10291",
    issue: "Disputed Transaction ORD-DUP-1001: Customer account debited twice during UPI outage",
    priority: "HIGH",
    status: "AUTONOMOUS_INVESTIGATION",
    recommendedAction: "Auto-reconcile with NPCI switch logs; hold auto-settlement until clearing verification.",
    createdAt: "2026-09-19 16:15 IST",
    updatedAt: "2026-09-19 16:18 IST",
    relatedOrderId: "ORD-DUP-1001",
    relatedTid: "TID-SBX-82931",
    evidenceSummary: {
      transactionTimestamp: "2026-09-19 16:12:08 IST",
      bankSwitchCode: "NPCI-RESP-U69 (Transient Timeout Reversal)",
      telemetryStatus: "SoundBox TID-SBX-82931 played single prompt for INR 1,450.00 at 16:12:15 IST",
      customerClaims: "Customer Rahul Sharma showed dual debit SMS of ₹1,450 from Axis Bank",
      detectedAnomaly: "Dual debit transaction ID found on NPCI ledger; auto-refund initiated to remitter.",
    },
    policyId: "POL-AUTO-DISPUTE-V2.4",
    policyConfidence: 0.98,
    humanCan: [
      "Override AI dispute refund limit (>₹10,000)",
      "Initiate manual bank recon ticket with Axis Bank Clearing House",
      "Force credit payout to merchant settlement ledger",
      "Dispatch field hardware engineer for Soundbox audio telemetry check",
    ],
  },
  {
    escalationId: "ESC-88410",
    customerId: "CUST-10291",
    issue: "Telemetry Alert: Audio acknowledgment packet delay on TID-SBX-10928",
    priority: "MEDIUM",
    status: "QUEUED_FOR_HUMAN",
    recommendedAction: "Verify fallback SIM network profile or trigger over-the-air firmware resync.",
    createdAt: "2026-09-18 11:20 IST",
    updatedAt: "2026-09-18 14:05 IST",
    relatedTid: "TID-SBX-10928",
    evidenceSummary: {
      transactionTimestamp: "2026-09-18 11:15:00 IST",
      bankSwitchCode: "N/A - Hardware Level",
      telemetryStatus: "Packet latency exceeded 4200ms threshold on 3G cell tower",
      customerClaims: "Voice prompt took 8 seconds to announce payment receipt",
      detectedAnomaly: "Cellular signal dropped below -105dBm in indoor basement area",
    },
    policyId: "POL-HW-TELEMETRY-v1.8",
    policyConfidence: 0.92,
    humanCan: [
      "Approve SIM swap to 4G Airtel M2M",
      "Assign territory hardware engineer for on-site booster install",
      "Issue warranty replacement SoundBox unit",
    ],
  },
  {
    escalationId: "ESC-77102",
    customerId: "CUST-10291",
    issue: "Auto-Reconciliation of Pending UPI Settlement batch UTR-428781992018",
    priority: "LOW",
    status: "RESOLVED",
    recommendedAction: "Settlement released to HDFC Bank primary account automatically by AI OS Reconciler.",
    createdAt: "2026-09-17 09:00 IST",
    updatedAt: "2026-09-17 09:03 IST",
    relatedOrderId: "ORD-33219",
    evidenceSummary: {
      transactionTimestamp: "2026-09-17 08:58:12 IST",
      bankSwitchCode: "NPCI-MATCH-SUCCESS",
      telemetryStatus: "Verified against Gateway Batch 811",
      customerClaims: "Merchant reported settlement delay past 08:30 AM window",
      detectedAnomaly: "Delay caused by scheduled NPCI maintenance window; no financial discrepancy found",
    },
    policyId: "POL-AUTO-RECON-V4.1",
    policyConfidence: 1.0,
    humanCan: [
      "View audit logs in immutable compliance ledger",
      "Export certified RBI settlement statement",
    ],
  },
];

export function getCustomer(id: string = "CUST-10291"): Customer {
  return MOCK_CUSTOMERS[id] || MOCK_CUSTOMERS["CUST-10291"];
}

export function getOrders(customerId: string = "CUST-10291"): Order[] {
  return MOCK_ORDERS.filter((o) => o.customerId === customerId);
}

export function getOrderById(orderId: string): Order | undefined {
  return MOCK_ORDERS.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase());
}

export function getDevices(): Device[] {
  return MOCK_DEVICES;
}

export function getEscalations(customerId: string = "CUST-10291"): Escalation[] {
  return MOCK_ESCALATIONS.filter((e) => e.customerId === customerId);
}

export function getEscalationById(escalationId: string): Escalation | undefined {
  return MOCK_ESCALATIONS.find(
    (e) => e.escalationId.toLowerCase() === escalationId.toLowerCase()
  );
}
