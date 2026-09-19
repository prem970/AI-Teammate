export type UserRole =
  | "customer"
  | "support"
  | "sales_ops"
  | "policy_owner"
  | "admin";

export interface AdminUser {
  id: string; // e.g. 'USR-001'
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: "active" | "suspended";
  lastLogin: string;
  mfaEnabled: boolean;
}

export type AgentCategory = "Customer Support" | "Sales Ops" | "Core Orchestrator";
export type AgentHealth = "healthy" | "degraded" | "standby" | "offline";

export interface AgentDefinition {
  id: string; // slug e.g. 'orders-accounts-agent'
  name: string; // e.g. 'Orders & Accounts Agent'
  category: AgentCategory;
  purpose: string;
  stageOwnership?: string; // e.g. 'Stage 1: Dispute Ingestion' or 'Sales Stage: Quoting & Negotiation'
  mcpAgentId: string; // e.g. 'agent_orders_v2'
  status: AgentHealth;
  allowedTools: {
    toolName: string;
    description: string;
    actionScope: "READ" | "WRITE" | "AUDIT";
  }[];
  prohibitedTools: {
    toolName: string;
    whyBlocked: string;
  }[];
  n8nWorkflowRef: string;
  requests24h: number;
  avgLatencyMs: number;
  errorRate: number; // percentage e.g. 0.02
  enforcementStory: string;
}

export type TracePhase =
  | "Intent Recognition"
  | "Specialist Delegation"
  | "MCP Tool Execution"
  | "Validation & Policy"
  | "Final Action";

export interface TraceStep {
  stepNumber: number;
  phase: TracePhase;
  agent: string;
  action: string;
  toolName?: string;
  status: "ALLOW" | "DENY" | "SUCCESS" | "WARNING" | "INFO";
  inputSummary: string;
  outputSummary: string;
  durationMs: number;
  details?: Record<string, any>;
}

export interface Trace {
  traceId: string; // e.g. 'TRC-2026-90214'
  timestamp: string;
  customerId: string; // e.g. 'CUST-10291'
  intent: string;
  agentsCalled: string[];
  decision: "auto_resolved" | "escalated_to_human" | "blocked_by_policy";
  latencyMs: number;
  status: "success" | "warning" | "error";
  orderId?: string;
  escalationId?: string;
  steps: TraceStep[];
  rawTraceText: string;
}

export interface MetricPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  percentage?: number;
  change?: string;
}

export interface PlatformKPIs {
  requests24h: number;
  escalationRate: number; // e.g. 0.042 (4.2%)
  avgOrchestratorLatencyMs: number;
  mcpAllowCount24h: number;
  mcpDenyCount24h: number;
  activeAgentsCount: number;
  dailyDisputedVolumeINR: number;
}

export interface IntegrationStatus {
  serviceName: string; // e.g. 'Railway MCP Gateway'
  envKey: string; // e.g. 'MCP_BASE_URL'
  maskedUrl: string;
  category: "Model Context Protocol" | "Workflow Automation" | "Cloud Data Store" | "AI Services";
  status: "configured" | "missing" | "reachable" | "degraded";
  latencyMs?: number;
  lastChecked: string;
  documentationUrl?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string; // e.g. 'Devashish Roy (policy_owner)'
  action: string; // e.g. 'POLICY_INGEST', 'MCP_TOOL_DENY', 'USER_ROLE_CHANGE'
  target: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  details: string;
}
