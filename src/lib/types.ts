export type CustomerRole = "customer";

export interface Customer {
  id: string; // e.g. 'CUST-10291'
  mid: string; // Merchant ID
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  segment: string; // e.g. "Tier-1 SoundBox Retail Merchant"
  preferredChannel: "WhatsApp" | "Email" | "Autonomous Web Push" | "SMS";
  phone: string;
  registeredDate: string;
  settlementAccount: string;
  kycStatus: "VERIFIED" | "PENDING_UPDATE";
}

export type OrderStatus = "settled" | "pending" | "disputed" | "refunded";

export interface Order {
  orderId: string; // e.g. 'ORD-82931', 'ORD-DUP-1001'
  customerId: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  timestamp: string;
  productType: "SoundBox QR" | "POS Dynamic QR" | "Card Swipe" | "Payment Gateway API";
  utr: string; // Unique Transaction Reference
  customerIdentifier?: string; // e.g. "UPI: user@okhdfcbank"
  disputeReason?: string; // e.g. "Dual customer debit detected by bank switch"
  disputeEscalationId?: string; // e.g. "ESC-90214"
  tracking: {
    terminalId?: string;
    settlementBatch?: string;
    channel: string;
    responseCode: string;
  };
}

export type DeviceStatus = "active" | "offline" | "needs_attention";

export interface Device {
  tid: string; // e.g. 'TID-SBX-82931'
  model: string; // e.g. 'Paytm SoundBox 4G Dual Sim Edition'
  category: "SoundBox" | "POS Terminal" | "Dynamic Display";
  status: DeviceStatus;
  paired: boolean;
  pairedPhone: string;
  network: "4G VoLTE" | "Wi-Fi" | "3G Fallback";
  signalStrength: number; // 0 - 100%
  batteryLevel?: number; // 0 - 100%
  lastSeen: string;
  simStatus: "Active - Airtel M2M" | "Active - Jio IoT" | "No Signal";
  firmwareVersion: string;
  volumeLevel: number; // 1 - 10
  audioHeartbeatOk: boolean;
}

export type EscalationPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type EscalationStatus = "OPEN" | "AUTONOMOUS_INVESTIGATION" | "QUEUED_FOR_HUMAN" | "RESOLVED";

export interface Escalation {
  escalationId: string; // e.g. 'ESC-90214', 'ESC-77102'
  customerId: string;
  issue: string;
  priority: EscalationPriority;
  status: EscalationStatus;
  recommendedAction: string;
  createdAt: string;
  updatedAt: string;
  relatedOrderId?: string;
  relatedTid?: string;
  evidenceSummary: {
    transactionTimestamp: string;
    bankSwitchCode: string;
    telemetryStatus: string;
    customerClaims: string;
    detectedAnomaly: string;
  };
  policyId: string; // e.g. 'POL-AUTO-DISPUTE-V2.4'
  policyConfidence: number; // 0.0 - 1.0 (e.g. 0.98)
  humanCan: string[]; // Read-only for customer, e.g. ["Override AI dispute refund limit", "Initiate manual bank recon", "Dispatch field hardware engineer"]
}

export interface AgentTrace {
  intent: string;
  agentsInvolved: string[]; // e.g. ['PaymentDisputeAgent', 'BankReconciliationAgent', 'PolicySafetyGuard']
  decision: string;
  policyId: string;
  confidence: number;
  latencyMs: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: "customer" | "assistant" | "system";
  text: string;
  timestamp: string;
  trace?: AgentTrace;
  contextPills?: {
    type: "order" | "device" | "escalation";
    id: string;
  }[];
}

export interface ChatApiRequest {
  message: string;
  customer_id: string;
  order_id?: string;
  tid?: string;
}

export interface ChatApiResponse {
  reply: string;
  trace?: AgentTrace;
  suggestedActions?: {
    label: string;
    action: string;
    targetId?: string;
  }[];
}
