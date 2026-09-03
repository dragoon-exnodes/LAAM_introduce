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
          so it gets the exact panel treatment Evidence and Status already use —
          bg-panel/40, tone="trace" — not a one-off. A different opacity or tone
          here would have fixed the "bare paragraph" problem while creating a new,
          quieter version of it: a panel that LOOKS like the others' panels but
          isn't actually built from the same values. */}
      <div className="reveal mt-8 border border-line bg-panel/40 p-7 lg:p-10">
        <Eyebrow tone="trace">The answer</Eyebrow>
        {/* The paragraph alone left the right two-thirds of a full-width panel
            empty — every other full-width panel on the page (the scoreboards in
            Evidence) fills that space with content, not air. "All three" is a
            literal claim, so the fix is to actually enumerate them: the same
            three routes from the grid above, marked resolved with the ✓ idiom
            this page already uses for a completed check (BootSequence, the
            write-gate steps) — proof of the sentence, not a decoration next to it. */}
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_15rem] lg:gap-14">
          <p className="text-[length:var(--text-lead)]">
            <span className="text-ink">
              LAAM answers all three from the transcripts your agents already
              write to disk.
            </span>{" "}
            <span className="text-muted">
              Point it at a machine and it starts reporting — there is nothing
              to add to the agent side.
            </span>
          </p>
          <ul className="space-y-2.5 border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            {PROBLEMS.map((problem) => (
              <li
                key={problem.route}
                className="flex items-center gap-2.5 font-mono text-[length:var(--text-data)] uppercase tracking-[0.12em] text-trace"
              >
                <span className="text-signal">✓</span>
                {problem.route}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
