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

/*
 * Surface values copied from the editor's own theme block
 * (workflow-editor.css, .dark) rather than approximated from the app palette,
 * so a node here and a node there are the same object — same fill, same border,
 * same 10px radius, same 4px kind accent on the left.
 *
 * Deliberately NOT React Flow. That library is ~82 KB gzipped: a full
 * interactive graph engine — drag, pan, zoom, selection, its own store — to
 * render one picture nobody clicks. This page's whole JS budget is 150 KB, and
 * it only just got back under it by dropping a 4 MB 3D runtime that was there
 * for the same reason. The gap was never the renderer; it was that these nodes
 * had none of the editor's finish.
 */
const WF = {
  nodeBg: "#1e2432",
  nodeBorder: "#334155",
  nodeText: "#e2e8f0",
  idText: "#64748b",
  edge: "#475569",
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
  // Rows re-spaced after the nodes grew an output chip: at the old pitch the last
  // node ran past the bottom of the canvas and had its chip clipped, and the
  // "waiting on you" caption landed on the gate's own border.
  { id: "brief", label: "brief", kind: "agent", state: "done", x: 50, y: 0, w: 30 },
  { id: "r1", label: "research_laam", kind: "agent", state: "done", x: 17, y: 23, w: 28 },
  { id: "r2", label: "research_web", kind: "agent", state: "done", x: 50, y: 23, w: 28 },
  { id: "r3", label: "fetch_tasks", kind: "connector", state: "done", x: 83, y: 23, w: 28 },
  { id: "synthesis", label: "synthesis", kind: "agent", state: "done", x: 50, y: 46, w: 30 },
  { id: "gate", label: "confirm send", kind: "gate", state: "waiting", x: 50, y: 67, w: 34 },
  { id: "send", label: "gmail_send", kind: "connector", state: "held", x: 50, y: 85, w: 30 },
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
/** Node box height as a percentage of the canvas. Grew from 11 when the nodes
 *  gained the editor's output chip — edges anchor off this, so a stale value
 *  leaves them starting inside the box they should be leaving. */
const NODE_H = 14;

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
            <defs>
              {/* Arrowheads: the editor marks direction on every edge, and without
                  them a fan-in reads as ambiguous — three lines meeting a node say
                  nothing about which way the run travels. */}
              <marker id="wf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill={WF.edge} />
              </marker>
              <marker id="wf-arrow-pending" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill={WF.edge} fillOpacity={0.45} />
              </marker>
            </defs>

            {EDGES.map(([from, to]) => {
              // The only edge that has not run yet is the one past the gate.
              const pending = from === "gate";
              return (
                <path
                  key={`${from}-${to}`}
                  d={edgePath(from, to)}
                  fill="none"
                  markerEnd={`url(#${pending ? "wf-arrow-pending" : "wf-arrow"})`}
                  stroke={WF.edge}
                  strokeOpacity={pending ? 0.45 : 1}
                  strokeWidth={1}
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
                {/* Handles. React Flow draws these little collars where an edge
                    meets a node, and their absence is most of why a hand-drawn
                    graph reads as a sketch next to the real editor. */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: WF.nodeBg, border: `1.5px solid ${WF.edge}` }}
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full"
                  style={{ background: WF.nodeBg, border: `1.5px solid ${WF.edge}` }}
                />

                <div
                  className={`px-2.5 py-2 ${waiting ? "wf-gate-pulse" : ""} ${held ? "opacity-45" : ""}`}
                  style={{
                    background: WF.nodeBg,
                    borderStyle: "solid",
                    borderTopWidth: 2,
                    borderRightWidth: 2,
                    borderBottomWidth: 2,
                    borderLeftWidth: 4,
                    borderTopColor: waiting ? kind.color : WF.nodeBorder,
                    borderRightColor: waiting ? kind.color : WF.nodeBorder,
                    borderBottomColor: waiting ? kind.color : WF.nodeBorder,
                    borderLeftColor: kind.color,
                    borderRadius: 10,
                    boxShadow: waiting ? `0 0 0 2px ${kind.color}33` : "0 1px 3px rgba(0,0,0,.35)",
                  }}
                >
                  <p
                    className="font-mono text-[8.5px] uppercase leading-none tracking-[0.16em]"
                    style={{ color: kind.color }}
                  >
                    {kind.label}
                  </p>
                  <p
                    className="mt-1 truncate font-mono text-[10.5px] leading-tight"
                    style={{ color: WF.nodeText }}
                  >
                    {n.label}
                  </p>
                  {/* The editor's copy-the-reference chip. Decorative here — there
                      is nothing to copy on a landing page — hence aria-hidden. */}
                  {n.kind !== "gate" && (
                    <span
                      aria-hidden="true"
                      className="mt-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-px font-mono text-[8px]"
                      style={{ color: "var(--color-signal)", background: "rgba(34,211,238,0.14)" }}
                    >
                      ⧉ output
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* The one thing a person has to do. Called out rather than left as a
              node among nodes — a gate nobody notices is a workflow that stalls.
              Sits above the gate, not beside it: at this canvas width there is no
              room to its right without running off the edge. */}
          <span
            className="absolute left-1/2 -translate-x-1/2 -translate-y-full pb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-signal"
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
