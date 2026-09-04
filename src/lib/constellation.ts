/**
 * Mock constellation model for the hero stage.
 *
 * Ported from LAAM's own `/constellation` command centre (`src/lib/constellation/
 * {field,nodeModel}.ts`) — same polar layout and the same gold/cyan/idle tint
 * language, so the marketing hero shows the product's real visual identity
 * rather than a stock 3D asset.
 *
 * The nodes here are FIXED and FICTIONAL on purpose. The live page derives them
 * from the signed-in user's own agents, connectors and MCP servers; putting any
 * of that on a public page would leak workspace names. These are the seven
 * product surfaces, which are public information. Same rule as `telemetry.ts`.
 */

export type NodeTint = "gold" | "cyan" | "idle";

export type ConstNode = {
  id: string;
  label: string;
  tint: NodeTint;
};

/** Node with a polar position resolved, in percent of the stage box. */
export type Placed = ConstNode & { x: number; y: number };

/**
 * Gold = reaches something outside the machine (connectors, MCP). Cyan = LAAM's
 * own surfaces. Idle = a connector nobody has authorized yet — kept in the set
 * because an honest picture of a fresh install has some lights off.
 */
export const NODES: readonly ConstNode[] = [
  { id: "chat", label: "Chat", tint: "cyan" },
  { id: "connectors", label: "Connectors", tint: "gold" },
  { id: "workflows", label: "Workflows", tint: "gold" },
  { id: "monitoring", label: "Monitoring", tint: "cyan" },
  { id: "access", label: "Access", tint: "idle" },
  { id: "search", label: "Search", tint: "cyan" },
  { id: "voice", label: "Voice", tint: "cyan" },
] as const;

/**
 * Origin-centred polar layout, angles starting at -90° — LAAM's `placeNodes`,
 * reduced to a single ring because the hero box is a fraction of the fullscreen
 * canvas the original lays out for.
 *
 * `squash` pulls the ring into an ellipse: labels sit left and right of the core
 * where there is width to hold them, instead of colliding above and below it.
 */
export function placeNodes(nodes: readonly ConstNode[], radius: number, squash = 1): Placed[] {
  return nodes.map((n, i) => {
    const ang = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
    return { ...n, x: Math.cos(ang) * radius, y: Math.sin(ang) * radius * squash };
  });
}

/**
 * The scripted turn the hero plays on a loop.
 *
 * `/constellation` drives these from real speech: the ring turns blue-white while
 * the model thinks and the beams race inward, then gold as it speaks, with the
 * ripples following actual audio amplitude. There is no microphone on a landing
 * page, so the same states are played on a timer — the motion still teaches what
 * the product does, it just isn't pretending to be live.
 */
export type Mode = "idle" | "thinking" | "speaking";

const SCRIPT: readonly { mode: Mode; ms: number }[] = [
  { mode: "idle", ms: 2600 },
  { mode: "thinking", ms: 2400 },
  { mode: "speaking", ms: 3400 },
] as const;

export const CYCLE_MS = SCRIPT.reduce((n, s) => n + s.ms, 0);

/** Mode at a given point in the loop. */
export function modeAt(elapsedMs: number): Mode {
  let t = elapsedMs % CYCLE_MS;
  for (const step of SCRIPT) {
    if (t < step.ms) return step.mode;
    t -= step.ms;
  }
  return "idle";
}

/**
 * Stand-in for the audio analyser's 0..1 amplitude. Idle breathes slowly;
 * speaking gets a faster, louder envelope with a second harmonic so it doesn't
 * read as a pure sine.
 */
export function levelAt(elapsedMs: number, mode: Mode): number {
  const t = elapsedMs / 1000;
  if (mode === "speaking") {
    const a = Math.sin(t * 7.1) * 0.5 + 0.5;
    const b = Math.sin(t * 11.7 + 1.2) * 0.5 + 0.5;
    return 0.25 + (a * 0.6 + b * 0.4) * 0.55;
  }
  if (mode === "thinking") return 0.12 + (Math.sin(t * 2.3) * 0.5 + 0.5) * 0.12;
  return 0.06 + (Math.sin(t * 0.9) * 0.5 + 0.5) * 0.08;
}
