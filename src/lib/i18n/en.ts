/**
 * The page in English — the default, and the shape every other locale is checked
 * against (`vi.ts` is typed as `typeof en`, so a missing or renamed key is a build
 * error rather than a blank spot someone finds in production).
 *
 * What is NOT in here is as deliberate as what is. Routes (`/monitoring`), tool
 * names (`mcp__pos__query_datasource`), model names (`gpt-oss-120b`), session and machine
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
    title: "LAAM — Your company's systems, now they answer back",
    description:
      "Ask your own data a question the way you'd ask a colleague — no SQL, no report request, no waiting. LAAM looks the figures up, answers, and carries out the multi-step work that follows. It runs on your machines; on a local model, no question is metered.",
  },

  langToggle: { label: "Tiếng Việt", aria: "Xem trang bằng tiếng Việt" },

  nav: {
    links: [
      { href: "#why", label: "Why teams use it" },
      { href: "#surfaces", label: "Surfaces" },
      { href: "#evidence", label: "Evidence" },
      { href: "#status", label: "Where it stands" },
    ],
    cta: "Book a walkthrough",
  },

  boot: {
    calibrating: "bringing the console online",
    mounting: "opening the assistant",
    /** Distinct sources named by the hero's own inquiry set — currently five. */
    sources: (n: number) => `connecting sources · ${n} connected`,
    channels: (n: number) => `surfaces ${n}/${n} ready`,
  },

  hero: {
    eyebrows: ["Runs on your machines", "No per-question metering", "Ask in your own language"],
    // Split for BALANCE, not for grammar. Each entry is its own overflow-hidden
    // line that the intro animation slides up, so an entry that wraps becomes two
    // moving lines and the whole hero grows: "Your company's systems." wrapped to
    // three at desktop width and pushed the ribbon off the bottom of the screen.
    // Three short entries render as exactly three lines at every width. Measured,
    // because guessing was wrong twice: "Your company's systems." wrapped to three
    // and "Your company's" still wrapped to two. The column holds roughly the width
    // of "COMPANY'S DATA." and no more, so `company's` had to go — `your` carries
    // the possessive on its own.
    headline: ["Your systems.", "Now they", "answer back."],
    lead: {
      ink: "Ask it the way you'd ask a colleague — no table names, no column names, no SQL.",
      rest: "It reaches your databases, your documents and the systems you already run — a point-of-sale, a booking system, an internal service — looks up the real figures, and carries out the work that follows. When a question could mean two things it asks you back rather than guessing. It runs on your own machines — your data stays there.",
    },
    actions: { primary: "Book a walkthrough", secondary: "See how it answers" },
    scopeCaption: "Assistant map · illustrative data",
    /** Narrates the same idle → thinking → speaking turn the constellation plays. */
    phases: { idle: "ready", thinking: "looking it up", speaking: "answering" },
    lookupLabel: "lookups",
    sourceLabel: "source",
    costLabel: "cost",
  },

  /**
   * The ribbon under the hero. Questions from six different lines of business,
   * because the claim is that the assistant holds no assumptions about the trade
   * — and a list is a better argument for that than a sentence.
   */
  inquiries: {
    states: { answered: "answered", clarified: "asked back", held: "awaiting confirm" },
    stepsSuffix: "lookups",
    items: [
      { domain: "retail", question: "Which store's revenue fell the most this month?" },
      { domain: "logistics", question: "How many deliveries are past due and still open?" },
      { domain: "people", question: "Who worked the most overtime this quarter?" },
      { domain: "pharmacy", question: "Which employee refunds the most?" },
      { domain: "contracts", question: "What notice period did we agree with this supplier?" },
      { domain: "bookings", question: "Rebook yesterday's two no-shows and message the customers." },
    ],
  },

  problem: {
    eyebrow: "Why teams reach for it",
    heading: "What stands between a question and its answer",
    items: [
      {
        route: "the queue",
        title: "Every question waits on somebody else",
        body: "\"Who refunded the most this month?\" is a ten-second question. It queues behind whoever writes the queries, and comes back as a spreadsheet that is already a day old.",
        answeredBy: "Asking in plain language",
      },
      {
        route: "the busywork",
        title: "The same chore, by hand, every week",
        body: "Read the figures, summarise them, mail the manager, post to the channel, update the ticket. Five tools, every week, done by a person.",
        answeredBy: "Workflow automation",
      },
      {
        route: "the leap of faith",
        title: "Handing work to an AI you can't check",
        body: "Where did that number come from, which tool did it call, what did it nearly send and to whom. Without an answer to that, nobody sensible lets it near real data.",
        answeredBy: "The confirmation gate, and the full record",
      },
    ],
    answer: {
      eyebrow: "The answer",
      ink: "Three problems, three answers, one screen.",
      rest: "The queue clears because the question goes straight to the data — and when a question is genuinely ambiguous it asks you back rather than guessing. The chore runs itself once described. And nothing that can't be taken back happens without a confirmation, on a record you can read afterwards.",
    },
  },

  channels: {
    eyebrow: "The platform",
    heading: "Seven surfaces, one console",
    lead: "Every readout below is a surface people open daily — shipped, not roadmap. The data in them is invented; the real data belongs to whoever is signed in.",
    items: [
      {
        title: "Nothing it did is a mystery afterwards",
        body: "Everything the assistant runs, from every machine, streaming as it happens: which tools it called and in what order, how long each took, what it cost, and a flag on anything that has stopped making progress.",
        points: [
          "Tool-by-tool trace of a single run",
          "Every answer traceable to the figures it read",
          "Writes held for confirmation, with the recipient shown",
          "Alerts on a run that has stalled",
          "What it cost, by model and by day",
        ],
      },
      {
        title: "The everyday questions, answered on the spot",
        body: "Ask it about your own figures, hand it a PDF or a photo of a delivery note, have it check something on the web — it answers from the real source rather than from memory. On a model running on your own machine every one of those answers costs nothing; add a hosted model and it is the same assistant, with the same reach.",
        points: [
          "Reads photos, scans, PDFs and Word files (vi/en/zh)",
          "Searches the web from a server you run yourself",
          "Addresses, weather and nearby places",
          "Save any answer as a PDF to send on",
        ],
      },
      {
        title: "Ask out loud when your hands are busy",
        body: "A fullscreen console you talk to. It reads the answer back as it arrives, and puts tables and charts on a panel beside it instead of reading numbers out one by one — so you can be at the counter, or walking the floor, and still get a straight answer.",
        points: [
          "Keeps listening, so you can just keep asking",
          "Read the conversation back, in place",
          "Voice recognition comes from the browser today, so voice needs Chrome",
        ],
      },
      {
        title: "Describe the job once. It runs every week.",
        body: "Tell the assistant what you want done, in the words you would use with a colleague — read last week's figures, pull up the complaints attached to them, write the summary, send it to the manager. It builds that job, tries it on your real data while you watch, and from then on it runs on its own. Nothing irreversible happens without you.",
        points: [
          "Set it up by describing it, not by drawing it",
          "Runs on a schedule, or the moment you ask",
          "Several steps at once, so a long job still finishes quickly",
          "Survives a restart and picks up where it stopped",
          "Nothing sends until you confirm — and only to addresses you approved",
        ],
      },
      {
        title: "It works inside the tools you already use",
        body: "Gmail, Calendar, Drive, Slack, WhatsApp and Zalo OA — plus GitHub, Jira and Trello — most connected in one click. And whatever else your company runs can be plugged in, so the assistant reaches that too.",
        points: ["It never sends or changes anything quietly", "Each person's logins encrypted separately"],
      },
      {
        title: "Find the answer you got last month",
        body: "One search across everything that has been run, asked and automated. What the team ran is shared with the team; your own conversations and jobs come back to you alone, as links rather than quoted text — so searching never exposes what a colleague wrote.",
        points: ["Finds partial and misspelt words — Vietnamese, English, 中文"],
      },
      {
        title: "When someone leaves, their access leaves with them",
        body: "Four roles, enforced on every screen. Everyone manages their own keys; an owner can hand one out or take it back on someone else's behalf, and every time that happens it is written down.",
        points: ["Each person's logins encrypted separately", "Rate limiting and account lockout"],
      },
    ],
  },

  evidence: {
    eyebrow: "Measured, not asserted",
    heading: "Tried on real data before it reaches you",
    lead: {
      ink: "Every release is run against a real database, not reasoned about.",
      rest: "That is how the three below came to light — each one something no amount of thinking it through would have shown. Found, root-caused, fixed, and then measured again.",
    },
    cards: [
      {
        measure: "finding 01 · fixed",
        caption: "before: the rules were only written into its instructions",
        after: "now it tries the draft on your real data first",
        title: "Telling the assistant the rules was not enough. Showing it was.",
        body: "When the assistant drafts one of these jobs for you, we used to simply write the rules into its instructions. It followed them at best three times in fifteen. Now it runs the draft against your real data first and reads back what actually happened — and corrects itself from what it saw. Confirmed end to end, on real data rather than a rehearsal.",
      },
      {
        measure: "finding 02 · fixed",
        caption: "before: one saved job broken by a live reference",
        after: "now it hides only what goes out of date",
        title: "A mistake the whole industry keeps repeating — and we made it twice",
        body: "While trying the tools out, the assistant saw a real reference number and wrote it into the saved job as a fixed value. It worked once and broke on the very next run — that number was only ever valid for that one attempt. Hiding every value fixed it and broke something else: the job could no longer tell four similar lookups apart. So it now hides exactly what goes out of date, and still shows what tells one lookup from another.",
      },
      {
        measure: "finding 03 · fixed",
        caption: "before: spoken answers given without checking",
        after: "now 0 of 12",
        title: "One line of wording was making it answer from memory",
        body: 'Asked out loud, it answered without looking anything up 3 times in 17 — where the same questions typed failed 0 in 6. The cause was a single line telling it to be brief: it read that as check less, not say less. Separating how it speaks from how much it verifies took it to none in twelve.',
      },
    ],
    measurement: {
      eyebrow: "How it is measured",
      note: "Re-run against every release",
      suites: [
        {
          name: "Behaviour check",
          scale: "17 scenarios × 5 runs",
          body: "Every scenario replayed five times and scored on each quality separately rather than pass or fail, so an answer that comes out right for the wrong reason still shows up.",
          tags: [
            "picked the right tool",
            "asked for the right details",
            "stayed on the real figures",
            "knew when not to act",
            "knew when to stop",
            "flagged anything it would send",
            "tables, not walls of text",
          ],
        },
        {
          name: "Choosing among many tools",
          scale: "60 at a time, out of 102",
          body: "Each question is answered with the whole set of tools in play, because picking the right one out of six proves nothing about picking it out of sixty.",
          tags: ["12 built in", "42 from connected apps", "48 from mounted systems"],
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
      ink: "LAAM was built for our own team and it runs on our own machines.",
      rest: "It is not a hosted product and we are not pretending otherwise — what we can show you is a working system, the decisions behind it, and what it would take to stand one up for your team.",
    },
    facts: [
      { label: "Release", value: "v2.5.0" },
      { label: "Local model cost", value: "$0" },
      { label: "Connectors", value: "9 + MCP" },
      { label: "Your data stays", value: "On your machines" },
    ],
    nextLabel: "Next",
    ahead: [
      "A fuller activity record — today it covers writes, access grants and role changes",
      "Reading images and scans on the hosted model too, not only the local one",
      "Speech recognition we host ourselves, so voice stops needing Chrome",
    ],
  },

  contact: {
    eyebrow: "Talk to the team that built it",
    heading: "We'll show you the live console",
    lead: {
      ink: "Forty minutes, real questions, real workflows",
      rest: "— including the parts still on the roadmap. Bring the questions you'd ask before running something like this yourself.",
    },
    primary: "Book a walkthrough",
    secondary: "Back to the top",
    mailSubject: "LAAM walkthrough",
  },

  footer: { wordmark: "LAAM — Local AI Agent Monitoring", org: "Internal platform" },

  skipToContent: "Skip to content",
};
