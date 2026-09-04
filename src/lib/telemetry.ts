/**
 * Session telemetry shaped like the real thing.
 *
 * Field names and the status union come from LAAM's own schema
 * (`src/db/schema.ts`) and from what `laam_search_sessions` actually returns:
 * `{ id, project, machineId, model, status, stuck, lastActivity }`.
 *
 * Two details worth preserving, because getting them wrong would misrepresent the
 * product: the stored status is only `running | idle | done`, and **`stuck` is
 * derived, not stored** — it is computed from the time since the last transcript
 * write against `LAAM_STUCK_MIN` (default 10 minutes).
 *
 * Values are fixed seeds, not random: the monitoring panel must look identical on
 * every visit, and the only thing that genuinely moves is elapsed time. (This used
 * to feed the hero ribbon too; that strip is now `InquiryRibbon`, fed by
 * `lib/inquiry.ts`.)
 */

export type SessionStatus = "running" | "idle" | "done";

export type Session = {
  /** Short form of the real id. */
  id: string;
  project: string;
  machine: string;
  model: string;
  status: SessionStatus;
  /** Derived at read time, never stored — computed from time since last write. */
  stuck: boolean;
  /** Seconds already elapsed when the page loads. */
  seed: number;
};

/*
 * The project names used to be `orbit.api` / `orbit.worker` / `orbit.web` —
 * services in an imaginary software product, from when this page was sold to
 * engineering teams. They are now the kind of workspace a business actually
 * runs, because the reader of this panel is the person who owns that business,
 * and a list of microservice names tells them the product is not for them.
 * Everything else about the rows is unchanged and still real: the id shape, the
 * `running | idle | done` status the product stores, and `stuck` derived at read
 * time rather than stored.
 */
export const SESSIONS: readonly Session[] = [
  { id: "4f2a9c", project: "pharmacy-ops", machine: "ws-01", model: "qwen3-vl:8b", status: "running", stuck: false, seed: 257 },
  { id: "8b1e04", project: "retail-ops", machine: "ws-01", model: "qwen3-vl:8b", status: "running", stuck: false, seed: 1042 },
  { id: "d33071", project: "finance-ops", machine: "ws-02", model: "claude-sonnet-4-6", status: "idle", stuck: false, seed: 88 },
  { id: "0ac5f8", project: "bookings", machine: "ws-03", model: "qwen3-vl:8b", status: "running", stuck: true, seed: 2314 },
  { id: "6e92b7", project: "warehouse", machine: "ws-02", model: "gpt-oss-120b", status: "running", stuck: false, seed: 431 },
  { id: "b70d15", project: "retail-ops", machine: "ws-01", model: "claude-opus-4-8", status: "done", stuck: false, seed: 3908 },
] as const;

/* This colours the status DOT and the status LABEL from one value, so it has to
   clear the readable line: "idle" is a word the reader has to be able to read,
   not just a dimness. Muted is still the quietest thing on the row — running is
   full-saturation cyan, stuck is alert, done is trace — so idle still recedes
   from all three without dropping out of the text scale. */
export const STATUS_COLOR: Record<SessionStatus, string> = {
  running: "var(--color-signal)",
  idle: "var(--color-muted)",
  done: "var(--color-trace)",
};

/** A stuck run outranks its stored status in the UI, the way it does in the product. */
export function sessionColor(session: Session): string {
  return session.stuck ? "var(--color-alert)" : STATUS_COLOR[session.status];
}

export function sessionLabel(session: Session): string {
  return session.stuck ? "stuck" : session.status;
}

/** mm:ss for anything under an hour, otherwise h:mm:ss — the way a run timer reads. */
export function formatElapsed(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * One run, step by step — the tool-call trace the monitoring panel draws.
 *
 * This slot used to hold an orchestrator's sub-agent fan-out, with Claude Code's
 * own preset names (`code-reviewer`, `test-runner`) on the children. That drew
 * the old thesis as a picture: it sat under a heading promising a business owner
 * they could check what the assistant did, and answered with a diagram of a
 * software team's agents. The SHAPE was worth keeping — a run and the things it
 * spawned, drawn as a tree — so only what hangs off it changed.
 *
 * These are the tool names as they appear in a real trace: `mcp__<server>__<tool>`
 * for a mounted system, bare names for LAAM's own. `held` is the state that earns
 * this panel its heading — a send that reached the confirmation card and stopped
 * there — and it is why the third status exists at all.
 */
export type RunStep = {
  id: string;
  /** Tool name exactly as the trace records it. */
  tool: string;
  status: "done" | "running" | "held";
  /** Seconds; null while running, and null for a step that never ran. */
  durationSec: number | null;
};

export const RUN_STEPS: readonly RunStep[] = [
  { id: "s1", tool: "mcp__pos__query_datasource", status: "done", durationSec: 4 },
  { id: "s2", tool: "util_calc", status: "done", durationSec: 1 },
  { id: "s3", tool: "mcp__pos__query_datasource", status: "running", durationSec: null },
  { id: "s4", tool: "gmail_send_message", status: "held", durationSec: null },
] as const;

/** Gold for `held`, matching `inquiry.ts`: gold is what reaches outside the building. */
export const STEP_COLOR: Record<RunStep["status"], string> = {
  done: "var(--color-trace)",
  running: "var(--color-signal)",
  held: "var(--color-link)",
};
