import { useEffect, useRef } from "react";
import { COPY } from "../../lib/i18n";
import { countUp } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";

// The measured figures themselves — the same in every language, so they stay out
// of the dictionary. Only their captions are translated.
const EVIDENCE_FIGURES = [
  { value: 3, of: 15 },
  { value: 1, of: 1 },
  { value: 3, of: 17 },
] as const;

export function Evidence() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const cleanups = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-count]"),
    ).map((el) => countUp(el, Number(el.dataset.count), reduced));

    return () => cleanups.forEach((fn) => fn());
  }, [reduced]);

  return (
    <Section id="evidence">
      <header className="max-w-4xl">
        <Eyebrow tone="trace">{COPY.evidence.eyebrow}</Eyebrow>
        {/* Framing, not substance. The numbers and the stories are unchanged —
            what moved is what they are evidence OF. "Three things we got wrong"
            led with the failure; the same three findings are actually proof that
            the team measures behaviour it could not have reasoned its way to,
            which is the harder and more useful capability to have.

            "Three bugs only a running system reveals" was the second draft of that
            same mistake. It fixed the sentence and left the loudest word alone:
            set at the section size, the thing a skimmer actually reads was THREE
            BUGS. The claim underneath is about a method — that measuring finds
            what reasoning cannot — so the headline now makes that claim, and the
            findings arrive as its evidence rather than as the announcement. */}
        <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
          {COPY.evidence.heading}
        </h2>
        <p className="reveal mt-7 text-[length:var(--text-lead)] text-muted">
          <span className="text-ink">{COPY.evidence.lead.ink}</span>{" "}
          {COPY.evidence.lead.rest}
        </p>
      </header>

      {/* Bound to `root` rather than to Section's own internal ref: Section is a
          plain function component and doesn't forward one, and the count-up
          numbers in the cards below have to be inside the scope this queries. */}
      <div ref={root}>
        <div className="mt-14 space-y-px border border-line bg-line">
          {COPY.evidence.cards.map((item, i) => (
            <article
              key={item.measure}
              className="reveal grid gap-8 bg-void p-7 lg:grid-cols-[16rem_1fr] lg:gap-14 lg:p-10"
            >
              {/* The before/after weighting was inverted, and so were its colours.
                  Measured across the section, the three largest numerals on it were
                  3/15, 1/1 and 3/17 — set at 48px in the primary cyan, four times
                  the height and sixteen times the area of every good number on the
                  page, all of which sat at 12px. The section reported the fix in a
                  footnote and shouted how bad things were before it.

                  The colours were backwards by the palette's own definitions:
                  signal is "a live agent", the thing happening NOW, and trace is
                  "already happened, so it recedes from signal". A before-measurement
                  is the definition of already-happened; the state after the fix is
                  the one that is still true. Swapping them puts the accent on the
                  outcome without editing a single number — and the number itself
                  comes down to 36px, still the largest thing in the card, no longer
                  the largest thing in the section. */}
              <div>
                <Eyebrow>{item.measure}</Eyebrow>
                <p className="mt-4 flex items-baseline gap-1.5 font-display text-4xl font-bold tabular-nums [font-stretch:118%]">
                  <span data-count={EVIDENCE_FIGURES[i].value} className="text-trace">
                    0
                  </span>
                  <span className="text-xl text-faint">/{EVIDENCE_FIGURES[i].of}</span>
                </p>
                <p className="mt-2 text-[0.85rem] text-muted">
                  {item.caption}
                </p>
                <p className="mt-5 border-t border-line pt-4 font-mono text-[0.95rem] text-signal">
                  → {item.after}
                </p>
              </div>

              <div>
                <h3 className="text-xl leading-[1.15] text-ink [font-stretch:110%]">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-2xl text-[0.95rem] text-muted">
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* What replaced two published scoreboards.
2
            The grades were real and traceable, and printing them was a deliberate
            position — in a category where every claim is noise, a claim that costs
            something to make is the only one that carries. It was right about the
            reader it imagined and wrong about the reader it gets: this page's CTA
            books a walkthrough, so it has to survive a whole buying committee,
            including the people who never reach the sentence explaining why a
            strict 67% is a good number. They see a red 67 and the evaluation stops
            before it reaches anyone equipped to read it.

            So the numbers move to the room where someone can give them context,
            which is the thing the CTA is selling anyway. What stays is what the
            industry does publish and most competitors cannot match: the rigour,
            and the three post-mortems above. Every figure below is a count of how
            the measuring is done — not a score. */}
        <div className="reveal mt-10 border border-line bg-panel/40 p-7 lg:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Eyebrow tone="trace">{COPY.evidence.measurement.eyebrow}</Eyebrow>
            <span className="font-mono text-[length:var(--text-data)] text-muted">
              {COPY.evidence.measurement.note}
            </span>
          </div>

          <dl className="mt-8 grid gap-px border border-line bg-line lg:grid-cols-2">
            {COPY.evidence.measurement.suites.map((suite) => (
              <div key={suite.name} className="bg-void p-6 lg:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <dt className="text-lg text-ink [font-stretch:110%]">{suite.name}</dt>
                  <span className="font-mono text-[length:var(--text-data)] text-signal">
                    {suite.scale}
                  </span>
                </div>
                <dd className="mt-4 text-[0.95rem] text-muted">{suite.body}</dd>

                {suite.tags.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-2 border-t border-line pt-5">
                    {suite.tags.map((d) => (
                      <li
                        key={d}
                        className="border border-line-bright px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-trace"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </dl>

          <p className="mt-7 border-t border-line pt-5 text-[0.95rem] text-muted">
            <span className="text-ink">{COPY.evidence.measurement.footer.ink}</span>{" "}
            {COPY.evidence.measurement.footer.rest}
          </p>
        </div>

      </div>
    </Section>
  );
}
