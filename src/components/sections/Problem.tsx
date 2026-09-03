import { PROBLEMS } from "../../lib/content";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";

export function Problem() {
  return (
    <Section id="watch">
      <header className="max-w-4xl">
        <Eyebrow>Why teams reach for it</Eyebrow>
        <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
          What breaks when agents outnumber operators
        </h2>
      </header>

      <ol className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
        {PROBLEMS.map((problem) => (
          <li key={problem.route} className="reveal bg-void p-7 lg:p-9">
            <Eyebrow tone="signal">{problem.route}</Eyebrow>
            <h3 className="mt-5 text-xl leading-[1.15] text-ink [font-stretch:110%]">
              {problem.title}
            </h3>
            <p className="mt-4 text-[0.95rem] text-muted">{problem.body}</p>
          </li>
        ))}
      </ol>

      {/* Was a bare paragraph with a left border — the single most generic pull-
          quote pattern on the web, and the one thing on the page not framed as a
          panel. The grid above it is a bordered console readout; this answers it,
          so it gets the same bg-panel/84 treatment the scoreboard panels use in
          Evidence, not a floating aside. Eyebrow ties it back to the "route"
          labels on the three cards it's resolving. */}
      <div className="reveal mt-8 border border-line bg-panel/84 p-7 lg:p-10">
        <Eyebrow tone="signal">The answer</Eyebrow>
        <p className="mt-4 max-w-2xl text-[length:var(--text-lead)]">
          <span className="text-ink">
            LAAM answers all three from the transcripts your agents already
            write to disk.
          </span>{" "}
          <span className="text-muted">
            Point it at a machine and it starts reporting — there is nothing to
            add to the agent side.
          </span>
        </p>
      </div>
    </Section>
  );
}
