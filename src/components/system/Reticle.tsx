import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Measurement crosshairs, scoped to the inside of an instrument viewport.
 *
 * The native cursor is never replaced — a site-wide custom cursor trades real
 * usability for novelty. This only adds crosshairs and a live coordinate readout
 * where the page is explicitly claiming to observe something, which is the one
 * place the gesture means anything.
 */
export function Reticle() {
  const host = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const frame = useRef(0);

  const reduced = useReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const active = fine && !reduced;

  useEffect(() => {
    if (!active) return;
    const el = host.current?.parentElement;
    if (!el) return;

    const onMove = (event: PointerEvent) => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        setPos({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
        frame.current = 0;
      });
    };

    const onLeave = () => setPos(null);

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [active]);

  return (
    <div ref={host} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {pos && (
        <>
          <span
            className="absolute inset-y-0 w-px bg-signal/35"
            style={{ left: `${pos.x}%` }}
          />
          <span
            className="absolute inset-x-0 h-px bg-signal/35"
            style={{ top: `${pos.y}%` }}
          />
          <span
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          />
          <span
            className="absolute translate-x-3 translate-y-3 font-mono text-[10px] tracking-[0.1em] text-signal/80 tabular-nums"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {pos.x.toFixed(1)}·{pos.y.toFixed(1)}
          </span>
        </>
      )}
    </div>
  );
}
