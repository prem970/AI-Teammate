# Autonomous AI OS — Enterprise Customer & Ops Portal

Production-quality Next.js 14+ (App Router), TypeScript, and Tailwind CSS web application for an **Autonomous AI OS** handling sales and customer support for SoundBox, Smart POS, and Payment Gateway API merchants.

The codebase provides two dedicated portals:
1. **Customer / Merchant Portal**: Self-serve operations for merchants (terminals, disputes, settlements, AI chat with reasoning traces).
2. **Employee / Ops Portal**: Internal command console for company staff (Support Ops, Sales Ops, Policy Owners) providing Human-in-the-Loop decisioning, Model Context Protocol (MCP) packages, policy RAG ingestion, and multi-agent sales pipeline tracking.

---

## 🚀 Portals & Routes Overview

### 1. Customer / Merchant Portal
- **/login/customer**: Merchant sign-in with 1-click presets (`CUST-10291` Rajesh Retail, `CUST-20442` Sharma Digital).
- **/customer**: Home dashboard with live autonomous pulse, active escalation warning, and product cards.
- **/customer/chat**: Full-page support chat calling server-side `POST /api/chat`, with expandable **Autonomous Orchestration Trace** (Intent, Subagents, Decision, Policy Confidence).
- **/customer/orders**: Transaction ledger with spotlight banner for disputed transaction `ORD-DUP-1001`.
- **/customer/devices**: Telemetry panel for SoundBox 4G and POS terminals with live OTA Acoustic Diagnostic Ping.
- **/customer/escalations** & **/customer/escalations/[id]**: Escalation packages with multi-agent evidence and read-only human oversight status.
- **/customer/account**: Read-only merchant profile with MID, segment, and preferred channel settings.

### 2. Employee / Ops Portal
- **/login/ops**: Internal staff authentication with 1-click role presets for **Support Ops**, **Sales Ops**, and **Policy Owner**.
- **/ops**: Operational command home with open escalations, pending policy uploads, and sales handoffs.
- **/ops/escalations**: Cosmos-like Escalation Queue table with P1-P4 priority filtering and status filters.
- **/ops/escalations/[id]**: Full package UI matching MCP `escalation_create` with:
  - Evidence JSON Viewer with syntax highlighting and raw payload copy.
  - Applicable policy clause with text snippet.
  - Banner: *"MCP Safety Standard: MCP does not auto-refund; human decision required."*
  - Interactive decision execution (`approve`, `reject`, `modify`, `take_over`, `resolve`, `return_to_agent`) calling `PATCH /api/escalations/[id]`.
- **/ops/customers/[customerId]**: Long-term customer memory drill-in, risk score, 30-day dispute history, and provisioned hardware fleet.
- **/ops/policies**: Active compliance policies directory with banner *"Autonomous Precedence Principle: Current policy beats historical cases."*
- **/ops/policies/upload**: Policy RAG ingestion form submitting to `POST /api/policies/ingest` and forwarding to `N8N_RAG_INGEST_URL`.
- **/ops/sales/pipeline**: Multi-Agent Sales Pipeline Kanban board across 6 stages (`Outreach`, `Follow-ups`, `Quoting`, `Negotiation`, `Onboarding`, `Closed-Won`) with strict stage ownership (`Agent1`, `Agent2`, `Agent3` — no stage skipping).
- **/ops/sales/leads/[id]**: Granular stage logs showing agent actions, reasoning audits, and next sequential handoffs.
- **/ops/assistant**: Internal policy knowledge assistant with system safety notice and prompt execution.
- **/ops/knowledge**: Overview of vector collections and indexed documents.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.6 (Strict data models)
- **Styling**: Tailwind CSS with custom cyber-slate fintech theme (`#06080F`) and tactical ops console palette (`#0B0E14`).
- **Typography**: Google Fonts — **Space Grotesk** (display headings), **Plus Jakarta Sans** (body text), and **JetBrains Mono** (telemetry, MIDs, JSON).
- **Icons**: Lucide React
- **Sessions & Route Protection**: Edge `src/middleware.ts` guarding `/customer/*` via `ai_os_customer_session` and `/ops/*` via `ai_os_ops_session`.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# Public Brand Name
NEXT_PUBLIC_APP_NAME="Autonomous AI OS"

# Server-Side n8n Customer Support Orchestrator Webhook URL (Optional)
# If empty, uses high-fidelity typed simulator with full agent traces
N8N_CS_ORCHESTRATOR_URL=""

# Server-Side n8n RAG Policy Ingestion Webhook URL (Optional)
# If empty, uses high-fidelity RAG vector embedding simulator
N8N_RAG_INGEST_URL=""

# Server-Side n8n Sales Multi-Agent Orchestrator Webhook URL (Optional)
N8N_SALES_ORCHESTRATOR_URL=""

# Optional Azure Cosmos DB / Backend API URL
AZURE_COSMOS_ENDPOINT=""
AZURE_COSMOS_KEY=""
AZURE_COSMOS_DATABASE="paytm_merchant_support"
BACKEND_API_URL=""
```

> **Security Note:** All webhook URLs and Cosmos secrets are strictly consumed on the server side (`src/app/api/*`) and are never leaked to client bundles.

---

## 💻 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open:
- Customer Portal: [http://localhost:3000/login/customer](http://localhost:3000/login/customer)
- Operations Console: [http://localhost:3000/login/ops](http://localhost:3000/login/ops)

### 3. Build & Run Production Bundle
```bash
npm run build
npm run start
```

---

## 🧪 Testing Personas & Demo Credentials

### Merchant / Customer Roles
- **Merchant 1**: `rajesh.retail@merchants.paytm.mock` (`CUST-10291` — SoundBox 4G, disputed order `ORD-DUP-1001`)
- **Merchant 2**: `anita.sharma@digitalmart.mock` (`CUST-20442` — Smart POS & API)
- **Password**: Any string or click the 1-click pre-fill cards on `/login/customer`.

### Employee / Ops Staff Roles
- **Support Ops**: `support.agent@company.mock` (Vikram Mehta, Badge: `OPS-9921` — P1-P4 escalation decisioning)
- **Sales Ops**: `sales.ops@company.mock` (Priya Iyer, Badge: `REV-4481` — multi-agent pipeline handoffs)
- **Policy Owner**: `policy.owner@company.mock` (Devashish Roy, Badge: `POL-7712` — RAG vector ingest)
- **Password**: Any string or click the role selector cards on `/login/ops`. (Also switchable in 1-click via the top navigation bar dropdown).
