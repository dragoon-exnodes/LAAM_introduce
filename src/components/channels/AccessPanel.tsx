import { PanelFrame } from "./PanelFrame";

// Deliberately generic handles: these are fabricated permission records, and they
// should not read as claims about identifiable colleagues.
const PEOPLE = [
  { name: "a.nguyen", role: "owner", tokens: 3 },
  { name: "b.le", role: "admin", tokens: 2 },
  { name: "c.vo", role: "member", tokens: 1 },
  { name: "d.pham", role: "viewer", tokens: 0 },
  { name: "e.hoang", role: "member", tokens: 2 },
  { name: "k.tran", role: "member", tokens: 1 },
] as const;

const ROLE_COLOR = {
  owner: "text-signal border-signal/40",
  admin: "text-trace border-trace-dim",
  member: "text-muted border-line-bright",
  viewer: "text-faint border-line",
} as const;

/**
 * These are the real action names written to `audit_log` — note `role_change`,
 * not `role_changed`. A row is { id, userId, action, target, createdAt }.
 */
const AUDIT = [
  "token_issued_for · a.nguyen",
  "role_change · d.pham → viewer",
  "user_disabled · k.tran",
  "agent_write · gmail_send · redacted",
] as const;

export function AccessPanel() {
  return (
    <PanelFrame route="/settings/access" status="rbac on" tone="signal">
      <div className="flex h-full flex-col gap-4">
        <ul className="space-y-px">
          {PEOPLE.map((person) => (
            <li
              key={person.name}
              className="flex items-center justify-between gap-3 border-b border-line/60 py-2.5 last:border-0"
            >
              <span className="font-mono text-[11px] text-ink">{person.name}</span>
              <span className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-faint">
                  {person.tokens} {person.tokens === 1 ? "key" : "keys"}
                </span>
                <span
                  className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] ${ROLE_COLOR[person.role]}`}
                >
                  {person.role}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto border-t border-line pt-3.5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">audit log</p>
          <ul className="space-y-1">
            {AUDIT.map((entry) => (
              <li key={entry} className="truncate font-mono text-[10px] text-muted">
                <span className="text-faint">›</span> {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PanelFrame>
  );
}
