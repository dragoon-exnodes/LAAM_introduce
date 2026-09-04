/** Page copy, kept in one place so components stay presentational. */

export const NAV_LINKS = [
  { href: "#watch", label: "What it watches" },
  { href: "#surfaces", label: "Surfaces" },
  { href: "#evidence", label: "Evidence" },
] as const;

/**
 * `answeredBy` names the mechanism that actually closes each problem, and it exists
 * because the answer panel used to claim LAAM solved all three "from the transcripts
 * your agents already write to disk". Only the first one comes from the transcripts.
 * Reading a log cannot lower a frontier-model bill or send a Slack message — those
 * are the assistant and the automation, two different surfaces. The hero already
 * separated them correctly; the panel was the outlier, and naming the mechanism per
 * row is what stops the claim from quietly collapsing back into one.
 */
export const PROBLEMS = [
  {
    route: "the blind spot",
    title: "Agents run everywhere, and nobody can see them",
    body: "A dozen Claude Code sessions across four machines. One has been stuck for forty minutes. You find out when someone asks why the branch never landed.",
    answeredBy: "The transcript reader",
  },
  {
    route: "the meter",
    title: "Every small question bills a frontier model",
    body: "Summaries, lookups, one-line rewrites — the everyday work that shouldn't need a paid API call, priced like it does. And when the invoice lands, nothing ties it back to a model, a session or a branch.",
    answeredBy: "The assistant, and cost attribution",
  },
  {
    route: "the busywork",
    title: "Cross-app chores stay manual",
    body: "Read the data, summarise it, send the mail, post to Slack, update the ticket. Five tools, every time, by hand.",
    answeredBy: "Workflow automation",
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
    // Three corrections against the shipped code, all in the direction of claiming
    // less: sub-agents render as a flat list with no parent/child edges (not a
    // tree); nothing polls, so a quiet run is flagged on the next update rather
    // than "the moment" it goes quiet; and there is no cost-by-project figure at
    // all — that widget charts tokens, because the stat carries no cost field.
    body: "Every session from every machine, streaming over SSE. Orchestrator-to-sub-agent breakdowns, tool-call waterfalls, and a stuck-run flag that fires as soon as the next update lands.",
    points: [
      "Orchestrator → sub-agent breakdown",
      "Filter by project, model, branch, machine",
      "Configurable stuck-agent threshold",
      "Cost by model and by day, with per-project token usage",
      "Slowest tools and highest error rates, surfaced automatically",
    ],
  },
  {
    route: "/chat",
    label: "Assistant",
    panel: "chat",
    tone: "trace",
    title: "An assistant you can run for nothing",
    /*
     * This used to read "A local model answers by default", which the shipped
     * code contradicts: `defaultChatModel()` is cloud-first — a BytePlus key
     * outranks DEFAULT_CHAT_MODEL, and 2.5.0 is titled "Cloud-first internal
     * model". The free local path is real and still reaches every tool, but it
     * is what you get when you run WITHOUT a cloud key, not what you get by
     * default. Stated as a condition the claim is true of every deployment,
     * which is the only version that survives someone opening /chat on ours.
     *
     * Claude is dropped from the sentence rather than corrected: it is fully
     * implemented but env-gated, and with no ANTHROPIC_API_KEY set the picker
     * renders no Claude group at all.
     */
    body: "Run it against a local model and every answer is free — it still reaches every tool on this page. Add a BytePlus key and the same assistant, with the same tools, answers on a hosted model instead.",
    points: [
      "Vision, PDF/DOCX, OCR (vi/en/zh)",
      "Web search via self-hosted SearXNG",
      "Geocoding, weather and nearby-place lookups",
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
    points: [
      "Continuous listen → answer → listen loop",
      "In-place transcript review",
    ],
  },
  {
    route: "/workflows",
    label: "Automation",
    panel: "workflow",
    tone: "signal",
    title: "Durable graph automation",
    /*
     * Two corrections. There are FIVE node kinds, not six — `custom-agent` is a
     * preset field on the agent node ("Deliberately NOT a new WfNodeKind", says
     * types.ts), and the presets bullet below already describes it, so listing it
     * as a kind double-counted one feature. And the graph does not rewrite
     * itself: a failed dry-run is logged, and the digest reaches the model on the
     * author's next turn — the loop is real but human-triggered.
     */
    body: "Connector, agent, condition, foreach and MCP nodes on one canvas. Runs survive a crash, resume per node, and can be scheduled. Describe the job in chat and the assistant drafts the graph — then dry-runs it against real data and feeds the result back so the model can correct its own graph.",
    points: [
      "Parallel DAG — fan-out, fan-in",
      "AI-drafted graphs, corrected by dry-run",
      // Was "Every write pauses on a confirmation card, bound to a recipient
      // allowlist" — three errors in one line: the card is a chat mechanism,
      // workflow runs fail closed rather than prompting, and a write with no
      // recipient field never reaches the allowlist check at all. Naming the
      // three moments separately is both true and a stronger promise than the
      // single vague one it replaces.
      "Writes never fire while the assistant drafts — they become nodes",
      "In chat, every write stops on a confirmation card",
      "At run time writes are fail-closed; messaging is bound to a recipient allowlist",
      "Custom-agent presets, saved once and reused across every graph",
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
    points: [
      "Write tools gated, never silent",
      "Credentials encrypted per user",
    ],
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
    points: [
      "Per-user credential encryption (HKDF)",
      "Rate limiting and account lockout",
    ],
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
    // Was "model now self-corrects". The changelog is explicit that the fix was
    // confirmed by one end-to-end run — "một lần thử, không phải bảo đảm thống
    // kê" — so pairing it with a hard 3/15 implied an after-rate that was never
    // measured. Naming it as a single verification is the honest asymmetry.
    after: "verified once end-to-end",
    title: "Showing the model beats telling it — and we can prove which",
    body: "Written rules in the workflow-builder prompt landed at best three times in fifteen. Dry-running the draft graph against real data and feeding the result back into the conversation let the model fix its own graph from what it had actually seen — confirmed once, all the way through, against real data rather than a fixture.",
  },
  {
    measure: "hardcoded values",
    before: { value: 1, of: 1, caption: "real id copied into a saved graph" },
    /*
     * The absolute rule — "names only, never values" — was true when written and
     * was deliberately narrowed on 2026-08-19: hiding every value left the probe
     * sheet unable to tell four different metric queries apart, so free text,
     * numbers and booleans are printed again and only ids and UUIDs are withheld.
     * Reporting the first measurement and not the second, on a card about a rule
     * learned the hard way, was the one thing this card could not afford to do.
     * The second correction is also the better story: the fix that was too broad
     * got measured too, and lost.
     */
    after: "ids withheld, not everything",
    title: "A rule the industry keeps learning the hard way — twice",
    body: "While probing tools, the model observed a real query id and pasted it into the saved workflow as a literal, which broke on the very next run: that id was only ever valid for that one probe. Hiding every value fixed it and broke something else — the sheet could no longer tell four similar queries apart. So the probe now withholds exactly what goes stale, ids and UUIDs, and still prints the arguments that distinguish one call from another.",
  },
  {
    measure: "voice turns without a lookup",
    before: { value: 3, of: 17, caption: "before the prompt was separated" },
    after: "0 of 12 after the fix",
    title: "Found a one-line prompt bug by measuring, not guessing",
    body: 'Voice failed 3 of 17 times where the same questions in text failed 0 of 6. "Prioritise brevity" was being read as an instruction to check less, not to say less. Separating how to speak from how much to verify took it to zero.',
  },
] as const;

/**
 * Real numbers from the selection-at-scale run: gpt-oss-120b, temperature 0.6,
 * k=8, on 2026-08-03. The failing row is here on purpose; a scoreboard with no
 * zero on it is marketing, not measurement.
 *
 * Two things were wrong with how this used to be presented, and both cut against
 * the section's own argument.
 *
 * The caption said "48 of them real MCP tools". It isn't: `padToN` fills the
 * 60-tool union in POOL order — internal, then connector, then MCP — and 12
 * internal + 42 connector tools already exceed the 58 distractor slots, so only
 * about six MCP tools ever reach the model. The 48 is the size of the MCP
 * *distractor pool*, not of what was measured. (The suite's own comment, "60 = 12
 * internal + 48 MCP", is arithmetically impossible for the same reason — a
 * harness bug that had leaked into marketing copy.) Fixing `padToN` to sample
 * across the pool, then re-running, is the only way to earn the original claim.
 *
 * And the run was dated in the code but not on the page, while the rows spoke in
 * the present tense — "still failing" asserts a live state for a measurement that
 * is a month and several hundred commits old. The behaviour suite below dates
 * itself; this one now does too, and says as-of rather than still.
 */
export const BENCHMARK = {
  caption:
    "Tool selection · 60-tool union from a 102-tool pool (12 internal · 42 connector · 48 MCP) · k=8 · 2026-08-03",
  rows: [
    { label: "multi-read-write", score: 100, detail: "8 / 8" },
    { label: "ctx-audit-write", score: 100, detail: "8 / 8" },
    { label: "ctx-web-write", score: 0, detail: "0 / 8 — as of this run" },
  ],
  average: 67,
} as const;

/**
 * The behaviour suite (`npm run eval`), a different measurement from BENCHMARK
 * above: 17 scenarios replayed five times each — 85 runs — against the same
 * agent loop production uses, scored per dimension rather than pass/fail.
 * gpt-oss-120b, 2026-09-03.
 *
 * Grounding is the low number and it stays on the page. It is the honest one:
 * it asks whether the answer actually cites the value the tool returned, which
 * is the hardest thing to get right and the thing worth being measured on.
 */
export const RELIABILITY = {
  caption:
    "Behaviour suite · 17 scenarios × 5 runs · gpt-oss-120b · 2026-09-03",
  rows: [
    {
      label: "restraint",
      score: 100,
      note: "no tool call when none is needed",
    },
    { label: "write-intent", score: 100, note: "every write reaches the gate" },
    {
      label: "rich-block",
      score: 100,
      note: "maps and charts render as blocks",
    },
    { label: "args", score: 97, note: "arguments match the tool's schema" },
    {
      label: "termination",
      score: 90,
      note: "loop stops inside its round budget",
    },
    { label: "tool-selection", score: 86, note: "reaches for the right tool" },
    {
      label: "grounding",
      score: 67,
      note: "answer cites what the tool returned",
    },
  ],
} as const;

// Labels stay short enough to hold one line — a wrapped label drops its value
// out of line with the rest of the row.
export const STATUS_FACTS = [
  { label: "Release", value: "v2.5.0" },
  { label: "Local model cost", value: "$0" },
  { label: "Connectors", value: "9 + MCP" },
  { label: "Agent changes", value: "None" },
] as const;
