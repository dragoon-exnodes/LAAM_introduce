import { useEffect, useState } from "react";
import { SESSIONS, formatElapsed, sessionColor, sessionLabel } from "../../lib/telemetry";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * The page's heartbeat: a marquee of live sessions whose timers actually advance.
 * The list is duplicated once so the translation can loop seamlessly.
 */
export function TelemetryRibbon() {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [reduced]);

  const lane = [...SESSIONS, ...SESSIONS];

  return (
    <div className="relative overflow-hidden border-y border-line bg-panel/90">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-void to-transparent" />

      <ul
        className={`flex w-max items-center gap-10 py-3 ${reduced ? "" : "animate-[ribbon_46s_linear_infinite]"}`}
      >
        {lane.map((session, index) => (
          <li key={`${session.id}-${index}`} className="flex shrink-0 items-center gap-3 whitespace-nowrap">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: sessionColor(session) }}
              aria-hidden="true"
            />
            <span className="font-mono text-[length:var(--text-eyebrow)] tracking-[0.12em] text-muted">
              sess-{session.id}
            </span>
            <span className="font-mono text-[length:var(--text-eyebrow)] text-faint">{session.project}</span>
            <span className="font-mono text-[length:var(--text-eyebrow)] tabular-nums text-ink">
              {formatElapsed(session.seed + (session.status === "done" ? 0 : tick))}
            </span>
            <span className="font-mono text-[length:var(--text-eyebrow)] text-faint">
              {session.tools} tools
            </span>
            <span
              className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.16em]"
              style={{ color: sessionColor(session) }}
            >
              {sessionLabel(session)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
