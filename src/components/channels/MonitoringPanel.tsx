import { useEffect, useState } from "react";
import { SESSIONS, SUB_AGENTS, formatElapsed, sessionColor, sessionLabel } from "../../lib/telemetry";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

/*
 * Layout for the sub-agent tree, in the SVG's own coordinate space. The viewBox
 * keeps its aspect ratio (unlike a stretched one) so the curves stay curves at
 * any panel width.
 */
// The viewBox ratio IS the rendered ratio: the svg takes the panel's full width
// and derives its height from this box. Mismatch the ratio and `meet` shrinks the
// whole tree to fit the shorter axis, stranding it in the middle of empty space.
// Units are kept at roughly one-to-one with rendered pixels. With a small
// viewBox the svg scales up to the panel width and drags the type up with it —
// 7.5 units became ~16px, louder than the session rows above it.
const VB = { w: 620, h: 170 };
const ORCH = { x: 40, y: VB.h / 2 };
const CHILD_X = 250;
const ROW_H = 34;
const FIRST_Y = VB.h / 2 - ((SUB_AGENTS.length - 1) * ROW_H) / 2;

/** Out of the orchestrator, across, into the child — a wiring run, not a diagonal. */
function branch(y: number): string {
  const midX = (ORCH.x + CHILD_X) / 2;
  return `M ${ORCH.x + 6} ${ORCH.y} C ${midX} ${ORCH.y}, ${midX} ${y}, ${CHILD_X - 6} ${y}`;
}

export function MonitoringPanel({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced || !active) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [reduced, active]);

  return (
    <PanelFrame route="/monitoring" status="6 live" tone="signal">
      <div className="flex h-full flex-col gap-4">
        <ul className="space-y-px">
          {SESSIONS.map((session) => (
            <li
              key={session.id}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-line/60 py-2.5 last:border-0"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: sessionColor(session) }}
                aria-hidden="true"
              />
              <span className="truncate font-mono text-[11px] text-muted">
                {session.project}
                <span className="ml-2 text-faint">sess-{session.id}</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums text-ink">
                {formatElapsed(session.seed + (session.status === "done" ? 0 : tick))}
              </span>
              <span
                className="hidden font-mono text-[10px] uppercase tracking-[0.14em] sm:block"
                style={{ color: sessionColor(session) }}
              >
                {sessionLabel(session)}
              </span>
            </li>
          ))}
        </ul>

        {/* The panel's own first claim is "orchestrator -> sub-agent graph", and
            until now nothing here showed one — the slot held a sparkline, which
            every product on earth has. This is the shape LAAM reconstructs from a
            transcript, and it draws itself when the panel comes up: each branch
            strokes out to its child, and the child that is still running keeps a
            flowing dash while the finished ones settle to a static line. */}
        <div className="mt-auto" key={active ? "on" : "off"}>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              orchestrator · sub-agents
            </span>
            <span className="font-mono text-[11px] tabular-nums text-trace">
              {SUB_AGENTS.length} spawned
            </span>
          </div>

          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            className="w-full"
            role="img"
            aria-label={`An orchestrator session that spawned ${SUB_AGENTS.length} sub-agents; one is still running.`}
          >
            {SUB_AGENTS.map((sub, i) => {
              const y = FIRST_Y + i * ROW_H;
              const running = sub.status === "running";
              return (
                <g key={sub.id}>
                  <path
                    d={branch(y)}
                    fill="none"
                    stroke={running ? "var(--color-signal)" : "var(--color-line-bright)"}
                    strokeWidth={running ? 1.4 : 1}
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    style={
                      reduced
                        ? undefined
                        : {
                            strokeDasharray: running ? "4 4" : 1,
                            animation: running
                              ? // Once drawn, the running branch keeps flowing —
                                // the same dash treatment the product uses for a
                                // live edge on /graph.
                                `wf-edge-draw 560ms ease-out ${140 * i}ms backwards, tele-flow 900ms linear ${560 + 140 * i}ms infinite`
                              : `wf-edge-draw 560ms ease-out ${140 * i}ms backwards`,
                          }
                    }
                  />

                  <circle
                    cx={CHILD_X}
                    cy={y}
                    r={running ? 4.5 : 3.4}
                    fill={running ? "var(--color-signal)" : "var(--color-trace)"}
                    style={
                      reduced
                        ? undefined
                        : { animation: `tele-pop 320ms var(--ease-out-expo) ${420 + 140 * i}ms backwards` }
                    }
                  />

                  <text
                    x={CHILD_X + 14}
                    y={y - 2}
                    className="fill-[var(--color-muted)] font-mono"
                    style={{ fontSize: 11 }}
                  >
                    {sub.type}
                  </text>
                  <text
                    x={CHILD_X + 14}
                    y={y + 13}
                    className="fill-[var(--color-faint)] font-mono"
                    style={{ fontSize: 9.5 }}
                  >
                    {running ? "running" : `${sub.durationSec}s`}
                  </text>
                </g>
              );
            })}

            {/* The orchestrator itself, drawn last so it sits over the branches. */}
            <circle cx={ORCH.x} cy={ORCH.y} r={9} fill="var(--color-void)" stroke="var(--color-signal)" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
            <circle cx={ORCH.x} cy={ORCH.y} r={3} fill="var(--color-signal)" />
            <text x={ORCH.x} y={ORCH.y + 28} textAnchor="middle" className="fill-[var(--color-faint)] font-mono" style={{ fontSize: 9.5 }}>
              sess-4f2a9c
            </text>
          </svg>
        </div>

      </div>
    </PanelFrame>
  );
}
