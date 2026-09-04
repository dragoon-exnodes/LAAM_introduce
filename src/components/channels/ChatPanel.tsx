import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

// This turn used to ask "Anything stuck right now?" and answer with a stuck
// session id — the assistant channel demonstrating the OLD thesis: the one panel
// whose job is to show you can ask about your business was asking about agent
// transcripts instead.
//
// The replacement briefly carried the REAL figures from the pharmacy demo (Sarah
// Miller, 62 refunds). That was wrong for a reason no browser check could catch:
// `VoicePanel` answers the SAME question with M. Bennett at 42, and the two are
// different tabs of one console, never on screen together. A page cannot name two
// different top refunders. The fictional cast wins — `AccessPanel` and
// `VoicePanel` already share it, and `channels.lead` promises the reader this data
// is invented. The real demo figures belong in the walkthrough, where they can be
// checked against the database in front of the visitor.
const ANSWER =
  "M. Bennett (EMP-0006) — 42 refunds this period, more than any other member of staff.";

export function ChatPanel({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(reduced ? ANSWER.length : 0);

  useEffect(() => {
    if (reduced) return;
    if (!active) {
      setTyped(0);
      return;
    }

    // A short lead-in so the tool chip lands before the answer starts writing.
    const start = window.setTimeout(() => {
      const id = window.setInterval(() => {
        setTyped((n) => {
          if (n >= ANSWER.length) {
            window.clearInterval(id);
            return n;
          }
          return n + 1;
        });
      }, 18);
    }, 520);

    return () => window.clearTimeout(start);
  }, [active, reduced]);

  return (
    <PanelFrame route="/chat" status="local · $0" tone="free">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* A settled earlier turn, so the thread reads as a conversation in
            progress rather than a single staged question. It also earns its
            place by being a DIFFERENT kind of question from the one below —
            an everyday one, answered from the open web — where the turn below
            reaches a system of the company's own. Two turns, two of the three
            kinds of source the hero names. Geocode, weather and nearby-place
            lookups are real tools, not set dressing. */}
        <div className="ml-auto max-w-[70%] border border-line bg-panel-2/50 px-3.5 py-2 opacity-55">
          <p className="text-[12px] text-muted">
            Weather in Da Nang before I book flights?
          </p>
        </div>
        <div className="max-w-[85%] border-l-2 border-line-bright px-3.5 py-2 opacity-55">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            <span className="text-signal">◎</span> laam_weather · resolved
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-faint">
            Da Nang, VN · 15.97°N 108.20°E
          </p>
          <p className="text-[12px] text-faint">27°C, light rain</p>
        </div>

        <div className="ml-auto max-w-[80%] border border-line-bright bg-panel-2 px-3.5 py-2.5">
          <p className="text-[13px] text-ink">Which employee refunds the most?</p>
        </div>

        {/* The `mcp__<server>__<tool>` shape is the real namespace a mounted
            system's tools arrive under, and showing it is the cheapest way to
            teach the thing the copy can only assert: the assistant reached a
            system that was connected, not one that was built into it. The slug
            is deliberately a generic `pos` rather than the name of any one
            connector — this panel should not read as a page about a particular
            back end. */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-trace-dim bg-trace/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-trace">
            mcp__pos__query_datasource
          </span>
          <span className="font-mono text-[10px] text-muted">
            tool_result · ok · 42 rows
          </span>
        </div>

        <div className="max-w-[88%] border-l-2 border-signal bg-panel-2/60 px-3.5 py-2.5">
          {/* min-h reserves space for the typewriter so the bubble doesn't grow
              mid-type, but a guessed round number (previously 3.5rem) overshot the
              answer's actual two-line wrap and left visible dead space once typing
              finished. 2lh holds exactly two line-heights, whatever the line-height
              computes to, instead of a number that only happened to be close. */}
          <p className="min-h-[2lh] text-[13px] text-muted">
            {ANSWER.slice(0, typed)}
            {typed < ANSWER.length && (
              <span
                className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-signal"
                aria-hidden="true"
              />
            )}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 border border-line px-3 py-2.5">
          <span className="font-mono text-[11px] text-faint">/</span>
          <span className="font-mono text-[11px] text-faint">
            Ask, or pick a tool…
          </span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            qwen3-vl:8b
          </span>
        </div>
      </div>
    </PanelFrame>
  );
}
