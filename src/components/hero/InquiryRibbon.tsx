import { INQUIRIES, STATE_COLOR } from "../../lib/inquiry";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { COPY } from "../../lib/i18n";

/**
 * The page's heartbeat: questions coming in, in the words people asked them.
 *
 * This was a marquee of agent sessions with running timers. Two things made it
 * worth rebuilding rather than relabelling. The obvious one is that sessions
 * were the old thesis. The other is that this strip is the page's best argument
 * for a claim the copy can only assert — that the assistant carries no
 * assumptions about your trade — because six questions from six lines of
 * business make that case faster than a sentence about being domain-agnostic.
 *
 * Note what is NOT here any more: a ticking clock. The old ribbon's timers had
 * to advance because "we watch this run second by second" was the claim. The
 * claim now is that a question gets an answer, so a finished lookup count says
 * more than a number that keeps climbing.
 */
export function InquiryRibbon() {
  const reduced = useReducedMotion();

  // Doubled so the translation can loop seamlessly.
  const lane = [...INQUIRIES, ...INQUIRIES];

  return (
    <div className="relative overflow-hidden border-y border-line bg-panel/60">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-void to-transparent" />

      <ul
        className={`flex w-max items-center gap-10 py-3 ${reduced ? "" : "animate-[ribbon_58s_linear_infinite]"}`}
      >
        {lane.map((inquiry, index) => {
          // Zipped by index against the copy, the same arrangement `content.ts`
          // uses for the channels: structure here, prose in the locale.
          const copy = COPY.inquiries.items[index % INQUIRIES.length];
          const color = STATE_COLOR[inquiry.state];

          return (
            <li
              key={`${inquiry.id}-${index}`}
              className="flex shrink-0 items-center gap-3 whitespace-nowrap"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: color }}
                aria-hidden="true"
              />
              <span className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.14em] text-faint">
                {copy.domain}
              </span>
              {/* The question keeps the page's body face rather than the mono
                  used for every id and label around it. It is the one thing in
                  this strip a person said, and it should not look like a field
                  value. */}
              <span className="text-[0.82rem] text-ink">“{copy.question}”</span>
              <span className="font-mono text-[length:var(--text-eyebrow)] tabular-nums text-muted">
                {inquiry.steps} {COPY.inquiries.stepsSuffix}
              </span>
              <span className="font-mono text-[length:var(--text-eyebrow)] text-faint">
                {inquiry.source}
              </span>
              <span
                className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.16em]"
                style={{ color }}
              >
                {COPY.inquiries.states[inquiry.state]}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
