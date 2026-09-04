/**
 * The hero's subject: questions asked in plain language, and what came back.
 *
 * This replaces the agent-session readout the hero used to show. That readout
 * described the product LAAM was at v2.0 — a console for watching Claude Code
 * runs. Sessions are still real and still shipped, and `telemetry.ts` still
 * feeds the monitoring panel that renders them. They are simply no longer the
 * first thing the page says LAAM is for.
 *
 * Three states, and they are not decoration — each is a behaviour the product
 * has and a competing chatbot does not:
 *
 * - `answered` — it looked the figures up and answered.
 * - `clarified` — the question was genuinely ambiguous and it asked back
 *   instead of guessing. This is the one visitors underrate until they have
 *   been burned by a confident wrong number.
 * - `held`     — the answer implies an action that cannot be taken back
 *   (send, write), so it stopped at a confirmation card.
 *
 * Everything here is FIXED and FICTIONAL, the same rule `telemetry.ts` and
 * `constellation.ts` follow: real questions belong to whoever is signed in, and
 * they carry the business that asked them. The engines and the state names are
 * real product vocabulary; the questions are invented, and the hero's caption
 * says so.
 *
 * The prose — the questions themselves and the domain each belongs to — lives
 * in `lib/i18n` and is zipped with this list BY INDEX, the same arrangement
 * `content.ts` uses for the channels. What stays here is what is identical in
 * every language: which engine answered, how many lookups it took, and how it
 * ended.
 */

export type InquiryState = "answered" | "clarified" | "held";

export type Inquiry = {
  /** Short form of a query id, shaped like the ones the product mints. */
  id: string;
  /**
   * What answered. Stays English in every locale — these are product names,
   * and the set is deliberately not just SQL, because the product's reach is
   * not just SQL:
   *
   * - the four dialects the data layer speaks, for figures held in tables
   *   (`ennam.kg.go/internal/service/datasource.go`);
   * - `Knowledge graph`, for what was extracted out of documents — contracts,
   *   reports, anything that was read rather than queried;
   * - `MCP server`, for a system that exposes its own tools. This is the one
   *   that makes the domain-neutrality claim true rather than hopeful: a POS,
   *   a booking system, an internal service — anything that speaks MCP mounts
   *   per user, and the assistant can be asked to ACT in it, not only read
   *   from it.
   */
  source: "PostgreSQL" | "SQL Server" | "MySQL" | "MariaDB" | "Knowledge graph" | "MCP server";
  /** Lookups it ran before answering. */
  steps: number;
  state: InquiryState;
};

/**
 * Six questions from six lines of business, and deliberately not six questions
 * of the same shape. Read down the `source` column and the set argues something
 * the copy can only assert: figures out of three different databases, an answer
 * out of documents, and one request that is not a question at all but a job to
 * be carried out inside a connected system — stopped at the confirmation card,
 * which is what the third pillar promises.
 *
 * The pharmacy row is in the set because it is the demo we can actually run in
 * the room. It is one row, not the premise.
 */
export const INQUIRIES: readonly Inquiry[] = [
  { id: "q-41c8", source: "PostgreSQL", steps: 4, state: "answered" },
  { id: "q-9d02", source: "SQL Server", steps: 3, state: "answered" },
  { id: "q-77ae", source: "MySQL", steps: 2, state: "clarified" },
  { id: "q-c604", source: "PostgreSQL", steps: 3, state: "answered" },
  { id: "q-1b35", source: "Knowledge graph", steps: 3, state: "answered" },
  { id: "q-2f90", source: "MCP server", steps: 5, state: "held" },
] as const;

/**
 * Gold for `held` on purpose, matching `constellation.ts`, where gold marks the
 * surfaces that reach outside the machine. A held answer is held precisely
 * because the next step would leave the building.
 */
export const STATE_COLOR: Record<InquiryState, string> = {
  answered: "var(--color-trace)",
  clarified: "var(--color-signal)",
  held: "var(--color-link)",
};

/** The question the hero features, and the one the scope readout narrates. */
export const FEATURED_INDEX = 0;
