import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

const BARS = 44;
/** Fixed phase offsets keep the waveform organic without a random seed. */
const PHASE = Array.from({ length: BARS }, (_, i) => (i * 137.5) % 360);

export function VoicePanel({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (reduced || !active) return;
    let start = 0;
    const loop = (now: number) => {
      if (!start) start = now;
      setT((now - start) / 1000);
      raf.current = window.requestAnimationFrame(loop);
    };
    raf.current = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf.current);
  }, [active, reduced]);

  return (
    <PanelFrame route="/constellation" status="listening" tone="ion">
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            {!reduced && active && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ion opacity-70" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ion" />
          </span>
          {/* The question this was demonstrated with, asked out loud. It was
              originally asked in Vietnamese — the assistant answers in whichever
              of vi/en/zh it is spoken to — but this page is written in English
              throughout, and a lone Vietnamese string here reads as an oversight
              rather than as the multilingual point it was meant to make. */}
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            "Which staff member issued the most refunds?"
          </p>
        </div>

        <div className="flex h-24 items-center justify-between gap-[2px]" aria-hidden="true">
          {PHASE.map((phase, index) => {
            const wave =
              Math.sin(t * 3.1 + phase * 0.09) * 0.5 + Math.sin(t * 1.7 + phase * 0.21) * 0.5;
            // Taper the ends so the waveform reads as a burst, not a wall.
            const envelope = Math.sin((index / (BARS - 1)) * Math.PI) ** 0.7;
            const height = reduced || !active ? 22 : 8 + Math.abs(wave) * envelope * 92;
            return (
              <span
                key={index}
                className="w-full rounded-full bg-gradient-to-t from-ion/35 to-ion"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        <div className="border border-line bg-panel-2/70 p-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              display panel
            </span>
            {/* The badge is a trust boundary: "from tool" means the table came
                straight out of kg_query_datasource, not from the model. */}
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ion">
              kg_query_datasource
            </span>
          </div>
          <dl className="space-y-1.5">
            {[
              ["M. Bennett", "42 refunds"],
              ["R. Doyle", "31 refunds"],
              ["S. Fletcher", "18 refunds"],
            ].map(([store, value], index) => (
              <div key={store} className="flex items-center gap-3">
                <dt className="w-24 shrink-0 font-mono text-[11px] text-muted">{store}</dt>
                <dd className="flex flex-1 items-center gap-2">
                  <span
                    className="h-1 bg-ion/70"
                    style={{ width: `${[100, 70, 47][index]}%` }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[11px] tabular-nums text-ink">{value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </PanelFrame>
  );
}
