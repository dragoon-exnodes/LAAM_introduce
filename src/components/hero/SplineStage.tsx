import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * The 3D subject under observation. It is 1.3 MB of scene plus the runtime, so it
 * loads only on a large pointer-capable screen, only once the frame is near the
 * viewport, and never when the visitor asked for reduced motion. Every other case
 * keeps the static fallback, which is a complete picture on its own.
 */
export function SplineStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Two separate flags on purpose: `shouldLoad` latches the loader on and must
  // never change again, or the effect below would tear down its own canvas.
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);

  const reduced = useReducedMotion();
  const isRoomy = useMediaQuery("(min-width: 1024px)");
  const canRender = useMediaQuery("(hover: hover) and (pointer: fine)");
  const allowed = isRoomy && canRender && !reduced;

  useEffect(() => {
    if (!allowed) return;
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [allowed]);

  useEffect(() => {
    if (!shouldLoad) return;
    const stage = stageRef.current;
    if (!stage) return;

    // A WebGL context cannot be re-attached once disposed, and StrictMode mounts
    // this effect twice — so each attempt gets a canvas of its own.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 700ms cubic-bezier(0.16,1,0.3,1)";
    stage.appendChild(canvas);

    let app: { dispose: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const { Application } = await import("@splinetool/runtime");
        if (cancelled) return;

        const instance = new Application(canvas);
        await instance.load(SCENE_URL);
        if (cancelled) {
          instance.dispose();
          return;
        }
        app = instance;
        canvas.style.opacity = "1";
        setReady(true);
      } catch {
        // The fallback is already on screen; leaving it there is the whole recovery.
        if (!cancelled) setReady(false);
      }
    })();

    return () => {
      cancelled = true;
      app?.dispose();
      canvas.remove();
    };
  }, [shouldLoad]);

  return (
    <div ref={hostRef} className="relative h-full w-full">
      <Fallback dimmed={ready} />
      <div ref={stageRef} className="absolute inset-0" />
    </div>
  );
}

/**
 * Concentric sweep rings — an idle radar holding the frame before, or instead of,
 * the scene. Sized in relative units so it reads on a phone too.
 */
function Fallback({ dimmed }: { dimmed: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ${
        dimmed ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative aspect-square w-[min(78%,24rem)]">
        {[0, 1, 2].map((ring) => (
          <span
            key={ring}
            className="absolute inset-0 rounded-full border border-line-bright"
            style={{ transform: `scale(${1 - ring * 0.24})`, opacity: 0.7 - ring * 0.18 }}
          />
        ))}

        <span className="absolute inset-[38%] rounded-full bg-signal/15 blur-2xl" />
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_22px_var(--color-signal)]" />

        <svg
          className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite]"
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient id="sweep" x1="100" y1="100" x2="200" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M100 100 L200 100 A100 100 0 0 0 176 36 Z" fill="url(#sweep)" />
        </svg>
      </div>
    </div>
  );
}
