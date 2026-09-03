import { useEffect, useRef } from "react";
import { BENCHMARK, EVIDENCE, RELIABILITY } from "../../lib/content";
import { countUp } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";

export function Evidence() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const cleanups = Array.from(scope.querySelectorAll<HTMLElement>("[data-count]")).map((el) =>
      countUp(el, Number(el.dataset.count), reduced),
    );

    return () => cleanups.forEach((fn) => fn());
  }, [reduced]);

  return (
    <Section id="evidence">
      <header className="max-w-4xl">
        <Eyebrow tone="trace">Measured, not asserted</Eyebrow>
        <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
          Three things we got wrong, with numbers
        </h2>
        <p className="reveal mt-7 text-[length:var(--text-lead)] text-muted">
          Every one of these was found by running the product against a real database, not by reasoning
          about it. The fixes are in the shipped build.
        </p>
      </header>

      <div ref={root} className="mt-14 space-y-px border border-line bg-line">
        {EVIDENCE.map((item) => (
          <article
            key={item.measure}
            className="reveal grid gap-8 bg-void p-7 lg:grid-cols-[16rem_1fr] lg:gap-14 lg:p-10"
          >
            <div>
              <Eyebrow>{item.measure}</Eyebrow>
              <p className="mt-4 flex items-baseline gap-1.5 font-display text-5xl font-bold tabular-nums [font-stretch:118%]">
                <span data-count={item.before.value} className="text-signal">
                  0
                </span>
                <span className="text-2xl text-faint">/{item.before.of}</span>
              </p>
              <p className="mt-2 text-[0.85rem] text-faint">{item.before.caption}</p>
              <p className="mt-5 border-t border-line pt-4 font-mono text-[length:var(--text-data)] text-trace">
                → {item.after}
              </p>
            </div>

            <div>
              <h3 className="text-xl leading-[1.15] text-ink [font-stretch:110%]">{item.title}</h3>
              <p className="mt-4 max-w-2xl text-[0.95rem] text-muted">{item.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="reveal mt-10 border border-line bg-panel/40 p-7 lg:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <Eyebrow tone="trace">Current scoreboard</Eyebrow>
          <span className="font-mono text-[length:var(--text-data)] text-faint">
            {BENCHMARK.caption}
          </span>
        </div>

        <dl className="mt-7 space-y-4">
          {BENCHMARK.rows.map((row) => (
            <div key={row.label} className="flex items-center gap-4">
              <dt className="w-40 shrink-0 font-mono text-[length:var(--text-data)] text-muted">
                {row.label}
              </dt>
              <dd className="flex flex-1 items-center gap-4">
                <span className="relative h-[3px] flex-1 bg-line" aria-hidden="true">
                  <span
                    className={`absolute inset-y-0 left-0 ${row.score === 0 ? "bg-alert" : "bg-signal"}`}
                    style={{ width: `${Math.max(row.score, 1.5)}%` }}
                  />
                </span>
                <span
                  className={`w-44 shrink-0 whitespace-nowrap text-right font-mono text-[length:var(--text-data)] tabular-nums ${
                    row.score === 0 ? "text-alert" : "text-ink"
                  }`}
                >
                  {row.detail}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-7 border-t border-line pt-5 text-[0.95rem] text-muted">
          Average {BENCHMARK.average}%. We publish the row that scores zero because a
          scoreboard without one is a brochure — and because knowing which case still
          fails is what tells you where the product is honest about its limits.
        </p>
      </div>

      {/* The behaviour suite is a second, wider measurement: not "did it pick the
          right tool out of sixty" but "did the whole loop behave" — scored per
          dimension over 85 runs. Same rule as above: the weak number stays. */}
      <div className="reveal mt-6 border border-line bg-panel/40 p-7 lg:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <Eyebrow tone="trace">Behaviour, by dimension</Eyebrow>
          <span className="font-mono text-[length:var(--text-data)] text-faint">
            {RELIABILITY.caption}
          </span>
        </div>

        <dl className="mt-7 space-y-4">
          {RELIABILITY.rows.map((row) => (
            <div key={row.label} className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <dt className="w-40 shrink-0 font-mono text-[length:var(--text-data)] text-muted">
                {row.label}
              </dt>
              <dd className="flex flex-1 items-center gap-4">
                <span className="relative h-[3px] flex-1 bg-line" aria-hidden="true">
                  <span
                    className={`absolute inset-y-0 left-0 ${row.score < 70 ? "bg-alert" : "bg-signal"}`}
                    style={{ width: `${row.score}%` }}
                  />
                </span>
                <span
                  className={`w-12 shrink-0 text-right font-mono text-[length:var(--text-data)] tabular-nums ${
                    row.score < 70 ? "text-alert" : "text-ink"
                  }`}
                >
                  {row.score}%
                </span>
              </dd>
              <p className="w-full pl-0 text-[0.8rem] text-faint sm:w-auto sm:basis-full sm:pl-44">
                {row.note}
              </p>
            </div>
          ))}
        </dl>

        <p className="mt-7 border-t border-line pt-5 text-[0.95rem] text-muted">
          Grounding is the one to read. It asks whether the answer actually carries the
          value the tool returned, rather than a paraphrase of it — the hardest of the
          seven, and the one we would rather be measured on than quietly drop.
        </p>
      </div>
    </Section>
  );
}
