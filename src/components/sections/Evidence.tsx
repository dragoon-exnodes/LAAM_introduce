import { useEffect, useRef } from "react";
import { BENCHMARK, EVIDENCE, RELIABILITY } from "../../lib/content";
import { countUp, fillBarsOnScroll } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";

export function Evidence() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const cleanups = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-count]"),
    ).map((el) => countUp(el, Number(el.dataset.count), reduced));
    cleanups.push(fillBarsOnScroll(scope, reduced));

    return () => cleanups.forEach((fn) => fn());
  }, [reduced]);

  return (
    <Section id="evidence">
      <header className="max-w-4xl">
        <Eyebrow tone="trace">Measured, not asserted</Eyebrow>
        {/* Framing, not substance. The numbers and the stories are unchanged —
            what moved is what they are evidence OF. "Three things we got wrong"
            led with the failure; the same three findings are actually proof that
            the team measures behaviour it could not have reasoned its way to,
            which is the harder and more useful capability to have. */}
        <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
          Three bugs only a running system reveals
        </h2>
        <p className="reveal mt-7 text-[length:var(--text-lead)] text-muted">
          Each was caught by running the product against a real database rather
          than reasoning about it, root-caused, fixed, and then re-measured.
          That loop is why the numbers below are worth reading at all.
        </p>
      </header>

      {/* Bound to `root` rather than to Section's own internal ref: Section is a
          plain function component and doesn't forward one, and the two scoreboard
          blocks below need to be in scope alongside the count-up cards for their
          progress bars to be found by the same query. */}
      <div ref={root}>
        <div className="mt-14 space-y-px border border-line bg-line">
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
                <p className="mt-2 text-[0.85rem] text-faint">
                  {item.before.caption}
                </p>
                <p className="mt-5 border-t border-line pt-4 font-mono text-[length:var(--text-data)] text-trace">
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
                  <span
                    className="relative h-[3px] flex-1 bg-line"
                    aria-hidden="true"
                  >
                    <span
                      className="absolute inset-y-0 left-0 overflow-hidden"
                      style={{ width: `${Math.max(row.score, 1.5)}%` }}
                    >
                      <span
                        data-bar
                        className={`block h-full w-full ${row.score === 0 ? "bg-alert" : "bg-signal"}`}
                      />
                    </span>
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
            Average {BENCHMARK.average}% across these three. The failing row
            stays on the board because a number you can check is worth more than
            one you cannot — and because the case that failed is the one you
            would want named before you rely on this, not after. It is a dated
            measurement, not a live gauge: the honest thing to say is what the
            run found, not what we assume still holds.
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
              <div
                key={row.label}
                className="flex flex-wrap items-center gap-x-4 gap-y-1"
              >
                <dt className="w-40 shrink-0 font-mono text-[length:var(--text-data)] text-muted">
                  {row.label}
                </dt>
                <dd className="flex flex-1 items-center gap-4">
                  <span
                    className="relative h-[3px] flex-1 bg-line"
                    aria-hidden="true"
                  >
                    <span
                      className="absolute inset-y-0 left-0 overflow-hidden"
                      style={{ width: `${row.score}%` }}
                    >
                      <span
                        data-bar
                        className={`block h-full w-full ${row.score < 70 ? "bg-alert" : "bg-signal"}`}
                      />
                    </span>
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
            Grounding is the one to read: it asks whether the answer carries the
            exact value the tool returned rather than a paraphrase of it. It is
            the strictest of the seven and the one that decides whether an
            answer can be trusted, so it is the one we hold ourselves to and
            keep on the board.
          </p>
        </div>
      </div>
    </Section>
  );
}
