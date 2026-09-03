import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

// `laam_find_stuck` is the real tool for this question, and the threshold it
// compares against is the real default: LAAM_STUCK_MIN = 10.
const ANSWER =
  "One. sess-0ac5f8 on ennam.kg.python has not written to its transcript for 38 minutes — past your 10-minute threshold. It is still marked running.";

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
        {/* A settled earlier turn, so the thread reads as a conversation in progress
            rather than a single staged question. */}
        <div className="ml-auto max-w-[70%] border border-line bg-panel-2/50 px-3.5 py-2 opacity-55">
          <p className="text-[12px] text-muted">Which machines reported today?</p>
        </div>
        <div className="max-w-[80%] border-l-2 border-line-bright px-3.5 py-2 opacity-55">
          <p className="text-[12px] text-faint">
            Three — ws-01, ws-02, ws-03. All seen within the last four minutes.
          </p>
        </div>

        <div className="ml-auto max-w-[80%] border border-line-bright bg-panel-2 px-3.5 py-2.5">
          <p className="text-[13px] text-ink">Anything stuck right now?</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-trace-dim bg-trace/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-trace">
            laam_find_stuck
          </span>
          <span className="font-mono text-[10px] text-faint">tool_result · ok · 1 match</span>
        </div>

        <div className="max-w-[88%] border-l-2 border-signal bg-panel-2/60 px-3.5 py-2.5">
          <p className="min-h-[3.5rem] text-[13px] text-muted">
            {ANSWER.slice(0, typed)}
            {typed < ANSWER.length && (
              <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-signal" aria-hidden="true" />
            )}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 border border-line px-3 py-2.5">
          <span className="font-mono text-[11px] text-faint">/</span>
          <span className="font-mono text-[11px] text-faint">Ask, or pick a tool…</span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            qwen3-vl:8b
          </span>
        </div>
      </div>
    </PanelFrame>
  );
}
