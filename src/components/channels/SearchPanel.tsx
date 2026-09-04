import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

const QUERY = "pgvector";

/**
 * Real result shape from `GET /api/search?q=` — three groups, and each hit is a
 * POINTER, not an excerpt:
 *   session      { id, projectName, status, latestActivity }
 *   conversation { id, title, updatedAt }
 *   workflow     { id, name, status, updatedAt }
 *
 * An earlier version of this panel showed highlighted message-body snippets. That
 * was wrong and would have been a privacy claim the product deliberately does not
 * make: conversations are matched by title and returned as pointers, never as raw
 * message text. Sessions are org-shared; conversations and workflows are yours only.
 */
const GROUPS = [
  {
    kind: "sessions",
    note: "org-shared",
    hits: [
      { primary: "orbit.worker", meta: "running · sess-8b1e04" },
      { primary: "orbit.api", meta: "done · sess-b70d15" },
    ],
  },
  {
    kind: "conversations",
    note: "yours only",
    hits: [{ primary: "pgvector migration plan", meta: "updated 12 Aug" }],
  },
  {
    kind: "workflows",
    note: "yours only",
    hits: [{ primary: "digest-overnight-agents", meta: "active · updated 9 Aug" }],
  },
] as const;

const KIND_COLOR = {
  sessions: "text-signal",
  conversations: "text-trace",
  workflows: "text-ion",
} as const;

const TYPE_MS = 110;   // per character
const SETTLE_MS = 420; // between groups landing

/**
 * The query types itself and the groups land one after another.
 *
 * The panel's point is a boundary, not a search box: one query reaches three
 * places, and the two that are yours come back to you alone. A finished list
 * shows the three headings; watching them arrive separately is what makes the
 * ORG-SHARED / YOURS ONLY split land as a rule rather than a caption.
 */
export function SearchPanel({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  const typed = Math.min(QUERY.length, tick);
  const landed = Math.max(0, Math.floor((tick - QUERY.length) / (SETTLE_MS / TYPE_MS)));
  const done = QUERY.length + GROUPS.length * (SETTLE_MS / TYPE_MS);

  // Runs ONCE per activation and then holds. Looping it meant clearing the query
  // to retype, which left the whole panel blank for about a second at the top of
  // every cycle — that reads as broken, not as animated.
  useEffect(() => {
    if (reduced || !active || tick >= done) return;
    const id = window.setTimeout(() => setTick((t) => t + 1), TYPE_MS);
    return () => window.clearTimeout(id);
  }, [tick, active, reduced, done]);

  // No rewind on leaving: scrolling back should show the result that was already
  // found, not replay the search. Nothing here needs a reset effect.

  // Off screen (or reduced motion) the finished result stands, rather than a
  // half-typed query frozen mid-air.
  const query = reduced || !active ? QUERY : QUERY.slice(0, typed);
  const shown = reduced || !active ? GROUPS.length : landed;

  return (
    <PanelFrame route="/search" status="4 hits" tone="trace">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex items-center gap-2.5 border border-line-bright bg-panel-2 px-3.5 py-2.5">
          <span className="font-mono text-[11px] text-faint" aria-hidden="true">
            ⌕
          </span>
          <span className="font-mono text-[12px] text-ink">{query}</span>
          <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-signal" aria-hidden="true" />
        </div>

        {/* Every group is laid out from the first frame and only its OPACITY
            changes as it lands. Mounting them one at a time — or letting flex
            distribute the leftover height — re-positions the groups already on
            screen each time another arrives, which is the jerk: nothing drops a
            frame, the content just moves under you. */}
        <div className="space-y-5">
          {GROUPS.map((group, gi) => (
            <section
              key={group.kind}
              style={{
                opacity: gi < shown ? 1 : 0,
                transform: gi < shown || reduced ? "none" : "translate3d(0,6px,0)",
                transition: reduced ? undefined : "opacity 320ms var(--ease-out-expo), transform 320ms var(--ease-out-expo)",
              }}
              data-group={gi}
              aria-hidden={gi >= shown}
            >
              <div className="flex items-baseline gap-2.5 border-b border-line pb-1.5">
                <h4
                  className={`font-mono text-[9px] uppercase tracking-[0.18em] ${KIND_COLOR[group.kind]}`}
                >
                  {group.kind}
                </h4>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                  {group.note}
                </span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {group.hits.map((hit) => (
                  <li key={hit.primary} className="flex items-baseline justify-between gap-3">
                    <span className="truncate font-mono text-[11px] text-muted">{hit.primary}</span>
                    <span className="shrink-0 font-mono text-[10px] text-muted">{hit.meta}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-auto font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          trigram index · vi · en · zh
        </p>
      </div>
    </PanelFrame>
  );
}
