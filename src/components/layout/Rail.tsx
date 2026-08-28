import { useEffect, useRef, useState } from "react";

const TICKS = 40;

/**
 * A calibration rail down the left edge: the page is read as a timeline, and the
 * marker is the playhead. Decorative only in the sense that it repeats what the
 * scrollbar says — but it says it in the product's own instrument language.
 */
export function Rail() {
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
      frame.current = 0;
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-[var(--spacing-rail)] border-r border-line lg:block"
    >
      <div className="relative flex h-full flex-col justify-between py-24">
        {Array.from({ length: TICKS }, (_, i) => {
          const major = i % 5 === 0;
          return (
            <span
              key={i}
              className={`block h-px ${major ? "w-5 bg-line-bright" : "w-2.5 bg-line"}`}
              style={{ marginLeft: "auto", marginRight: 0 }}
            />
          );
        })}

        <span
          className="absolute right-0 h-px w-[var(--spacing-rail)] bg-signal transition-transform duration-100 ease-linear"
          style={{ top: `${13 + progress * 78}%` }}
        />
        <span
          className="absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tracking-[0.12em] text-signal transition-[top] duration-100 ease-linear"
          style={{ top: `calc(${13 + progress * 78}% - 14px)` }}
        >
          {String(Math.round(progress * 100)).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
