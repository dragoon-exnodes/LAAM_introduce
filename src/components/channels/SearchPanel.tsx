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
      { primary: "ennam.kg.python", meta: "running · sess-8b1e04" },
      { primary: "ennam.kg.go", meta: "done · sess-b70d15" },
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

export function SearchPanel() {
  return (
    <PanelFrame route="/search" status="4 hits" tone="trace">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center gap-2.5 border border-line-bright bg-panel-2 px-3.5 py-2.5">
          <span className="font-mono text-[11px] text-faint" aria-hidden="true">
            ⌕
          </span>
          <span className="font-mono text-[12px] text-ink">{QUERY}</span>
          <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-signal" aria-hidden="true" />
        </div>

        <div className="space-y-4">
          {GROUPS.map((group) => (
            <section key={group.kind}>
              <div className="flex items-baseline gap-2.5 border-b border-line pb-1.5">
                <h4
                  className={`font-mono text-[9px] uppercase tracking-[0.18em] ${KIND_COLOR[group.kind]}`}
                >
                  {group.kind}
                </h4>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  {group.note}
                </span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {group.hits.map((hit) => (
                  <li key={hit.primary} className="flex items-baseline justify-between gap-3">
                    <span className="truncate font-mono text-[11px] text-muted">{hit.primary}</span>
                    <span className="shrink-0 font-mono text-[10px] text-faint">{hit.meta}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-auto font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          trigram index · vi · en · zh
        </p>
      </div>
    </PanelFrame>
  );
}
