import { useEffect, useState } from "react";
import { SESSIONS, formatElapsed } from "../../lib/telemetry";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * The scope features one real row from the same session list the ribbon and the
 * monitoring panel render. Every field here used to be re-typed by hand against
 * that row, and the model had already drifted apart from it: the hero called
 * sess-4f2a9c a local model while the telemetry called it a Claude one — the same
 * session, two answers, one page. Reading the row is the only way that stays true.
 */
const FEATURED = SESSIONS[0];

/**
 * The readout laid over the scope. It ticks because the claim on this page is
 * that LAAM watches a run second by second — a frozen number would undercut it.
 */
export function ScopeReadout() {
  const reduced = useReducedMotion();
  const [elapsed, setElapsed] = useState(FEATURED.seed);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
      {/* Scrims: the readout has to stay legible over whatever the scene is doing. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-void/85 to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void/90 to-transparent"
      />
      <div className="flex items-start justify-between gap-4">
        <span className="flex items-center gap-2 font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-signal">
          <span className="relative flex h-1.5 w-1.5">
            {!reduced && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          session active
        </span>
        <span className="font-mono text-[length:var(--text-eyebrow)] tracking-[0.14em] text-faint">
          sess-{FEATURED.id}
        </span>
      </div>

      <dl className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 font-mono text-[length:var(--text-eyebrow)] tracking-[0.12em]">
        <div>
          <dt className="text-muted uppercase">elapsed</dt>
          <dd className="mt-1 text-base text-ink tabular-nums">{formatElapsed(elapsed)}</dd>
        </div>
        <div>
          <dt className="text-muted uppercase">model</dt>
          <dd className="mt-1 text-ink">{FEATURED.model}</dd>
        </div>
        <div>
          <dt className="text-muted uppercase">tool calls</dt>
          <dd className="mt-1 text-ink tabular-nums">{FEATURED.tools}</dd>
        </div>
        <div className="hidden sm:block">
          <dt className="text-muted uppercase">cost</dt>
          <dd className="mt-1 text-free">$0.00</dd>
        </div>
      </dl>
    </div>
  );
}
