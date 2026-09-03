import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Reticle } from "../system/Reticle";
import { ScopeReadout } from "./ScopeReadout";
import { ConstellationStage } from "./ConstellationStage";

const HEADLINE = ["Every agent.", "Every machine.", "In plain sight."];

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");

  const intro = useRef<gsap.core.Timeline | null>(null);

  /**
   * The timeline is BUILT on mount and held paused, not built when `ready` flips.
   *
   * `from()` tweens render their start values the moment they are created, so
   * building here — in a layout effect, before paint — means the hero is already
   * in its pre-animation state while the boot curtain is still lifting over it.
   * Building it on `ready` instead let the hero paint fully formed underneath the
   * rising curtain and then snap back to the start state: a visible jump.
   */
  useLayoutEffect(() => {
    if (reduced) return;
    const scope = root.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      // One orchestrated arrival: the instrument powers on, then the target appears.
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "expo.out", immediateRender: true },
      });

      tl.from("[data-anim='line'] > span", {
        yPercent: 118,
        // Archivo is a variable font, so the headline can arrive by widening —
        // the letters settle into their frame instead of just sliding up.
        fontStretch: "82%",
        duration: 1.25,
        stagger: 0.09,
      })
        .from("[data-anim='eyebrow']", { opacity: 0, duration: 0.6 }, 0.15)
        .from("[data-anim='lead']", { opacity: 0, y: 14, duration: 0.8 }, 0.55)
        .from("[data-anim='actions'] > *", { opacity: 0, y: 12, duration: 0.7, stagger: 0.08 }, 0.7)
        .from("[data-anim='scope']", { opacity: 0, scale: 0.96, duration: 1.3 }, 0.3)
        .from("[data-anim='bracket']", { opacity: 0, duration: 0.5, stagger: 0.06 }, 0.8);

      intro.current = tl;
    }, scope);

    return () => {
      intro.current = null;
      ctx.revert();
    };
  }, [reduced]);

  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  // Pointer parallax: the scope and the grid behind it sit at different depths, so
  // the hero has physical space rather than being a flat composition.
  useEffect(() => {
    if (reduced || !fine) return;
    const scope = root.current;
    if (!scope) return;

    const scopeEl = scope.querySelector<HTMLElement>("[data-parallax='scope']");
    const gridEl = scope.querySelector<HTMLElement>("[data-parallax='grid']");
    if (!scopeEl || !gridEl) return;

    const moveScope = gsap.quickTo(scopeEl, "x", { duration: 0.9, ease: "power3.out" });
    const liftScope = gsap.quickTo(scopeEl, "y", { duration: 0.9, ease: "power3.out" });
    const moveGrid = gsap.quickTo(gridEl, "x", { duration: 1.2, ease: "power3.out" });
    const liftGrid = gsap.quickTo(gridEl, "y", { duration: 1.2, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      moveScope(x * -22);
      liftScope(y * -14);
      moveGrid(x * 12);
      liftGrid(y * 8);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, fine]);

  return (
    // Clipped because the parallax grid is deliberately oversized — it has to be
    // able to travel without widening the document.
    <section ref={root} id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div
        data-parallax="grid"
        className="grid-field pointer-events-none absolute -inset-16 opacity-[0.55] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_72%)]"
      />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 pb-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-24 lg:pl-[calc(var(--spacing-rail)+2rem)]">
        <div>
          {/* Separators only appear once the row is guaranteed to fit on one line —
              a wrapped list ending in a stray divider looks like a mistake. */}
          <div data-anim="eyebrow" className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Eyebrow tone="signal">Local-first</Eyebrow>
            <span className="hidden h-3 w-px bg-line-bright sm:block" aria-hidden="true" />
            <Eyebrow tone="free">$0 model cost</Eyebrow>
            <span className="hidden h-3 w-px bg-line-bright sm:block" aria-hidden="true" />
            <Eyebrow>Zero instrumentation</Eyebrow>
          </div>

          <h1 className="mt-7 text-[length:var(--text-hero)] uppercase">
            {HEADLINE.map((line, index) => (
              <span key={line} data-anim="line" className="block overflow-hidden pb-[0.06em]">
                <span className={`block ${index === 2 ? "text-signal" : ""}`}>{line}</span>
              </span>
            ))}
          </h1>

          <p data-anim="lead" className="mt-8 max-w-xl text-[length:var(--text-lead)] text-muted">
            LAAM reads the transcripts your Claude Code agents already write — no SDK changes, no
            wrappers, nothing to install beside them. Then it puts a local-model assistant and durable
            workflow automation on the same screen.
          </p>

          <div data-anim="actions" className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="#contact">Book a walkthrough</Button>
            <Button href="#watch" variant="ghost">
              See what it watches
            </Button>
          </div>
        </div>

        <div data-anim="scope" data-parallax="scope" className="relative">
          {/* The scope: LAAM's whole proposition is that something is being observed. */}
          <div className="bracket relative aspect-square w-full border border-line bg-panel/40 sm:aspect-[5/4] lg:aspect-square">
            <span
              data-anim="bracket"
              className="absolute -left-px -top-px h-4 w-4 border-l border-t border-signal"
              aria-hidden="true"
            />
            <span
              data-anim="bracket"
              className="absolute -bottom-px -right-px h-4 w-4 border-b border-r border-signal"
              aria-hidden="true"
            />

            <div className="scanline absolute inset-0 opacity-40" aria-hidden="true" />
            <ConstellationStage />
            <Reticle />
            <ScopeReadout />
          </div>

          <p className="mt-3 font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.16em] text-faint">
            Assistant map — every surface on one core
          </p>
        </div>
      </div>
    </section>
  );
}
