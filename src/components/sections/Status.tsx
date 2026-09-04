import { STATUS_FACTS } from "../../lib/content";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";

/*
 * Verified against the artifacts, not the changelog headings — the previous list
 * named three things that had already shipped (the collector + /api/ingest +
 * machine registry; per-user chat with the cloud-first internal-model router;
 * the Tailscale Funnel/Serve runbook in docs/DEPLOYMENT.md), which undersold the
 * product to anyone who then saw it running. These three are genuinely open:
 *   - audit_log carries agent writes, token grants and user/role changes — but
 *     not every action. (This line itself claimed only the first two until a
 *     code-level re-check found role_change/user_disabled/user_enabled: the
 *     "verified" above was not, and the error ran against our own product.)
 *   - vision is wired on the local model path only, not the cloud one;
 *   - voice STT is the browser's Web Speech API, so it needs Chrome.
 */
const AHEAD = [
  // The parenthetical above undercounted what shipped: audit_log also carries
  // role_change, user_disabled and user_enabled. The gap is real — not every
  // action is audited — but a page arguing for honesty cannot get its own
  // self-criticism wrong, least of all in the direction of underselling.
  "Audit coverage beyond writes, token grants and user/role changes",
  // Worth reading against the chat copy: cloud is the path a deployment with a
  // key actually gets, so this gap is wider than "not just" implies.
  "Vision on the cloud model path, not just the local one",
  "Self-hosted speech-to-text, so voice stops needing Chrome",
] as const;

export function Status() {
  return (
    <Section id="status">
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
            {STATUS_FACTS.map((fact) => {
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
                      isCost ? "text-free" : "text-faint"
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
