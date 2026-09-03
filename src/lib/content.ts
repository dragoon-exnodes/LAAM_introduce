/** Page copy, kept in one place so components stay presentational. */

export const NAV_LINKS = [
  { href: "#watch", label: "What it watches" },
  { href: "#surfaces", label: "Surfaces" },
  { href: "#workflows", label: "Workflows" },
  { href: "#evidence", label: "Evidence" },
] as const;

export const PROBLEMS = [
  {
    route: "the blind spot",
    title: "Agents run everywhere, and nobody can see them",
    body: "A dozen Claude Code sessions across four machines. One has been stuck for forty minutes. You find out when someone asks why the branch never landed.",
  },
  {
    route: "the meter",
    title: "Every small question bills a frontier model",
    body: "Summaries, lookups, one-line rewrites — the everyday work that shouldn't need a paid API call, priced like it does. And when the invoice lands, nothing ties it back to a model, a session or a branch.",
  },
  {
    route: "the busywork",
    title: "Cross-app chores stay manual",
    body: "Read the data, summarise it, send the mail, post to Slack, update the ticket. Five tools, every time, by hand.",
  },
] as const;

export type PanelKey =
  | "monitoring"
  | "chat"
  | "voice"
  | "workflow"
  | "connectors"
  | "search"
  | "access";

export type Channel = {
  route: string;
  label: string;
  title: string;
  body: string;
  points: readonly string[];
  panel: PanelKey;
  tone: "signal" | "trace" | "ion";
};

export const CHANNELS: readonly Channel[] = [
  {
    route: "/monitoring",
    label: "Telemetry",
    panel: "monitoring",
    tone: "signal",
    title: "Live agent telemetry",
    body: "Every session from every machine, streaming over SSE. Sub-agent trees, tool-call waterfalls, and an alert the moment a run goes quiet for longer than it should. The dashboard turns the same rows into spend you can attribute — per model, per session, per branch — and exports it as CSV or PDF.",
    points: [
      "Orchestrator → sub-agent graph",
      "Filter by project, model, branch, machine",
      "Configurable stuck-agent threshold",
    ],
  },
  {
    route: "/chat",
    label: "Assistant",
    panel: "chat",
    tone: "trace",
    title: "An assistant that costs nothing to ask",
    body: "A local model answers by default and can reach every tool on this page. Claude and BytePlus are one dropdown away when a question earns them.",
    points: [
      "Vision, PDF/DOCX, OCR (vi/en/zh)",
      "Web search via self-hosted SearXNG",
      "Export to Markdown, JSON, PDF",
    ],
  },
  {
    route: "/constellation",
    label: "Voice",
    panel: "voice",
    tone: "ion",
    title: "Hands-free, on the glass",
    body: "A fullscreen voice console. Streaming neural TTS reads the narrative; tables and charts land on a floating panel instead of being spelled out loud.",
    points: ["Continuous listen → answer → listen loop", "In-place transcript review"],
  },
  {
    route: "/workflows",
    label: "Automation",
    panel: "workflow",
    tone: "signal",
    title: "Durable graph automation",
    body: "Connector, agent, condition, foreach, MCP and custom-agent nodes on one canvas. Runs survive a crash, resume per node, and can be scheduled. Describe the job in chat and the assistant drafts the graph — then dry-runs it against real data and rewrites itself from what came back.",
    points: [
      "Parallel DAG — fan-out, fan-in",
      "AI-drafted graphs, corrected by dry-run",
      "Mid-run cancel, templates, clone",
    ],
  },
  {
    route: "/connectors",
    label: "Connectors",
    panel: "connectors",
    tone: "trace",
    title: "Nine services, plus anything speaking MCP",
    body: "GitHub, Jira, Trello, Drive, Calendar, Gmail, Slack, WhatsApp and Zalo OA — most with one-click authorize. Any external MCP server mounts per user.",
    points: ["Write tools gated, never silent", "Credentials encrypted per user"],
  },
  {
    route: "/search",
    label: "Recall",
    panel: "search",
    tone: "trace",
    title: "Find the run you half-remember",
    body: "One query across sessions, conversations and workflows. Sessions are shared with the team; your conversations and workflows are returned to you alone, as pointers rather than excerpts.",
    points: ["Trigram index — Vietnamese, English, 中文"],
  },
  {
    route: "/settings/access",
    label: "Access",
    panel: "access",
    tone: "signal",
    title: "Access that survives an off-boarding",
    body: "Four roles enforced at the route. Everyone manages their own keys; owners can issue and revoke on someone's behalf, and every issuance is logged.",
    points: ["Per-user credential encryption (HKDF)", "Rate limiting and account lockout"],
  },
] as const;

export const WRITE_GATE_STEPS = [
  { id: "read", label: "Read", note: "Runs unattended" },
  { id: "agent", label: "Agent", note: "Declares its output shape" },
  { id: "gate", label: "Write gate", note: "Confirmation card" },
  { id: "send", label: "Send", note: "Recipient allowlist" },
] as const;

export type Evidence = {
  measure: string;
  before: { value: number; of: number; caption: string };
  after: string;
  title: string;
  body: string;
};

export const EVIDENCE: readonly Evidence[] = [
  {
    measure: "instruction compliance",
    before: { value: 3, of: 15, caption: "static instructions followed" },
    after: "model self-corrects",
    title: "Showing the model beats telling it",
    body: "Written rules in the workflow-builder prompt landed at best three times in fifteen. Dry-running the draft graph against real data and feeding the result back into the conversation let the model fix its own graph from what it had actually seen.",
  },
  {
    measure: "hardcoded values",
    before: { value: 1, of: 1, caption: "real id copied into a saved graph" },
    after: "names only, never values",
    title: "Never trust an LLM to echo your data back",
    body: "While probing tools, the model observed a real query id and pasted it into the saved workflow as a literal — which then broke on the very next run, because that id was only ever valid for that one probe. The probe prompt now shows parameter names and never their values.",
  },
  {
    measure: "voice turns without a lookup",
    before: { value: 3, of: 17, caption: "answers went shallow or invented data" },
    after: "0 of 12 after the fix",
    title: "One prompt line was quietly suppressing lookups",
    body: 'Voice failed 3 of 17 times where the same questions in text failed 0 of 6. "Prioritise brevity" was being read as an instruction to check less, not to say less. Separating how to speak from how much to verify took it to zero.',
  },
] as const;

/**
 * Real numbers from the selection-at-scale run: gpt-oss-120b, temperature 0.6,
 * k=8, against the production tool union — a 60-tool pool including 48 real MCP
 * tools. The failing row is here on purpose; a scoreboard with no zero on it is
 * marketing, not measurement.
 */
export const BENCHMARK = {
  caption: "Tool selection · 60-tool pool · 48 of them real MCP tools · k=8",
  rows: [
    { label: "multi-read-write", score: 100, detail: "8 / 8" },
    { label: "ctx-audit-write", score: 100, detail: "8 / 8" },
    { label: "ctx-web-write", score: 0, detail: "0 / 8 — still failing" },
  ],
  average: 67,
} as const;

// Labels stay short enough to hold one line — a wrapped label drops its value
// out of line with the rest of the row.
export const STATUS_FACTS = [
  { label: "Release", value: "v2.5.0" },
  { label: "Model cost", value: "$0" },
  { label: "Connectors", value: "9 + MCP" },
  { label: "Agent changes", value: "None" },
] as const;
