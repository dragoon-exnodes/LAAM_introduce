import { useEffect, useState } from "react";
import { INQUIRIES, FEATURED_INDEX } from "../../lib/inquiry";
import { CYCLE_MS, modeAt } from "../../lib/constellation";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { COPY } from "../../lib/i18n";

/**
 * The readout laid over the scope: one question, and what answering it took.
 *
 * It used to be a run timer — elapsed, model, tool calls — because the page's
 * claim was that LAAM watches a run second by second. The claim changed, so the
 * instrument did: what a visitor should take from this box now is that a
 * question in their own words reaches their own figures.
 *
 * The phase label is driven by `modeAt()`, the SAME scripted turn the
 * constellation behind it plays. That is the point of reusing it rather than
 * running a second timer: when the ring goes blue-white and the beams race
 * inward, this says "looking it up", and when the ring turns gold it says
 * "answering". Two independent clocks would drift within a minute and the box
 * would be narrating a turn the picture is not playing.
 */
const FEATURED = INQUIRIES[FEATURED_INDEX];

export function ScopeReadout() {
  const reduced = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    // Coarser than a frame on purpose — this drives three words, and the
    // constellation is already carrying the continuous motion.
    const id = window.setInterval(() => setElapsed((performance.now() - start) % CYCLE_MS), 200);
    return () => window.clearInterval(id);
  }, [reduced]);

  const mode = reduced ? "idle" : modeAt(elapsed);
  const phase = COPY.hero.phases[mode];
  const featuredCopy = COPY.inquiries.items[FEATURED_INDEX];

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
      {/* Scrims: the readout has to stay legible over whatever the scene is doing. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-void/85 to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void/92 to-transparent"
      />
      <div className="relative flex items-start justify-between gap-4">
        <span className="flex items-center gap-2 font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-signal">
          <span className="relative flex h-1.5 w-1.5">
            {!reduced && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          {phase}
        </span>
        <span className="font-mono text-[length:var(--text-eyebrow)] tracking-[0.14em] text-faint">
          {FEATURED.id}
        </span>
      </div>

      {/* Question and figures share one band rather than stacking. Stacked, they
          were two blocks eating the bottom third of a square box and crowding the
          ring above them; side by side they read as a single instrument line and
          give the constellation its room back. The question keeps its size, so it
          still leads — what changed is the direction, not the weighting. Stacks
          again below `sm`, where three columns of figures beside a sentence would
          leave neither of them readable. */}
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        {/* min-w-0 so a long question wraps inside the row instead of forcing it
            wider than the box. */}
        <p className="min-w-0 max-w-[26ch] text-balance text-[0.95rem] leading-snug text-ink sm:text-base">
          “{featuredCopy.question}”
        </p>

        <dl className="flex shrink-0 flex-wrap items-end gap-x-6 gap-y-2 font-mono text-[length:var(--text-eyebrow)] tracking-[0.12em]">
          <div>
            <dt className="uppercase text-muted">{COPY.hero.sourceLabel}</dt>
            <dd className="mt-1 text-ink">{FEATURED.source}</dd>
          </div>
          <div>
            <dt className="uppercase text-muted">{COPY.hero.lookupLabel}</dt>
            <dd className="mt-1 tabular-nums text-ink">{FEATURED.steps}</dd>
          </div>
          <div className="hidden sm:block">
            <dt className="uppercase text-muted">{COPY.hero.costLabel}</dt>
            <dd className="mt-1 text-free">$0.00</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
