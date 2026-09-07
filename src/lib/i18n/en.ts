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
 *
 * Writing rule for this pass: short sentences, the benefit stated before the
 * mechanism, one idea per sentence. A reader with zero technical background and
 * a reader who could build this themselves should both get the point on the
 * first read — neither should have to re-read a sentence to find the subject.
 */
export const en = {
  meta: {
    title: "LAAM — Your company's systems, now they answer back",
    description:
      "Ask your own data a question the way you'd ask a colleague — no SQL, no report request, no waiting. LAAM looks up the real numbers, answers you, and carries out the work that follows. It runs on your own machines, and questions to a local model cost nothing.",
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
      rest: "It connects to your databases, documents, and the tools you already run — point of sale, booking system, internal apps — pulls the real numbers, and finishes the work that comes after. If a question could mean two things, it asks you to clarify instead of guessing. And it runs on your own machines, so your data never leaves.",
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
        body: "\"Who refunded the most this month?\" is a ten-second question. It queues behind whoever writes the queries, and comes back a day later as a spreadsheet that's already out of date.",
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
        body: "Where did that number come from? Which tool did it use? What was it about to send, and to whom? Without clear answers, no one should let it near real data.",
        answeredBy: "The confirmation gate, and the full record",
      },
    ],
    answer: {
      eyebrow: "The answer",
      ink: "Three problems, three answers, one screen.",
      rest: "The queue disappears because your question goes straight to the data — and if it's genuinely unclear, it asks you to clarify instead of guessing. The weekly chore runs itself once you've described it. And anything that can't be undone waits for your confirmation, logged so you can check it later.",
    },
  },

  channels: {
    eyebrow: "The platform",
    heading: "Seven surfaces, one console",
    lead: "Each screen below is something people use every day — shipped and working today, not a roadmap promise. The data you see here is sample data; your real data only appears once you're signed in.",
    items: [
      {
        title: "Nothing it does is a mystery afterwards",
        body: "Every action the assistant takes, from every machine, streams in live: which tools it used and in what order, how long each step took, what it cost, and a flag on anything that gets stuck.",
        points: [
          "Tool-by-tool trace of every run",
          "Every answer traces back to the numbers it used",
          "Data changes wait for your OK, with the recipient shown",
          "Instant alerts on any run that gets stuck",
          "Costs broken down by model and by day",
        ],
      },
      {
        title: "The everyday questions, answered on the spot",
        body: "Ask about your numbers, hand it a PDF or a photo of a delivery note, or have it check something online — it always answers from the real source, never from memory. Run it on a model on your own machine and every answer is free; add a hosted model later and it's the same assistant, with the same reach.",
        points: [
          "Reads photos, scans, PDFs and Word files (vi/en/zh)",
          "Searches the web using your own search server",
          "Looks up addresses, weather, and nearby places",
          "Saves any answer as a PDF to send on",
        ],
      },
      {
        title: "Ask out loud when your hands are busy",
        body: "A fullscreen console you can just talk to. It speaks the answer back as it comes, and shows tables and charts on a side panel instead of reading out every number — so whether you're at the counter or walking the floor, you still get a clear answer.",
        points: [
          "Keeps listening, so you can just keep asking",
          "Review the conversation anytime, right there",
          "Voice recognition comes from the browser today, so voice needs Chrome",
        ],
      },
      {
        title: "Describe the job once. It runs every week.",
        body: "Tell the assistant what you want, in plain words — like you would with a colleague: read last week's numbers, pull up the related complaints, write a summary, send it to the manager. It builds that job, tests it on your real data while you watch, and then runs on its own from then on. Nothing irreversible happens without your say-so.",
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
        body: "Gmail, Calendar, Drive, Slack, WhatsApp and Zalo OA — plus GitHub, Jira and Trello — most connect in one click. Whatever else your company runs can be plugged in too, so the assistant can reach it.",
        points: ["It never sends or changes anything quietly", "Each person's logins encrypted separately"],
      },
      {
        title: "Find the answer you got last month",
        body: "One search covers everything that's ever been run, asked, or automated. What the team ran is visible to the team; your own conversations and jobs come back to you alone, shown as links rather than quoted text — so a search never exposes what a colleague actually wrote.",
        points: ["Finds partial and misspelt words — Vietnamese, English, 中文"],
      },
      {
        title: "When someone leaves, their access leaves with them",
        body: "Four roles, enforced on every screen. Everyone manages their own keys; an owner can grant or revoke access for anyone else, and every change is logged.",
        points: ["Each person's logins encrypted separately", "Rate limiting and account lockout"],
      },
    ],
  },

  evidence: {
    eyebrow: "Measured, not asserted",
    heading: "Tried on real data before it reaches you",
    lead: {
      ink: "We test every release against a real database — we don't just reason about whether it'll work.",
      rest: "That's how we caught the three issues below — none of them the kind you'd catch by thinking it through. We found each one, traced it to the cause, fixed it, and measured it again.",
    },
    cards: [
      {
        measure: "finding 01 · fixed",
        caption: "before: we just told it the rules",
        after: "now it tries the draft on your real data first",
        title: "Telling the assistant the rules was not enough. Showing it was.",
        body: "When the assistant builds one of these automated jobs for you, we used to just write the rules into its instructions — and it followed them correctly only 3 times out of 15. Now it tests the draft against your real data first, checks what actually happened, and corrects itself from what it sees. Confirmed end to end, on real data rather than a rehearsal.",
      },
      {
        measure: "finding 02 · fixed",
        caption: "before: a saved job broken by one hardcoded number",
        after: "now it hides only what goes out of date",
        title: "A mistake the whole industry keeps repeating — and we made it twice",
        body: "While testing the tools, the assistant saw a real reference number and saved it into the job as a fixed value. It worked once, then broke the very next run — that number was only ever valid for that one attempt. Our first fix, hiding every value, broke something else: the job could no longer tell four similar lookups apart. So it now hides only the values that expire, and keeps the ones that tell one lookup apart from another.",
      },
      {
        measure: "finding 03 · fixed",
        caption: "before: spoken answers given without checking",
        after: "now 0 of 12",
        title: "One line of wording was making it answer from memory",
        body: "Asked out loud, it skipped looking anything up 3 times out of 17 — but the exact same questions typed in failed 0 out of 6. The cause was one line of instructions telling it to 'be brief': it read that as check less, not say less. Once we separated how it speaks from how much it verifies, that dropped to 0 out of 12.",
      },
    ],
    measurement: {
      eyebrow: "How it is measured",
      note: "Re-run against every release",
      suites: [
        {
          name: "Behaviour check",
          scale: "17 scenarios × 5 runs",
          body: "Every scenario runs five times and gets scored on several qualities separately, not just pass or fail — so an answer that's right for the wrong reason still gets caught.",
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
          body: "Every question is tested with the whole toolset available — because picking the right tool out of six proves nothing about picking it out of sixty.",
          tags: ["12 built in", "42 from connected apps", "48 from mounted systems"],
        },
      ],
      footer: {
        ink: "The scores themselves are part of the walkthrough.",
        rest: "These are dated test runs against a named model, weak results included. That's a conversation worth having in person — and a poor thing to leave on a page as a number without its reasons.",
      },
    },
  },

  status: {
    eyebrow: "Where it stands",
    heading: "An internal tool, in daily use",
    lead: {
      ink: "LAAM was built for our own team and it runs on our own machines.",
      rest: "It's not a hosted product, and we're not pretending it is — what we can show you is a working system, the decisions behind it, and what it would take to build one for your team.",
    },
    facts: [
      { label: "Release", value: "v2.5.0" },
      { label: "Local model cost", value: "$0" },
      { label: "Connectors", value: "9 + MCP" },
      { label: "Your data stays", value: "On your machines" },
    ],
    nextLabel: "Next",
    ahead: [
      "A more complete activity log — today it covers data changes, access grants and role changes",
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
