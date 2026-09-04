import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

/**
 * A weekly refund review, drawn as the graph the assistant actually compiles
 * when someone describes that job in chat.
 *
 * It used to draw the shipped `multi-source-report-email` template with steps
 * named after the mechanism (`research_web`, `synthesis`), which showed how a
 * graph is shaped but not what one is for. This is the same shape doing a job a
 * buyer recognises, and it is the only place on the page where the MCP claim —
 * one line in the Connectors tab — is actually visible: two steps here read the
 * company's own database through a mounted server.
 *
 * It used to be a flat vertical list, which quietly contradicted the copy beside
 * it: the whole claim is "parallel DAG — fan-out, fan-in", and a single column
 * cannot show a fan-out. The three reads run at the same time and converge on
 * the node that writes the report, so that is what this draws.
 *
 * Node kind colours are LAAM's own (`NodesLibraryPanel.NODE_TYPES`), so a node
 * that is blue here is blue in the editor.
 */
const KIND = {
  agent: { color: "#2563eb", label: "agent" },
  connector: { color: "#06b6d4", label: "connector" },
  // `mcp` is a real node kind in the editor, not a variety of connector, and it
  // carries its own colour there (NODE_TYPES: #c026d3). Drawing it as a distinct
  // kind is the whole point of this graph: the two steps that read the business's
  // own database are visibly a different thing from the SaaS connector beside
  // them, and from the agents that reason over what they return.
  mcp: { color: "#c026d3", label: "mcp" },
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
  // Node width is ~24% of the canvas, matching the proportion the real editor
  // uses (~250px node in a ~1270px canvas). At the 34% they were before, the
  // seven boxes covered a third of the whole canvas by area and the three
  // parallel branches nearly touched — the graph read as a stack of cards
  // rather than as a graph, because the edges had no room to be seen.
  //
  // The canvas is still a viewport onto a graph, the way the editor's is: it
  // does not owe you the whole thing, and cropping the last node at the bottom
  // edge says "this continues" better than shrinking everything until it fits.
  //
  // The labels are a business question, not a demo. `research_laam` /
  // `research_web` / `synthesis` described the mechanism and left a buyer to
  // imagine the job; these describe the job — a weekly refund review that reads
  // the company's own database, picks up the related tickets, writes the report
  // and stops before sending it. Two of the three reads are `mcp` nodes, which
  // is the one capability this page otherwise sold in a single bullet: an
  // external server, mounted per user, queried as a first-class step in a graph.
  { id: "brief", label: "brief", kind: "agent", state: "done", x: 50, y: 6, w: 24 },
  { id: "r1", label: "staff_ranking", kind: "mcp", state: "done", x: 17, y: 29, w: 22 },
  { id: "r2", label: "store_totals", kind: "mcp", state: "done", x: 50, y: 29, w: 22 },
  { id: "r3", label: "open_tickets", kind: "connector", state: "done", x: 83, y: 29, w: 22 },
  { id: "synthesis", label: "compose_report", kind: "agent", state: "done", x: 50, y: 52, w: 24 },
  { id: "gate", label: "confirm send", kind: "gate", state: "waiting", x: 50, y: 75, w: 27 },
  { id: "send", label: "gmail_send", kind: "connector", state: "held", x: 50, y: 98, w: 24 },
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
/** Node box height as a percentage of the canvas. Edges anchor off this, so a
 *  stale value leaves them starting inside the box they should be leaving.
 *  Measured after the nodes were scaled down: 63px in a 480px canvas is 13.1%,
 *  and 15.8% in the 400px one the stacked layout floors at — 14 splits the two,
 *  since node height is fixed pixels while everything around it is a percentage. */
const NODE_H = 14;

/**
 * The run replays on a loop instead of the edges drawing once and freezing.
 *
 * A static graph cannot show the two things this panel claims: that the three
 * reads run AT THE SAME TIME, and that the run stops dead at the
 * write gate. Playing the run does both — and it earns continuous motion
 * honestly, where flowing every finished edge forever would just be saying a
 * completed run is still going.
 */
const PHASES: readonly { active: readonly string[]; ms: number }[] = [
  { active: ["brief"], ms: 900 },
  { active: ["r1", "r2", "r3"], ms: 1500 },
  { active: ["synthesis"], ms: 1100 },
  // The long one: the run is parked here until a person confirms.
  { active: ["gate"], ms: 2800 },
];

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
  const [phase, setPhase] = useState(0);

  // Advance the replay while the panel is the one on screen. Each phase sets its
  // own dwell, so the gate can hold far longer than a node that just runs.
  useEffect(() => {
    if (reduced || !active) return;
    const id = window.setTimeout(
      () => setPhase((p) => (p + 1) % PHASES.length),
      PHASES[phase].ms,
    );
    return () => window.clearTimeout(id);
  }, [phase, active, reduced]);

  // Off screen (or reduced motion) the graph shows its first phase rather than
  // freezing wherever the timer stopped — derived, not stored, so leaving the
  // panel costs no render.
  const shown = active && !reduced ? phase : 0;
  const activeIds = PHASES[shown].active;
  // Everything the run has already passed through in this pass.
  const doneIds = new Set(PHASES.slice(0, shown).flatMap((p) => p.active));

  return (
    <PanelFrame route="/workflows" status="run #418" tone="signal">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <dl className="grid shrink-0 grid-cols-3 gap-px border border-line bg-line">
          {[
            ["Workflow", "weekly-refund-review"],
            ["Trigger", "schedule"],
            ["Run", "resumable · 1 held"],
          ].map(([label, value]) => (
            <div key={label} className="bg-panel px-3 py-2.5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">{label}</dt>
              <dd className="mt-1 truncate font-mono text-[11px] text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        {/* The canvas. Dotted ground matches the editor's own background.
            The min-height is not cosmetic. Node POSITIONS are percentages of the
            canvas height while node HEIGHT is fixed pixels (~60px with its output
            chip), so the two only agree above a certain size: at the 106px this
            was getting on a stacked layout the rows overlapped each other, and at
            240px `research_web` still sat on top of `synthesis`. 25rem gives the
            15% row pitch about 60px, which is what a node actually occupies. The
            stacked frame is itself a min-height, so the panel grows to fit rather
            than clipping. It also
            CLIPS: the last node is meant to be cut by the bottom edge the way a
            viewport cuts a bigger graph. Without overflow-hidden it just spills
            over the caption underneath, which reads as broken, not as cropped. */}
        <div className="relative min-h-[25rem] flex-1 overflow-hidden rounded-sm border border-line bg-panel-2/40 [background-image:radial-gradient(circle,rgba(148,175,205,0.13)_1px,transparent_1px)] [background-size:14px_14px]">
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
              // An edge is live while the run is crossing INTO its target, spent
              // once the target is behind the run, and unlit before either.
              const flowing = !reduced && activeIds.includes(to);
              const spent = doneIds.has(to);
              // Nothing past the gate ever lights: the run parks there.
              const held = from === "gate";
              return (
                <path
                  key={`${from}-${to}`}
                  d={edgePath(from, to)}
                  fill="none"
                  markerEnd={`url(#${held || !spent ? "wf-arrow-pending" : "wf-arrow"})`}
                  stroke={flowing ? "var(--color-signal)" : WF.edge}
                  strokeOpacity={flowing ? 1 : spent ? 0.9 : 0.4}
                  strokeWidth={flowing ? 1.6 : 1}
                  vectorEffect="non-scaling-stroke"
                  style={
                    flowing
                      ? {
                          // Short dashes travelling toward the target for as long
                          // as the run is on this edge.
                          strokeDasharray: "3 3",
                          animation: "wf-edge-flow 420ms linear infinite",
                        }
                      : held
                        ? { strokeDasharray: "1.6 1.6" }
                        : undefined
                  }
                />
              );
            })}
          </svg>

          {NODES.map((n) => {
            const kind = KIND[n.kind];
            const isRunning = activeIds.includes(n.id);
            const hasRun = doneIds.has(n.id);
            // The gate is only "waiting on you" once the run has actually
            // reached it — before that it is just a node further down.
            const waiting = n.state === "waiting" && isRunning;
            // Anything the run has not touched yet sits back, including the send
            // step, which never lights because the gate holds the run.
            const held = !isRunning && !hasRun;
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
                  className={`relative px-2 py-1.5 ${
                    waiting ? "wf-gate-pulse" : isRunning ? "wf-node-running" : ""
                  }`}
                  style={{
                    background: WF.nodeBg,
                    borderStyle: "solid",
                    borderTopWidth: 2,
                    borderRightWidth: 2,
                    borderBottomWidth: 2,
                    borderLeftWidth: 4,
                    borderTopColor: isRunning ? kind.color : WF.nodeBorder,
                    borderRightColor: isRunning ? kind.color : WF.nodeBorder,
                    borderBottomColor: isRunning ? kind.color : WF.nodeBorder,
                    borderLeftColor: kind.color,
                    borderRadius: 10,
                    // The running halo is the ported .wf-node-running pulse, not a
                    // static ring, so this stays the resting shadow only.
                    boxShadow: "0 1px 3px rgba(0,0,0,.35)",
                    opacity: held ? 0.42 : 1,
                    transition: "opacity 320ms ease, border-color 320ms ease, box-shadow 320ms ease",
                  }}
                >
                  <p
                    className="font-mono text-[7.5px] uppercase leading-none tracking-[0.14em]"
                    style={{ color: kind.color }}
                  >
                    {kind.label}
                  </p>
                  <p
                    className="mt-0.5 truncate font-mono text-[9.5px] leading-tight"
                    style={{ color: WF.nodeText }}
                  >
                    {n.label}
                  </p>
                  {/* The editor's copy-the-reference chip. Decorative here — there
                      is nothing to copy on a landing page — hence aria-hidden. */}
                  {n.kind !== "gate" && (
                    <span
                      aria-hidden="true"
                      className="mt-1 inline-flex items-center gap-1 rounded px-1 py-px font-mono text-[7px]"
                      style={{ color: "var(--color-signal)", background: "rgba(34,211,238,0.14)" }}
                    >
                      ⧉ output
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* The editor puts up a chip while more than one node is executing. It is
              the clearest statement the graph makes about running in parallel, so
              it appears here for exactly the phase where that is true. */}
          {activeIds.length > 1 && (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-signal" style={{ background: "rgba(34,211,238,0.14)" }}>
              <span className="wf-run-dot h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              {activeIds.length} running in parallel
            </span>
          )}

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

        <p className="shrink-0 border-t border-line pt-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          2 steps read an external mcp datasource · 3 branches ran in parallel · resumes from the held node
        </p>
      </div>
    </PanelFrame>
  );
}
