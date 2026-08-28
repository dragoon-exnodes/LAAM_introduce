import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";
import { WorkflowDiagram } from "./WorkflowDiagram";

const GUARANTEES = [
  {
    label: "Durable",
    body: "A run that dies mid-flight resumes at the node it reached. Steps are idempotent, so nothing fires twice.",
  },
  {
    label: "Gated",
    body: "Every write pauses on a confirmation card. Sending mail or messages is additionally bound to a recipient allowlist.",
  },
  {
    label: "Rehearsed",
    body: "Draft graphs dry-run against real data before you save them, so the first real run isn't the first run.",
  },
] as const;

export function Workflows() {
  return (
    <Section id="workflows">
      <header className="max-w-4xl">
        <Eyebrow tone="signal">/workflows</Eyebrow>
        <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
          Nothing irreversible happens without you
        </h2>
        <p className="reveal mt-7 text-[length:var(--text-lead)] text-muted">
          Branches that don't depend on each other run at the same time and converge on one synthesis
          step. Everything up to the gate is unattended. Nothing past it happens without a person.
        </p>
      </header>

      <div className="reveal mt-14 border border-line bg-panel/35 p-5 sm:p-8">
        <WorkflowDiagram />
      </div>

      <dl className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
        {GUARANTEES.map((item) => (
          <div key={item.label} className="reveal bg-void p-7">
            <dt className="font-mono text-[length:var(--text-data)] uppercase tracking-[0.18em] text-signal">
              {item.label}
            </dt>
            <dd className="mt-4 text-[0.95rem] text-muted">{item.body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
