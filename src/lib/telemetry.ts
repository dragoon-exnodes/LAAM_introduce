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
 * Values are fixed seeds, not random: the ribbon must look identical on every
 * visit, and the only thing that genuinely moves is elapsed time.
 */

export type SessionStatus = "running" | "idle" | "done";

export type Session = {
  /** Short form of the real id. */
  id: string;
  project: string;
  machine: string;
  model: string;
  status: SessionStatus;
  /** Derived at read time, never stored — see `src/lib/stuck.ts`. */
  stuck: boolean;
  /** Seconds already elapsed when the page loads. */
  seed: number;
  tools: number;
};

export const SESSIONS: readonly Session[] = [
  { id: "4f2a9c", project: "ennam.kg.go", machine: "ws-01", model: "claude-sonnet-4-6", status: "running", stuck: false, seed: 257, tools: 12 },
  { id: "8b1e04", project: "ennam.kg.python", machine: "ws-01", model: "qwen3-vl:8b", status: "running", stuck: false, seed: 1042, tools: 31 },
  { id: "d33071", project: "ennam.kg.next", machine: "ws-02", model: "claude-sonnet-4-6", status: "idle", stuck: false, seed: 88, tools: 4 },
  { id: "0ac5f8", project: "ennam.kg.python", machine: "ws-03", model: "qwen3-vl:8b", status: "running", stuck: true, seed: 2314, tools: 7 },
  { id: "6e92b7", project: "LAAM", machine: "ws-02", model: "gpt-oss-120b", status: "running", stuck: false, seed: 431, tools: 19 },
  { id: "b70d15", project: "ennam.kg.go", machine: "ws-01", model: "claude-opus-4-8", status: "done", stuck: false, seed: 3908, tools: 46 },
] as const;

export const STATUS_COLOR: Record<SessionStatus, string> = {
  running: "var(--color-signal)",
  idle: "var(--color-faint)",
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
 * One orchestrator's sub-agent fan-out, for the tree the telemetry panel draws.
 *
 * This is the shape LAAM reconstructs from a transcript: an orchestrator session
 * that called the sub-agent tool, and each child it spawned with its own type,
 * status and duration. `subagent_type` values are the real preset names a Claude
 * Code run reports; the descriptions are invented, like everything else in this
 * file, because a real one carries the task text of whoever ran it.
 */
export type SubAgent = {
  id: string;
  /** `subagent_type` as it arrives in the transcript. */
  type: string;
  description: string;
  status: "running" | "done";
  /** Seconds; null while still running. */
  durationSec: number | null;
};

export const SUB_AGENTS: readonly SubAgent[] = [
  { id: "a1", type: "code-reviewer", description: "Review auth middleware", status: "done", durationSec: 142 },
  { id: "a2", type: "general-purpose", description: "Map connector call sites", status: "done", durationSec: 96 },
  { id: "a3", type: "test-runner", description: "Re-run failing suite", status: "running", durationSec: null },
  { id: "a4", type: "general-purpose", description: "Draft migration notes", status: "done", durationSec: 61 },
] as const;
