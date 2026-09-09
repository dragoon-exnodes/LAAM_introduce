/**
 * The page in English — the default, and the shape every other locale is checked
 * against (`vi.ts` is typed as `typeof en`, so a missing or renamed key is a build
 * error rather than a blank spot someone finds in production).
 *
 * The copy in this file follows the marketing brief in
 * `docs/laam-homepage-vi.html`: five sections (About, Solutions, How LAAM Works,
 * Security & Control, Custom for Your Business) and a closing CTA. The brief is
 * Vietnamese-primary with English headlines; those English headlines are used
 * here verbatim, and only the Vietnamese body prose is rendered into English.
 *
 * What is NOT in here is as deliberate as what is. Routes (`/chat`), the MCP
 * acronym, connector names and workflow vocabulary stay in English in every
 * locale. They are what the product literally shows on screen; translating them
 * would depict a product that does not exist.
 *
 * `lead` is split into `ink` and `rest` because the page sets the claim at full
 * contrast and the elaboration one step down — a distinction the translation has
 * to be able to place differently, since the claim does not always land in the
 * same clause in another language.
 */
export const en = {
  meta: {
    title: "LAAM — Enterprise AI Agent",
    description:
      "LAAM is an Enterprise AI Agent connected to the data, tools and workflows your business already runs on. Ask in plain language, get the answer from the real source, and carry out the work that follows — in one conversation.",
  },

  langToggle: { label: "Tiếng Việt", aria: "Xem trang bằng tiếng Việt" },

  nav: {
    links: [
      { href: "#top", label: "About LAAM" },
      { href: "#solutions", label: "LAAM Solutions" },
      { href: "#how-it-works", label: "How LAAM Works" },
      { href: "#security", label: "Security & Control" },
      { href: "#custom", label: "Custom for Your Business" },
    ],
    cta: "Book a demo",
  },

  boot: {
    calibrating: "bringing the console online",
    mounting: "opening the assistant",
    /** Distinct sources named by the hero's own inquiry set. */
    sources: (n: number) => `connecting sources · ${n} connected`,
    channels: (n: number) => `surfaces ${n}/${n} ready`,
  },

  hero: {
    eyebrows: ["Enterprise AI Agent", "Your data and tools", "Your infrastructure"],
    // Split for BALANCE, not for grammar. Each entry is its own overflow-hidden
    // line that the intro animation slides up, so an entry that wraps becomes two
    // moving lines and the whole hero grows. The column holds roughly the width of
    // "COMPANY'S DATA." at desktop, so each entry stays under that budget.
    headline: ["Talk to your", "business.", "Get answers.", "Take action."],
    lead: {
      ink: "LAAM is an Enterprise AI Agent that connects AI to the data, tools and workflows your business already runs on.",
      rest: "Instead of searching across systems, writing SQL, or waiting on a report from Data/IT, your people ask LAAM in plain language — the way they would ask a colleague. It pulls the data, answers the question, and carries out the steps that follow, all in one conversation.",
    },
    actions: { primary: "Book a demo", secondary: "See how LAAM works" },
    scopeCaption: "Assistant map · illustrative data",
    /** Narrates the same idle → thinking → speaking turn the constellation plays. */
    phases: { idle: "ready", thinking: "looking it up", speaking: "answering" },
    lookupLabel: "lookups",
    sourceLabel: "source",
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
      { domain: "revenue", question: "How does this month's revenue compare with last month?" },
      { domain: "operations", question: "Which tasks are past their deadline?" },
      { domain: "retail", question: "Which store performed best last quarter?" },
      { domain: "pharmacy", question: "Which employee processes the most refunds?" },
      { domain: "contracts", question: "What notice period did we agree with this supplier?" },
      { domain: "crm", question: "Create follow-up tasks for the customers we haven't contacted." },
    ],
  },

  solutions: {
    eyebrow: "LAAM Solutions",
    heading: "Turn Business Complexity Into Faster Decisions",
    lead: "Businesses hold more data and run more tools every year, but finding the right information — and turning it into action — can still take a long time.",
    whoLabel: "LAAM",
    items: [
      {
        title: "Data lives in many places",
        body: "CRM, databases, reports and separate applications each hold a different piece of the picture. People have to know where the data lives and search across systems to find it.",
        answeredBy:
          "Users simply ask a question. LAAM connects to the right data sources to find and bring together what is needed.",
      },
      {
        title: "Simple questions still wait on a report",
        body: "Managers and business teams regularly need figures to track operations or make a decision, but have to file a request with the Data/IT team first.",
        answeredBy:
          "People query business data directly in plain language — no SQL to write, no new report request to raise.",
      },
      {
        title: "Work still depends on manual handoffs",
        body: "Once the information is in hand, people still switch to other tools to send an email, create a task, update a record, or take the next step.",
        answeredBy:
          "No switching tools for the next step. LAAM prepares the action inside the conversation and only carries it out once you confirm.",
      },
      {
        title: "Reports take time to assemble",
        body: "Operational and revenue reports have to be collected, consolidated and refreshed again and again.",
        answeredBy:
          "Describe a recurring report once and LAAM runs it on schedule: gathering figures from several sources, consolidating them, and sending them to the right people.",
      },
    ],
    answer: {
      ink: "One AI layer. Across your business.",
      rest: "LAAM closes the distance between the steps below, so business data becomes easier to reach and more useful in everyday work.",
      chain: ["Question", "Data", "Insight", "Decision", "Action"],
    },
  },

  howItWorks: {
    eyebrow: "How LAAM Works",
    heading: "From Data to Action",
    lead: "LAAM works as an AI layer between people and the data, tools and workflows of the business. Instead of asking staff to learn every system, LAAM lets them start with the simplest thing: ask for what they need.",
    flow: ["Business Data & Apps", "Tools / MCP", "LAAM", "Answer & Action"],
    steps: [
      {
        title: "Ask",
        body: "People ask in AI Chat or Voice Chat, in the way they would normally speak.",
        examples: [
          "“How does this month's revenue compare with last month?”",
          "“Which customers haven't been followed up yet?”",
          "“Which tasks are past their deadline?”",
        ],
      },
      {
        title: "Understand",
        body: "LAAM works out what is being asked and uses the right configured tool to reach the relevant data or system. Nobody has to know which database the data sits in, or what query to run.",
      },
      {
        title: "Answer",
        body: "LAAM retrieves and consolidates the data to give an answer that fits the question. From a single question, LAAM can help with:",
        capabilities: [
          "Retrieving and consolidating data",
          "Tracking operational information",
          "Tracking revenue",
          "Supporting analysis",
          "Looking up extra information on the web when needed",
          "Reading and interpreting attached images",
        ],
        note: "For multi-row results, LAAM shows the source table pulled straight from the system beneath the answer, rather than retyped by the AI — so the numbers people read are the numbers in the system.",
      },
      {
        title: "Act",
        body: "The work does not stop at an answer. In the same conversation, LAAM can use a connected tool to take the next step. Every action that writes data raises a confirmation card and waits for approval before it runs.",
        dialogue: [
          {
            ask: "“Give me the list of customers who haven't been followed up.”",
            result: "LAAM retrieves the data.",
          },
          {
            ask: "“Create follow-up tasks for the team.”",
            result: "LAAM prepares the tasks and raises a confirmation card — it sends once you approve.",
          },
        ],
      },
    ],
    surfaces: {
      eyebrow: "The surfaces",
      heading: "Where the work happens",
      lead: "Each screen below is something people use every day. The data shown here is sample data; your real data only appears once you are signed in.",
    },
    items: [
      {
        title: "The everyday questions, answered on the spot",
        body: "Ask about your numbers, hand over a PDF or a photo of a delivery note, or have LAAM check something online. Answers come from the real source, never from memory — and multi-row results arrive as the system's own table underneath.",
        points: [
          "Reads photos, scans, PDFs and Word files (vi/en/zh)",
          "Looks up extra information on the web when needed",
          "Shows the source table under the answer, not a retyped copy",
          "Saves any answer as a PDF to send on",
        ],
      },
      {
        title: "Ask out loud when your hands are busy",
        body: "A fullscreen console you can simply talk to. It speaks the answer back as it comes and puts tables and charts on a side panel instead of reading out every number — so whether you are at the counter or walking the floor, you still get a clear answer.",
        points: [
          "Keeps listening, so you can just keep asking",
          "Review the conversation at any time, right there",
          "Tables and charts on screen, the summary spoken",
        ],
      },
      {
        title: "Describe the job once. It runs on schedule.",
        body: "For repeat work — consolidating a report from several sources and emailing it every week — build an Automation. No manual diagramming: describe the job in words, and LAAM drafts the steps and tests them on real data for you to approve before it goes on the schedule. Automation that stays under your control.",
        points: [
          "Set it up by describing it, not by drawing it",
          "Runs on a schedule, or the moment you ask",
          "Several steps at once, so a long job still finishes quickly",
          "Resumes at the interrupted step, not from the beginning",
          "Nothing sends until you confirm",
        ],
      },
      {
        title: "Connected to the tools your teams already use",
        body: "Ready in LAAM: Gmail, Calendar, Google Drive, Slack, WhatsApp, Zalo OA, Jira, Trello and GitHub — connected with your own company accounts. For your own systems, the LAAM team builds a connection layer (MCP) for that exact system during rollout, so the AI can work with your specific data and processes.",
        points: [
          "Databases",
          "CRM",
          "Sales software",
          "Internal applications",
          "Industry-specific software",
        ],
      },
    ],
  },

  security: {
    eyebrow: "Security & Control",
    heading: "Your Data. Your Infrastructure. Your Control.",
    lead: "Bringing AI into a business is not only a question of what the AI can do. It is also a question of:",
    questions: "Where does the AI run? How is the data handled? And how does the business stay in control of it?",
    leadAfter:
      "LAAM is designed for organisations that want to stay in charge of how AI is deployed and how internal data is managed.",
    pillars: [
      {
        title: "Self-Hosted Deployment",
        body: [
          "LAAM can be deployed on your own infrastructure, giving your organisation more control over how the AI system is operated.",
        ],
      },
      {
        title: "Flexible Model Options",
        body: [
          "LAAM supports a range of AI models — from cloud models to models running locally — according to your deployment needs, budget and data-security requirements.",
          "For internal tasks where it fits, you can configure LAAM to run on a local model, reducing the dependence on per-API cost for that work.",
        ],
      },
      {
        title: "Controlled Data Access",
        body: [
          "LAAM connects AI to business systems through a toolset configured for how you actually work. You decide what the AI can see and what it can do. Beyond that scope, it cannot reach into your systems on its own. Every action that writes data stops at a confirmation card; nothing runs automatically.",
          "Access is managed by role: each person sees only their own work, and when someone leaves, their permissions and access keys are revoked immediately, with a log.",
        ],
      },
    ],
    summary: {
      eyebrow: "The result",
      ink: "Enterprise AI with greater control",
      benefits: [
        "Keep firmer control over your data",
        "Choose the environment the AI is deployed in",
        "Control how the AI interacts with internal systems",
        "Fewer reservations about putting AI into real workflows",
      ],
      tagline: "AI adoption without giving up control.",
    },
  },

  custom: {
    eyebrow: "Custom for Your Business",
    heading: "AI Built Around How Your Business Works",
    lead: "No two businesses share the same data, the same systems, or the same way of working. That is why LAAM is not rolled out as one generic AI assistant for every company.",
    blocks: [
      {
        title: "Built for your systems",
        body: "The LAAM team studies the systems your business already uses, and from there works out how LAAM needs to connect to them and work with them.",
        items: [
          "CRM",
          "Database",
          "Reporting",
          "Communication tools",
          "Project management tools",
          "Internal applications",
        ],
      },
      {
        title: "Built for your workflows",
        body: "LAAM is configured around the real workflows your business wants to improve. Good places to start include:",
        items: [
          "Getting to data faster",
          "Cutting down manual report requests",
          "Tracking operations and revenue",
          "Automating repetitive steps",
          "Connecting information across systems",
          "Building an AI assistant for a specific business need",
        ],
      },
      {
        title: "Built with your own toolset",
        body: "Based on what the rollout needs, the LAAM team builds the connection layer (MCP) and a dedicated toolset for each specialised system, so the AI can work with your particular data, applications and processes.",
        note: "The goal is not to add another AI tool to your stack. The goal is to bring AI into the way your business already runs.",
      },
    ],
    quote: ["Your business shouldn't adapt to AI.", "AI should adapt to your business."],
  },

  contact: {
    eyebrow: "Talk to the team that built it",
    heading: "See What LAAM Can Do for Your Business",
    lead: {
      ink: "Explore how LAAM connects directly to the data, tools and workflows",
      rest: "your business already runs on — and what a rollout would look like for your team.",
    },
    tagline: "Talk to your business. Get answers. Take action.",
    primary: "Book a demo",
    secondary: "Back to the top",
    mailSubject: "LAAM demo",
  },

  footer: { wordmark: "LAAM", org: "Enterprise AI Agent" },

  skipToContent: "Skip to content",
};
