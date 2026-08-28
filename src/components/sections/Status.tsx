import { STATUS_FACTS } from "../../lib/content";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";

const AHEAD = [
  "Wider multi-machine collector",
  "Per-user chat with smart routing",
  "Tailscale, hardening, full audit trail",
] as const;

export function Status() {
  return (
    <Section>
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Eyebrow>Where it stands</Eyebrow>
          <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
            An internal tool, in daily use
          </h2>
          <p className="reveal mt-7 max-w-xl text-[length:var(--text-lead)] text-muted">
            LAAM was built for our own engineers and it runs on our own machines. It is not a hosted
            product and we are not pretending otherwise — what we can show you is a working system, the
            decisions behind it, and what it would take to stand one up for your team.
          </p>

          <dl className="reveal mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {STATUS_FACTS.map((fact) => (
              <div key={fact.label} className="bg-void p-5">
                <dt className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.14em] text-faint">
                  {fact.label}
                </dt>
                {/* The cost figure is the one fact that gets the reserved colour. */}
                <dd
                  className={`mt-3 font-display text-2xl font-bold [font-stretch:118%] ${
                    fact.value === "$0" ? "text-free" : "text-ink"
                  }`}
                >
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal border border-line bg-panel/40 p-8">
          <Eyebrow tone="trace">Next</Eyebrow>
          <ul className="mt-7 space-y-5">
            {AHEAD.map((item) => (
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
