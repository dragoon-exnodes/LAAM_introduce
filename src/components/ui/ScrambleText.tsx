import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·_";
const FRAME_MS = 34;

type Props = {
  text: string;
  className?: string;
  /** Play once when the element first scrolls into view. */
  onView?: boolean;
};

/**
 * Resolves a mono label character by character, as if a channel were locking on.
 * Only ever applied to short machine-language strings — route names, status
 * words — where the effect reads as decoding rather than decoration.
 *
 * The final text is in the DOM from the first render, so screen readers and a
 * failed script both get the real label.
 */
export function ScrambleText({ text, className = "", onView = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !onView) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let timer = 0;
    let played = false;

    const run = () => {
      const start = performance.now();
      const duration = 90 + text.length * FRAME_MS;

      const tick = () => {
        const progress = Math.min(1, (performance.now() - start) / duration);
        const settled = Math.floor(progress * text.length);

        el.textContent = text
          .split("")
          .map((char, index) => {
            if (index < settled || char === " ") return char;
            return GLYPHS[(index * 7 + Math.floor(performance.now() / FRAME_MS)) % GLYPHS.length];
          })
          .join("");

        if (progress < 1) {
          raf = window.requestAnimationFrame(tick);
        } else {
          el.textContent = text;
        }
      };

      raf = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        observer.disconnect();
        // A beat after the section reveal, so the two don't fight for attention.
        timer = window.setTimeout(run, 140);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      el.textContent = text;
    };
  }, [text, reduced, onView]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
