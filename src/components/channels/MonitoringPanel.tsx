import { useEffect, useState } from "react";
import { SESSIONS, formatElapsed, sessionColor, sessionLabel } from "../../lib/telemetry";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

/** A 24-point load trace. Fixed values — the shape should be the same every visit. */
const TRACE = [8, 14, 11, 19, 26, 22, 31, 28, 37, 44, 39, 52, 47, 58, 66, 61, 55, 68, 74, 70, 81, 77, 88, 84];

export function MonitoringPanel({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced || !active) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [reduced, active]);

  const points = TRACE.map((value, index) => `${(index / (TRACE.length - 1)) * 100},${100 - value}`).join(" ");

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

        <div className="mt-auto">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              tool calls / hour
            </span>
            <span className="font-mono text-[11px] tabular-nums text-trace">+18%</span>
          </div>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-24 w-full lg:h-32"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="trace-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={`0,100 ${points} 100,100`} fill="url(#trace-fill)" />
            <polyline
              points={points}
              fill="none"
              stroke="var(--color-signal)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </PanelFrame>
  );
}
