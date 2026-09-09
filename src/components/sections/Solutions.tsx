import { COPY } from "../../lib/i18n";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";
import { DistanceTrack } from "../solutions/DistanceTrack";

/**
 * LAAM Solutions — four things that stand between a business and a decision,
 * each paired with what LAAM does about it.
 *
 * Two rules the cells follow, and both are subtractions.
 *
 * No route eyebrow over each title. The four labels this section used to carry
 * ("scattered data", "the queue") were editorial inventions set in the typeface
 * this page reserves for product nomenclature — the exact mistake `content.ts`
 * documents having already made once with `Telemetry` and `Recall`. A made-up
 * label dressed as a route is worse than no label: it teaches a reader a
 * vocabulary the product does not have.
 *
 * And the problem/answer split is carried by GROUND as well as by position: the
 * problem sits on the page's own void, the answer on a lit panel. That is the
 * page's existing language, where lit means something is running — and read down
 * the section, the lit halves form one continuous column beside four different
 * problems, which is the section's argument stated by the layout.
 */
export function Solutions() {
  return (
    <Section id="solutions">
      <header className="max-w-4xl">
        <Eyebrow scramble>{COPY.solutions.eyebrow}</Eyebrow>
        <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
          {COPY.solutions.heading}
        </h2>
        <p className="reveal mt-6 max-w-2xl text-[length:var(--text-lead)] text-muted">
          {COPY.solutions.lead}
        </p>
      </header>

      {/*
       * Four full-width ROWS, problem beside answer — the shape the marketing
       * brief drew (`ps-row`: problem | hairline | solution), rather than the 2x2
       * of stacked halves this used to be.
       *
       * Horizontal is the better reading for this content. Stacked, a reader met
       * a problem, then its answer, then dropped to the next cell and met another
       * problem — the pairing was there but you had to hold it in your head. Side
       * by side, each row IS the pairing, and the four answers line up into one
       * lit column running the height of the section.
       *
       * It also deletes a whole class of bug. The stacked version needed
       * `grid-rows-subgrid` to stop each cell splitting at its own content height;
       * here the two halves are simply two cells of the same grid row, so they
       * align because that is what a row is.
       *
       * Every hairline on this block is the 1px gap showing the `bg-line` ground
       * through — the outer `ol` gaps make the horizontal rules, each `li` gaps
       * make the vertical one. No child carries a border.
       */}
      <ol className="mt-14 grid gap-px border border-line bg-line">
        {COPY.solutions.items.map((item) => (
          <li key={item.title} className="reveal grid gap-px bg-line md:grid-cols-2">
            <div className="bg-void p-7 lg:p-10">
              <h3 className="max-w-[26ch] text-2xl leading-[1.12] text-ink">{item.title}</h3>
              <p className="mt-4 max-w-[52ch] text-[0.95rem] text-muted">{item.body}</p>
            </div>

            <div className="bg-panel-2 p-7 lg:p-10">
              <span className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.22em] text-signal">
                {COPY.solutions.whoLabel}
              </span>
              <p className="mt-3 max-w-[52ch] text-[0.95rem] text-ink">{item.answeredBy}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* The payoff panel. Its header runs as two columns rather than one narrow
          measure: the claim was set at body size, smaller than every heading
          around it, and the sentence explaining it sat in a 2xl column that left
          the right half of a very wide panel empty. Now the claim is display
          type on the left and its explanation sits beside it, so the header
          spans the panel and the diagram below gets the full width to be a
          layer in. */}
      <div className="reveal mt-8 border border-line bg-panel/40 p-7 lg:p-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h3 className="text-3xl leading-[1.1] text-ink sm:text-4xl">
            {COPY.solutions.answer.ink}
          </h3>
          <p className="max-w-[52ch] text-[length:var(--text-lead)] text-muted">
            {COPY.solutions.answer.rest}
          </p>
        </div>

        <DistanceTrack />
      </div>
    </Section>
  );
}
