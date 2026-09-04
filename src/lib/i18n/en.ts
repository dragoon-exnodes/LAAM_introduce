/**
 * The page in English — the default, and the shape every other locale is checked
 * against (`vi.ts` is typed as `typeof en`, so a missing or renamed key is a build
 * error rather than a blank spot someone finds in production).
 *
 * What is NOT in here is as deliberate as what is. Routes (`/monitoring`), tool
 * names (`kg_query_datasource`), model names (`gpt-oss-120b`), session and machine
 * ids, connector names, workflow node kinds and the product's own status words
 * (`running`, `idle`, `stuck`) stay in English in every locale. They are what the
 * product literally shows on screen; translating them would depict a product that
 * does not exist. The site speaks the visitor's language, the screenshots show the
 * product as it is.
 *
 * `lead` is split into `ink` and `rest` because the page sets the claim at full
 * contrast and the elaboration one step down — a distinction the translation has
 * to be able to place differently, since the claim does not always land in the
 * same clause in another language.
 */
export const en = {
  meta: {
    title: "LAAM — Every agent, every machine, in plain sight",
    description:
      "LAAM monitors the AI agents already running on your team's machines, and adds an assistant and durable workflow automation on the same screen — run it on a local model and it adds $0 of model spend.",
  },

  langToggle: { label: "Tiếng Việt", aria: "Xem trang bằng tiếng Việt" },

  nav: {
    links: [
      { href: "#watch", label: "What it watches" },
      { href: "#surfaces", label: "Surfaces" },
      { href: "#evidence", label: "Evidence" },
      { href: "#status", label: "Where it stands" },
    ],
    cta: "Book a walkthrough",
  },

  boot: {
    calibrating: "calibrating measurement grid",
    mounting: "mounting transcript reader",
    hosts: (n: number) => `resolving machines · ${n} hosts`,
    channels: (n: number) => `telemetry channels ${n}/${n} online`,
  },

  hero: {
    eyebrows: ["Local-first", "$0 on a local model", "Zero instrumentation"],
    headline: ["Every agent.", "Every machine.", "In plain sight."],
    lead: {
      ink: "LAAM reads the transcripts your Claude Code agents already write.",
      rest: "No SDK changes, no wrappers, nothing to change in your agents — one zero-dependency script per machine ships them over. Then it puts an assistant and durable workflow automation on the same screen.",
    },
    actions: { primary: "Book a walkthrough", secondary: "See what it watches" },
    scopeCaption: "Assistant map — every surface on one core",
  },

  problem: {
    eyebrow: "Why teams reach for it",
    heading: "What breaks when agents outnumber operators",
    items: [
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
    ],
    answer: {
      eyebrow: "The answer",
      ink: "Three problems, three answers, one screen.",
      rest: "The blind spot closes from the transcripts your agents already write to disk — point it at a machine and it starts reporting, with nothing to add on the agent side. The other two are answered by what sits beside that readout: an assistant you can ask without starting a frontier model's meter, and automation that runs the five-tool chore once.",
    },
  },

  channels: {
    eyebrow: "The platform",
    heading: "Seven channels, one console",
    lead: "Every readout below is a surface people open daily — shipped, not roadmap. The data in them is invented; real sessions belong to whoever is signed in.",
    items: [
      {
        title: "The stuck one finds you",
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
        title: "An assistant you can run for nothing",
        body: "Run it against a local model and every answer is free — it still reaches every tool on this page. Add a BytePlus key and the same assistant, with the same tools, answers on a hosted model instead.",
        points: [
          "Vision, PDF/DOCX, OCR (vi/en/zh)",
          "Web search via self-hosted SearXNG",
          "Geocoding, weather and nearby-place lookups",
          "Export to Markdown, JSON, PDF",
        ],
      },
      {
        title: "Hands-free, on the glass",
        body: "A fullscreen voice console. Streaming neural TTS reads the narrative; tables and charts land on a floating panel instead of being spelled out loud.",
        points: [
          "Continuous listen → answer → listen loop",
          "In-place transcript review",
          "Speech-to-text is the browser's today, so voice needs Chrome",
        ],
      },
      {
        title: "Nothing irreversible happens without you",
        body: "Connector, agent, condition, foreach and MCP nodes on one canvas. Runs survive a crash, resume per node, and can be scheduled. Describe the job in chat and the assistant drafts the graph — then dry-runs it against real data and feeds the result back so the model can correct its own graph.",
        points: [
          "Parallel DAG — fan-out, fan-in",
          "Writes never fire while the assistant drafts — they become nodes",
          "Confirmed in chat, fail-closed in a run, sends allowlisted",
          "Custom-agent presets, saved once and reused across every graph",
          "Mid-run cancel, templates, clone",
        ],
      },
      {
        title: "Nine services, plus anything speaking MCP",
        body: "GitHub, Jira, Trello, Drive, Calendar, Gmail, Slack, WhatsApp and Zalo OA — most with one-click authorize. Any external MCP server mounts per user.",
        points: ["Write tools gated, never silent", "Credentials encrypted per user"],
      },
      {
        title: "Find the run you half-remember",
        body: "One query across sessions, conversations and workflows. Sessions are shared with the team; your conversations and workflows are returned to you alone, as pointers rather than excerpts.",
        points: ["Trigram index — Vietnamese, English, 中文"],
      },
      {
        title: "Access that survives an off-boarding",
        body: "Four roles enforced at the route. Everyone manages their own keys; owners can issue and revoke on someone's behalf, and every issuance is logged.",
        points: ["Per-user credential encryption (HKDF)", "Rate limiting and account lockout"],
      },
    ],
  },

  evidence: {
    eyebrow: "Measured, not asserted",
    heading: "Reasoning would have missed all three",
    lead: {
      ink: "Each was caught by running the product against a real database rather than reasoning about it.",
      rest: "Root-caused, fixed, and then re-measured — that loop is the reason to trust anything else on this page.",
    },
    cards: [
      {
        measure: "instruction compliance",
        caption: "static instructions followed",
        after: "verified once end-to-end",
        title: "Showing the model beats telling it — and we can prove which",
        body: "Written rules in the workflow-builder prompt landed at best three times in fifteen. Dry-running the draft graph against real data and feeding the result back into the conversation let the model fix its own graph from what it had actually seen — confirmed once, all the way through, against real data rather than a fixture.",
      },
      {
        measure: "hardcoded values",
        caption: "real id copied into a saved graph",
        after: "ids withheld, not everything",
        title: "A rule the industry keeps learning the hard way — twice",
        body: "While probing tools, the model observed a real query id and pasted it into the saved workflow as a literal, which broke on the very next run: that id was only ever valid for that one probe. Hiding every value fixed it and broke something else — the sheet could no longer tell four similar queries apart. So the probe now withholds exactly what goes stale, ids and UUIDs, and still prints the arguments that distinguish one call from another.",
      },
      {
        measure: "voice turns without a lookup",
        caption: "before the prompt was separated",
        after: "0 of 12 after the fix",
        title: "Found a one-line prompt bug by measuring, not guessing",
        body: 'Voice failed 3 of 17 times where the same questions in text failed 0 of 6. "Prioritise brevity" was being read as an instruction to check less, not to say less. Separating how to speak from how much to verify took it to zero.',
      },
    ],
    measurement: {
      eyebrow: "How it is measured",
      note: "Re-run against every release",
      suites: [
        {
          name: "Behaviour suite",
          scale: "17 scenarios × 5 runs",
          body: "Every scenario replayed five times and scored per dimension rather than pass/fail, so a run that reaches the right answer the wrong way still shows up.",
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
      ],
      footer: {
        ink: "The scores themselves are part of the walkthrough.",
        rest: "They are dated runs against a named model, weak rows included — which is a conversation worth having with someone in the room, and a poor thing to leave on a page as a number without its reasons.",
      },
    },
  },

  status: {
    eyebrow: "Where it stands",
    heading: "An internal tool, in daily use",
    lead: {
      ink: "LAAM was built for our own engineers and it runs on our own machines.",
      rest: "It is not a hosted product and we are not pretending otherwise — what we can show you is a working system, the decisions behind it, and what it would take to stand one up for your team.",
    },
    facts: [
      { label: "Release", value: "v2.5.0" },
      { label: "Local model cost", value: "$0" },
      { label: "Connectors", value: "9 + MCP" },
      { label: "Agent changes", value: "None" },
    ],
    nextLabel: "Next",
    ahead: [
      "Audit coverage beyond writes, token grants and user/role changes",
      "Vision on the cloud model path, not just the local one",
      "Self-hosted speech-to-text, so voice stops needing Chrome",
    ],
  },

  contact: {
    eyebrow: "Talk to the team that built it",
    heading: "We'll show you the live console",
    lead: {
      ink: "Forty minutes, real sessions, real workflows",
      rest: "— including the parts still on the roadmap. Bring the questions you'd ask before running something like this yourself.",
    },
    primary: "Book a walkthrough",
    secondary: "Back to the top",
    mailSubject: "LAAM walkthrough",
  },

  footer: { wordmark: "LAAM — Local AI Agent Monitoring", org: "Internal platform" },

  skipToContent: "Skip to content",
};
