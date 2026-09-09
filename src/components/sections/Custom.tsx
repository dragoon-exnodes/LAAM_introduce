import { COPY } from "../../lib/i18n";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";

/**
 * Custom for Your Business — the rollout argument, closing on the contrast quote.
 *
 * The quote is the only thing on this page set centred, large, and with no frame
 * around it. That is deliberate and it is the only one: it is the last sentence
 * before the CTA, and it works by being the one thing that is not inside an
 * instrument.
 */
export function Custom() {
  return (
    <Section id="custom">
      <header className="max-w-4xl">
        <Eyebrow scramble>{COPY.custom.eyebrow}</Eyebrow>
        <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
          {COPY.custom.heading}
        </h2>
        <p className="reveal mt-6 max-w-2xl text-[length:var(--text-lead)] text-muted">
          {COPY.custom.lead}
        </p>
      </header>

      <ol className="mt-16 grid gap-px border border-line bg-line lg:grid-cols-3">
        {COPY.custom.blocks.map((block) => (
          <li key={block.title} className="reveal flex flex-col bg-void">
            <div className="flex-1 p-7 lg:p-9">
              <h3 className="text-xl leading-snug text-ink">{block.title}</h3>
              <p className="mt-5 max-w-[46ch] text-[0.95rem] text-muted">{block.body}</p>
            </div>

            {/* The two list blocks are an inventory — the systems a rollout has to
                reach, the workflows it starts from — so they are set the way this
                page sets every other enumeration of real things: mono, one per
                row, divided by the hairline rather than bulleted. That also gives
                the third block's closing line a matching floor, so the three
                cells end on the same structure instead of trailing off ragged. */}
            {"items" in block && block.items && (
              <ul className="divide-y divide-line border-t border-line">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="px-7 py-3 font-mono text-[length:var(--text-data)] text-ink/90 lg:px-9"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {"note" in block && block.note && (
              <p className="border-t border-line bg-panel-2 p-7 text-[0.95rem] leading-relaxed text-ink lg:p-9">
                {block.note}
              </p>
            )}
          </li>
        ))}
      </ol>

      {/*
       * The section's closer, and three things were wrong with it.
       *
       * It was the only large type on this page NOT in the display face.
       * `index.css` gives `font-display` to `h1, h2, h3` and nothing else, and
       * this is a `<p>` — so it rendered in IBM Plex Sans at heading size and
       * read as body copy blown up, next to an `h2` in Archivo two screens above.
       * The display face is applied here explicitly.
       *
       * It also wrapped ragged: a `<p>` gets `text-wrap: pretty`, not the
       * `balance` the headings get, so the first line broke as "YOUR BUSINESS
       * SHOULDN'T ADAPT / TO AI." and left an orphan.
       *
       * And both lines were the same size, so the only thing separating the
       * rejected idea from the asserted one was a colour step. Now the scale
       * carries it: the thing the page is arguing against is small and dim, the
       * thing it asserts is the largest type in the section. Hierarchy through
       * scale contrast, not through a second accent colour.
       *
       * The dim line is `text-muted`, never `text-faint`: tokens.css is explicit
       * that faint is not a third text colour — it is for marks carrying no
       * information of their own, and it misses WCAG at every size set here.
       */}
      <blockquote className="reveal mx-auto mt-32 max-w-4xl text-center">
        <p className="mx-auto max-w-xl text-balance text-base uppercase tracking-[0.14em] text-muted sm:text-lg">
          {COPY.custom.quote[0]}
        </p>
        {/* `--leading-display` rather than a literal: Vietnamese uppercase stacks
            a tone mark over a circumflex and needs a taller line box, and that
            token is already keyed off `:lang`. */}
        <p className="mt-7 text-balance font-display text-[length:var(--text-hero)] font-bold uppercase leading-[var(--leading-display)] tracking-[-0.02em] text-ink [font-stretch:118%]">
          {COPY.custom.quote[1]}
        </p>
      </blockquote>
    </Section>
  );
}
