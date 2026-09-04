import { COPY } from "../../lib/i18n";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";

/*
 * The roadmap copy lives in lib/i18n now, with the rest of the page's voice.
 * Worth keeping the provenance: the three items were verified against LAAM's
 * artifacts rather than its changelog headings, and one of them was wrong in the
 * product's own favour until a code-level re-check — audit_log carries role
 * changes and user enable/disable too, not just writes and token grants.
 */
export function Status() {
  return (
    <Section id="status">
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Eyebrow>{COPY.status.eyebrow}</Eyebrow>
          <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
            {COPY.status.heading}
          </h2>
          <p className="reveal mt-7 max-w-xl text-[length:var(--text-lead)] text-muted">
            <span className="text-ink">{COPY.status.lead.ink}</span> {COPY.status.lead.rest}
          </p>

          <dl className="reveal mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {COPY.status.facts.map((fact) => {
              /* One fact answers the objection the whole page is arguing against,
                 and it is the only one wearing the reserved colour. It used to be
                 set at the same size as the other three, which meant the colour
                 was being SAVED rather than spent — five small marks across the
                 page, none of them large enough to register at a glance. It gets
                 the weight here instead, and the other three read as its context. */
              const isCost = fact.value === "$0";
              return (
                <div
                  key={fact.label}
                  className="relative flex flex-col justify-between bg-void p-5"
                  style={
                    isCost
                      ? {
                          backgroundImage:
                            "radial-gradient(120% 100% at 0% 100%, color-mix(in oklab, var(--color-free) 9%, transparent), transparent 70%)",
                        }
                      : undefined
                  }
                >
                  <dt
                    className={`font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.14em] ${
                      isCost ? "text-free" : "text-muted"
                    }`}
                  >
                    {fact.label}
                  </dt>
                  <dd
                    className={`font-display font-bold [font-stretch:118%] ${
                      isCost
                        ? "mt-4 text-free text-[clamp(2.75rem,1.6rem+3.4vw,4.5rem)] leading-[0.85]"
                        : "mt-3 text-2xl text-ink"
                    }`}
                  >
                    {fact.value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="reveal border border-line bg-panel/40 p-8">
          <Eyebrow tone="trace">{COPY.status.nextLabel}</Eyebrow>
          <ul className="mt-7 space-y-5">
            {COPY.status.ahead.map((item) => (
              <li key={item} className="flex gap-4 border-b border-line pb-5 last:border-0 last:pb-0">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-trace" />
                <span className="text-[0.95rem] text-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
