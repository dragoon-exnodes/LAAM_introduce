import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

/**
 * The shipped `multi-source-report-email` template, drawn as the graph it
 * actually is.
 *
 * It used to be a flat vertical list, which quietly contradicted the copy beside
 * it: the whole claim is "parallel DAG — fan-out, fan-in", and a single column
 * cannot show a fan-out. The three research branches run at the same time and
 * converge on one synthesis node, so that is what this draws.
 *
 * Node kind colours are LAAM's own (`NodesLibraryPanel.NODE_TYPES`), so a node
 * that is blue here is blue in the editor.
 */
const KIND = {
  agent: { color: "#2563eb", label: "agent" },
  connector: { color: "#06b6d4", label: "connector" },
  gate: { color: "#22d3ee", label: "write gate" },
} as const;

type Kind = keyof typeof KIND;
type State = "done" | "waiting" | "held";

type Node = {
  id: string;
  label: string;
  kind: Kind;
  state: State;
  /** Percent of the canvas box — x is the centre of the node, y its top. */
  x: number;
  y: number;
  w: number;
};

// Widths are deliberately narrow: at 34% the three parallel nodes touch, and a
// fan-out whose branches visually merge is the one thing this panel exists to
// avoid saying.
const NODES: readonly Node[] = [
  { id: "brief", label: "brief", kind: "agent", state: "done", x: 50, y: 1, w: 30 },
  { id: "r1", label: "research_laam", kind: "agent", state: "done", x: 17, y: 27, w: 28 },
  { id: "r2", label: "research_web", kind: "agent", state: "done", x: 50, y: 27, w: 28 },
  { id: "r3", label: "fetch_tasks", kind: "connector", state: "done", x: 83, y: 27, w: 28 },
  { id: "synthesis", label: "synthesis", kind: "agent", state: "done", x: 50, y: 53, w: 30 },
  { id: "gate", label: "confirm send", kind: "gate", state: "waiting", x: 50, y: 73, w: 34 },
  { id: "send", label: "gmail_send", kind: "connector", state: "held", x: 50, y: 91, w: 30 },
] as const;

/** [from, to] — every edge the run traverses. */
const EDGES: readonly [string, string][] = [
  ["brief", "r1"],
  ["brief", "r2"],
  ["brief", "r3"],
  ["r1", "synthesis"],
  ["r2", "synthesis"],
  ["r3", "synthesis"],
  ["synthesis", "gate"],
  ["gate", "send"],
] as const;

const byId = (id: string) => NODES.find((n) => n.id === id)!;
/** Node box height as a percentage of the canvas — nodes are a fixed pixel height. */
const NODE_H = 11;

function edgePath(fromId: string, toId: string): string {
  const a = byId(fromId);
  const b = byId(toId);
  const x1 = a.x;
  const y1 = a.y + NODE_H;
  const x2 = b.x;
  const y2 = b.y;
  // Vertical-tangent cubic: leaves the bottom of one node and enters the top of
  // the next straight down, so a fan-out reads as branching rather than as lines
  // cutting diagonally across the canvas.
  const dy = (y2 - y1) * 0.55;
  return `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
}

/** Row index of each node, so the entrance cascades down the graph. */
const ROW: Record<string, number> = { brief: 0, r1: 1, r2: 1, r3: 1, synthesis: 2, gate: 3, send: 4 };
const ROW_MS = 170;

export function WorkflowPanel({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  // Re-keying on `active` replays the draw each time this becomes the panel on
  // screen, rather than animating once on mount and never again.
  const runKey = active ? "on" : "off";

  return (
    <PanelFrame route="/workflows" status="run #418" tone="signal">
      <div className="flex h-full flex-col gap-4">
        <dl className="grid shrink-0 grid-cols-3 gap-px border border-line bg-line">
          {[
            ["Workflow", "multi-source-report-email"],
            ["Trigger", "schedule"],
            ["Run", "resumable · 1 held"],
          ].map(([label, value]) => (
            <div key={label} className="bg-panel px-3 py-2.5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">{label}</dt>
              <dd className="mt-1 truncate font-mono text-[11px] text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        {/* The canvas. Dotted ground matches the editor's own background. */}
        <div key={runKey} className="relative min-h-0 flex-1 rounded-sm border border-line bg-panel-2/40 [background-image:radial-gradient(circle,rgba(148,175,205,0.13)_1px,transparent_1px)] [background-size:14px_14px]">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {EDGES.map(([from, to]) => {
              // The only edge that has not run yet is the one past the gate.
              const pending = from === "gate";
              return (
                <path
                  key={`${from}-${to}`}
                  d={edgePath(from, to)}
                  fill="none"
                  stroke={pending ? "rgba(148,175,205,0.28)" : "rgba(34,211,238,0.4)"}
                  strokeWidth={pending ? 0.4 : 0.5}
                  strokeDasharray={pending ? "1.6 1.6" : undefined}
                  vectorEffect="non-scaling-stroke"
                  // pathLength normalises every path to 1 unit, so a single dash
                  // covers it whatever its real length — no measuring needed.
                  pathLength={pending ? undefined : 1}
                  style={
                    reduced || pending
                      ? undefined
                      : {
                          strokeDasharray: 1,
                          animation: `wf-edge-draw 520ms ease-out ${ROW[to] * ROW_MS}ms backwards`,
                        }
                  }
                />
              );
            })}
          </svg>

          {NODES.map((n) => {
            const kind = KIND[n.kind];
            const waiting = n.state === "waiting";
            const held = n.state === "held";
            return (
              <div
                key={n.id}
                className="absolute -translate-x-1/2"
                style={{
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  width: `${n.w}%`,
                  animation: reduced
                    ? undefined
                    : `wf-node-in 380ms cubic-bezier(0.16,1,0.3,1) ${ROW[n.id] * ROW_MS}ms backwards`,
                }}
              >
                <div
                  className={`border border-l-[3px] bg-panel px-2.5 py-1.5 ${
                    waiting ? "wf-gate-pulse border-signal" : "border-line"
                  } ${held ? "opacity-45" : ""}`}
                  style={{ borderLeftColor: waiting ? undefined : kind.color }}
                >
                  <p
                    className="font-mono text-[8.5px] uppercase leading-none tracking-[0.16em]"
                    style={{ color: waiting ? undefined : kind.color }}
                  >
                    <span className={waiting ? "text-signal" : undefined}>{kind.label}</span>
                  </p>
                  <p className="mt-1 truncate font-mono text-[10.5px] leading-tight text-ink">
                    {n.label}
                  </p>
                </div>
              </div>
            );
          })}

          {/* The one thing a person has to do. Called out rather than left as a
              node among nodes — a gate nobody notices is a workflow that stalls.
              Sits above the gate, not beside it: at this canvas width there is no
              room to its right without running off the edge. */}
          <span
            className="absolute left-1/2 -translate-x-1/2 -translate-y-full pb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-signal"
            style={{ top: `${byId("gate").y}%` }}
          >
            waiting on you
          </span>
        </div>

        <p className="shrink-0 border-t border-line pt-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          3 branches ran in parallel · next run 07:00 · resumes from the held node
        </p>
      </div>
    </PanelFrame>
  );
}
