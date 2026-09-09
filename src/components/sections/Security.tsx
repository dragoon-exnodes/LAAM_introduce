import { COPY } from "../../lib/i18n";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";

/**
 * Security & Control — three pillars, then what they add up to.
 *
 * The three questions in the intro are set large and framed on their own,
 * because they are the objection a buyer already has before reading the pillars.
 * The section works by stating the objection louder than the answer.
 */
export function Security() {
  const [first, second, third] = COPY.security.pillars;

  return (
    <Section id="security">
      <header className="max-w-4xl">
        <Eyebrow scramble>{COPY.security.eyebrow}</Eyebrow>
        <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
          {COPY.security.heading}
        </h2>

        <p className="reveal mt-6 max-w-2xl text-[length:var(--text-lead)] text-muted">
          {COPY.security.lead}
        </p>
        <p className="reveal mt-6 max-w-3xl border-l-2 border-signal pl-6 text-2xl leading-snug text-ink sm:text-3xl">
          {COPY.security.questions}
        </p>
        <p className="reveal mt-7 max-w-2xl text-[length:var(--text-lead)] text-muted">
          {COPY.security.leadAfter}
        </p>
      </header>

      {/*
       * Two up, then one across — not three equal columns.
       *
       * Three columns was the obvious grid and it was wrong twice. It left a
       * 200px void under the first pillar, which has one paragraph where the
       * others have two; and it gave equal width to a claim that is not equal.
       * Controlled Data Access is the pillar that answers the actual objection —
       * what can the AI reach, and what stops it — and it carries the offboarding
       * story as well. Giving it the full width beneath the other two lets it be
       * as long as it is, and says which of the three is load-bearing.
       */}
      <div className="mt-16 grid gap-px border border-line bg-line">
        <div className="grid gap-px bg-line md:grid-cols-2">
          <Pillar pillar={first} />
          <Pillar pillar={second} />
        </div>
        <Pillar pillar={third} wide />
      </div>

      <div className="reveal mt-8 border border-line bg-panel/40 p-7 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <h3 className="text-2xl leading-snug text-ink">{COPY.security.summary.ink}</h3>
            <p className="mt-4 font-mono text-[length:var(--text-data)] uppercase tracking-[0.14em] text-signal">
              {COPY.security.summary.tagline}
            </p>
          </div>

          <ul className="grid gap-3 border-t border-line pt-6 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {COPY.security.summary.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3 text-[0.9rem] text-ink/90">
                <span className="mt-[0.55em] h-1 w-1 shrink-0 bg-signal" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

type PillarCopy = (typeof COPY.security.pillars)[number];

/**
 * Corner brackets, and they are the one piece of ornament in this section that
 * is not ornament: `index.css` describes them as how "the page frames things the
 * way an instrument frames a target". Framing is the subject here — this is the
 * section about what the AI is allowed to reach — so the pillars are the one
 * place outside the console where the mark actually means what it depicts.
 */
function Pillar({ pillar, wide = false }: { pillar: PillarCopy; wide?: boolean }) {
  return (
    <article className="reveal bracket relative bg-void p-7 lg:p-9">
      <h3 className="text-xl leading-snug text-ink">{pillar.title}</h3>
      <div className={`mt-5 space-y-4 ${wide ? "md:columns-2 md:gap-12 md:space-y-0" : ""}`}>
        {pillar.body.map((paragraph) => (
          <p
            key={paragraph}
            className={`max-w-[58ch] text-[0.95rem] text-muted ${wide ? "md:break-inside-avoid md:[&+p]:mt-4" : ""}`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
