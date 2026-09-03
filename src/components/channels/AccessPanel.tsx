import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

// Deliberately generic handles: these are fabricated permission records, and they
// should not read as claims about identifiable colleagues.
const PEOPLE = [
  { name: "a.bennett", role: "owner", tokens: 3 },
  { name: "b.doyle", role: "admin", tokens: 2 },
  { name: "c.fletcher", role: "member", tokens: 1 },
  { name: "d.harper", role: "viewer", tokens: 0 },
  { name: "e.mercer", role: "member", tokens: 2 },
  { name: "k.whitfield", role: "member", tokens: 1 },
] as const;

/** The one who leaves, so the panel can show what the headline promises. */
const LEAVER = "k.whitfield";

const ROLE_COLOR: Record<string, string> = {
  owner: "text-signal border-signal/40",
  admin: "text-trace border-trace-dim",
  member: "text-muted border-line-bright",
  viewer: "text-faint border-line",
  disabled: "text-alert border-alert/40",
};

/**
 * These are the real action names written to `audit_log` — note `role_change`,
 * not `role_changed`. A row is { id, userId, action, target, createdAt }.
 */
const AUDIT_BASE = [
  "token_issued_for · a.bennett",
  "role_change · d.harper → viewer",
  "agent_write · gmail_send · redacted",
] as const;

/** What the off-boarding writes, and what it revokes. */
const AUDIT_OFFBOARD = `user_disabled · ${LEAVER} · by a.bennett`;

/**
 * The panel plays an off-boarding on a loop.
 *
 * "Access that survives an off-boarding" was a claim sitting over a static list
 * of people — the one moment that proves it was the one thing not shown. Now the
 * account is disabled, its keys go to zero in the same beat, and the audit line
 * appears naming who did it. Revocation, blast radius and the paper trail are
 * three separate promises in the copy; this is all three in one action.
 */
const PHASES = [
  { state: "idle", ms: 2400 },
  { state: "disabling", ms: 900 },
  { state: "revoked", ms: 3400 },
] as const;

export function AccessPanel({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced || !active) return;
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), PHASES[phase].ms);
    return () => window.clearTimeout(id);
  }, [phase, active, reduced]);

  // Derived, not stored: leaving the panel costs no render and no reset effect.
  const state = active && !reduced ? PHASES[phase].state : "idle";
  const gone = state === "revoked";
  // Always four rows, with the off-boarding line LAST. Prepending on the event
  // would grow the block and shove the people list above it — the same jerk, one
  // panel over. Reserving the slot at the top instead left a visible hole under
  // the heading while it waited; at the bottom the reserved space falls into the
  // panel's own padding and reads as nothing at all.
  const audit = [...AUDIT_BASE, AUDIT_OFFBOARD];

  return (
    <PanelFrame route="/settings/access" status="rbac on" tone="signal">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Fixed row height, NOT flex-1. Sharing the leftover height means every
            row moves the moment anything else in the panel changes size — which
            is exactly what happened when the audit log grew a line. */}
        <ul>
          {PEOPLE.map((person) => {
            const leaving = person.name === LEAVER;
            const off = leaving && gone;
            const flashing = leaving && state === "disabling";
            const keys = off ? 0 : person.tokens;
            return (
              <li
                key={person.name}
                className="flex items-center justify-between gap-3 border-b border-line/60 py-5 transition-colors duration-300 last:border-0"
                style={flashing ? { background: "rgba(255,86,86,0.06)" } : undefined}
              >
                <span
                  className="font-mono text-[11px] transition-colors duration-500"
                  style={{ color: off ? "var(--color-faint)" : "var(--color-ink)" }}
                >
                  {person.name}
                </span>
                <span className="flex items-center gap-3">
                  {/* Keys as pips, not a number: the revocation has to be seen
                      going out, and "2 keys → 0 keys" is a value change you can
                      miss between two glances. */}
                  <span className="flex items-center gap-1" aria-hidden="true">
                    {Array.from({ length: person.tokens }).map((_, k) => (
                      <span
                        key={k}
                        className="h-1.5 w-1.5 rounded-full transition-all duration-500"
                        style={{
                          background: off ? "transparent" : "var(--color-trace)",
                          border: off ? "1px solid var(--color-line-bright)" : "1px solid transparent",
                          transitionDelay: off ? `${k * 90}ms` : "0ms",
                        }}
                      />
                    ))}
                  </span>
                  <span className="w-12 shrink-0 text-right font-mono text-[10px] tabular-nums text-faint">
                    {keys} {keys === 1 ? "key" : "keys"}
                  </span>
                  <span
                    className={`w-[4.5rem] shrink-0 border px-2 py-0.5 text-center font-mono text-[9px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                      ROLE_COLOR[off ? "disabled" : person.role]
                    }`}
                  >
                    {off ? "disabled" : person.role}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        {/* Sits directly under the roster, not pushed to the floor. `mt-auto` put
            the slack in the MIDDLE of the panel, which reads as a gap; collected
            at the bottom instead it reads as the frame's own padding. */}
        <div className="border-t border-line pt-3.5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">audit log</p>
          <ul className="space-y-1.5">
            {audit.map((entry, i) => {
              const isOffboard = i === audit.length - 1;
              return (
                <li
                  key={entry}
                  className="truncate font-mono text-[10px]"
                  style={{
                    color: isOffboard ? "var(--color-alert)" : "var(--color-muted)",
                    opacity: isOffboard && !gone ? 0 : 1,
                    transition: reduced ? undefined : "opacity 360ms var(--ease-out-expo)",
                  }}
                  aria-hidden={isOffboard && !gone}
                >
                  <span className="text-faint">›</span> {entry}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </PanelFrame>
  );
}
