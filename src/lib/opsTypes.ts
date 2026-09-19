export type EmployeeRole = "support" | "sales_ops" | "policy_owner";

export interface EmployeeUser {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  department: string;
  badgeId: string;
}

export type PriorityLevel = "P1" | "P2" | "P3" | "P4";
export type EscalationState = "open" | "in_review" | "resolved" | "returned";

export type HumanActionType =
  | "approve"
  | "reject"
  | "modify"
  | "take_over"
  | "resolve"
  | "return_to_agent";

export interface ApplicablePolicy {
  id: string; // e.g. "PAYMENT-DUPLICATE-V2"
  name: string;
  version: string;
  clause: string;
  textSnippet: string;
  linkUrl?: string;
}

export interface EscalationEvidence {
  orderId: string;
  amount: number;
  currency: string;
  timestamp: string;
  bankSwitchCode: string;
  terminalId?: string;
  telemetryStatus: string;
  txns: {
    txnId: string;
    gatewayRef: string;
    utr: string;
    status: string;
    amount: number;
    channel: string;
  }[];
  merchantMemory: {
    disputeCount30d: number;
    settlementRiskScore: number;
    segment: string;
  };
  anomalyDetails: {
    suspectedCause: string;
    npciLatencyMs: number;
    dualDebitConfirmed: boolean;
  };
}

export interface EscalationPackage {
  escalationId: string; // e.g. "ESC-90214"
  customerId: string; // e.g. "CUST-10291"
  orderId: string; // e.g. "ORD-DUP-1001"
  workflowId: string; // e.g. "WF-NPCI-DUAL-DEBIT-77"
  priority: PriorityLevel;
  status: EscalationState;
  policyId: string; // e.g. "PAYMENT-DUPLICATE-V2"
  issue: string;
  evidence: EscalationEvidence;
  applicablePolicy: ApplicablePolicy;
  agentConclusion: string;
  recommendedAction: string;
  humanCan: HumanActionType[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolutionDecision?: {
    action: HumanActionType;
    decidedBy: string;
    decidedAt: string;
    notes: string;
    refundAmount?: number;
  };
}

export interface PolicyRecord {
  policyId: string; // e.g. "PAYMENT-DUPLICATE-V2", "POL-SBX-001"
  version: string;
  title: string;
  product: "SoundBox" | "Smart POS" | "Payment Gateway" | "Core Settlement";
  status: "active" | "deprecated" | "draft";
  effectiveDate: string;
  category: "Dispute & Refunds" | "Hardware Telemetry" | "Settlement Reversal" | "Merchant Risk";
  scope: string;
  ruleSummary: string;
  markdownContent?: string;
  lastIngestedAt: string;
  ingestedBy: string;
}

export type SalesStage =
  | "Outreach"
  | "Follow-ups"
  | "Quoting"
  | "Negotiation"
  | "Onboarding"
  | "Closed-Won";

export type SalesAgentId =
  | "Agent1-Outreach"
  | "Agent2-QuoteNegotiate"
  | "Agent3-Onboarding";

export interface StageLog {
  id: string;
  timestamp: string;
  stage: SalesStage;
  agentId: SalesAgentId | "Human-SalesOps";
  actionTaken: string;
  reasoning: string;
  nextStep: string;
}

export interface Lead {
  id: string; // e.g. "LEAD-401"
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  currentStage: SalesStage;
  assignedAgent: SalesAgentId;
  dealValue: number; // in INR
  productPitch: "Paytm SoundBox 4G Dual Sim" | "All-in-One Linux POS" | "Payment Gateway Enterprise";
  hardwareCount: number;
  createdAt: string;
  updatedAt: string;
  stageLogs: StageLog[];
}

export interface PolicyIngestRequest {
  source: string;
  policy_id: string;
  policy_version: string;
  product_id: string;
  category: string;
  doc_type: "markdown" | "text";
  content: string;
}
