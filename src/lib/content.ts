/** Page copy, kept in one place so components stay presentational. */

export const NAV_LINKS = [
  { href: "#watch", label: "What it watches" },
  { href: "#surfaces", label: "Surfaces" },
  { href: "#evidence", label: "Evidence" },
  // Status was the one section with no way to reach it: it holds the release,
  // the honest limitations and what is still open — the page a sceptical reader
  // goes looking for, and the one they had to scroll the whole page to find.
  { href: "#status", label: "Where it stands" },
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
    // "Live agent telemetry" was a category label sitting on the most important
    // tab on the page, while the tabs around it earned their titles ("Find the run
    // you half-remember", "Access that survives an off-boarding"). The section
    // above already wrote the better line by describing its absence — "You find
    // out when someone asks why the branch never landed" — so this is that
    // sentence turned the right way round.
    title: "The stuck one finds you",
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
      // The Chrome dependency was disclosed only in the roadmap, three sections
      // further down, while "Hands-free" and "Continuous listen" read here as
      // though it runs anywhere. Someone evaluating the voice console should
      // learn its one hard constraint in the voice console's own copy.
      "Speech-to-text is the browser's today, so voice needs Chrome",
    ],
  },
  {
    route: "/workflows",
    label: "Automation",
    panel: "workflow",
    tone: "signal",
    // Recovered from the standalone Workflows section that was folded into this
    // tab. The merge kept every fact and dropped the argument: "Durable graph
    // automation" is a category any tool can claim, while this sentence answers
    // the first objection anyone has to handing an AI write access to their Gmail
    // and their tickets. The three bullets below are what makes it true.
    title: "Nothing irreversible happens without you",
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
      // "AI-drafted graphs, corrected by dry-run" lived here until the tab ran
      // 15px past the console's fixed height. It was the right bullet to lose:
      // the body sentence above already tells that story end to end — drafts the
      // graph, dry-runs it against real data, feeds the result back — so the
      // bullet was the same claim a second time, in less detail.
      // Was "Every write pauses on a confirmation card, bound to a recipient
      // allowlist" — three errors in one line: the card is a chat mechanism,
      // workflow runs fail closed rather than prompting, and a write with no
      // recipient field never reaches the allowlist check at all.
      //
      // Naming the three moments separately fixed the claim but cost three
      // bullets and a wrap — eight lines where the panel budgets six, which
      // stretched this tab's column past the sticky console's fixed height and
      // pushed it over the progress row below. Two lines carry the same three
      // facts: drafting never fires, chat confirms, a run fails closed.
      "Writes never fire while the assistant drafts — they become nodes",
      "Confirmed in chat, fail-closed in a run, sends allowlisted",
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
 * What the measurement IS, not what it scored.
 *
 * Both suites used to publish their grades here — the tool-selection scoreboard
 * with a failing row, and the seven behaviour dimensions including a 67%. Those
 * numbers are real and they are traceable to dated runs in the LAAM repo, and
 * publishing them was a deliberate position: in a category where every claim is
 * noise, a claim that costs something to make is the only one that carries.
 *
 * The position was right about the reader it imagined and wrong about the reader
 * it gets. A page whose CTA books a forty-minute walkthrough has to survive
 * everyone in a buying committee, including the people who never reach the
 * paragraph explaining why a strict 67% is a good number — they see a red 67 and
 * the evaluation ends before it reaches anyone able to read it. And the detail
 * loses nothing by moving: the walkthrough is a room with a person in it, which
 * is exactly where a number needs context.
 *
 * What stays is the part the industry does publish and competitors mostly cannot
 * match — the rigour itself, and the post-mortems above. Every fact below is a
 * count, not a grade.
 */
export const MEASUREMENT = [
  {
    name: "Behaviour suite",
    scale: "17 scenarios × 5 runs",
    body: "Every scenario replayed five times and scored per dimension rather than pass/fail, so a run that reaches the right answer the wrong way still shows up.",
    // `tags` is what each suite is BUILT from — the seven scored dimensions on one
    // side, the three pools the union is drawn from on the other. Both panels
    // carry a row so the pair reads as one composition rather than one filled
    // block beside a half-empty one; the right panel's pool was a clause inside
    // its own sentence, which left it 150px shorter than its neighbour.
    tags: [
      "tool selection",
      "arguments",
      "grounding",
      "restraint",
      "termination",
      "write intent",
      "rich blocks",
    ],
  },
  {
    name: "Tool selection at scale",
    scale: "60-tool union · k=8",
    body: "Each probe is answered against a union drawn from the full production pool, because picking the right tool out of six proves nothing about picking it out of sixty.",
    tags: ["12 internal", "42 connector", "48 MCP"],
  },
] as const;

// Labels stay short enough to hold one line — a wrapped label drops its value
// out of line with the rest of the row.
export const STATUS_FACTS = [
  { label: "Release", value: "v2.5.0" },
  { label: "Local model cost", value: "$0" },
  { label: "Connectors", value: "9 + MCP" },
  { label: "Agent changes", value: "None" },
] as const;
