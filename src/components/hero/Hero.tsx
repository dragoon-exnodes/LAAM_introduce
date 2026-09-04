import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Reticle } from "../system/Reticle";
import { ScopeReadout } from "./ScopeReadout";
import { ConstellationStage } from "./ConstellationStage";
import { COPY } from "../../lib/i18n";

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
    //
    // `flex-1` + `justify-center`: the parent in App.tsx is a screen-height column
    // holding this and the ribbon, so the hero absorbs whatever slack the screen
    // has and centres its content in it, and the ribbon lands on the fold at every
    // height rather than only at the one the padding was tuned for.
    //
    // The top padding still has a job the flexbox cannot do: the nav is fixed and
    // 64px tall, so the content has to clear it.
    <section ref={root} id="top" className="relative flex flex-1 flex-col justify-center overflow-hidden pt-24 sm:pt-28 lg:pt-28">
      <div
        data-parallax="grid"
        className="grid-field pointer-events-none absolute -inset-16 opacity-[0.55] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_72%)]"
      />

      {/* `w-full` is load-bearing now that the section is a flex column. `mx-auto`
          means `margin-inline: auto`, and auto margins on a FLEX ITEM stop it
          stretching to the cross axis — the container silently collapsed to
          fit-content, which at 1194px left the hero 799px wide inside a 1183px
          section. As a block child it had been full-width all along; the flex
          parent changed what the same class means. */}
      <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 pb-14 sm:px-8 lg:pb-20 lg:pl-[calc(var(--spacing-rail)+2rem)] min-[1120px]:grid-cols-[1.15fr_0.85fr] min-[1120px]:gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:gap-14">
        <div>
          {/* Separators only appear once the row is guaranteed to fit on one line —
              a wrapped list ending in a stray divider looks like a mistake.
              `sm` is the right gate: the row is a fixed ~501px at every width (the
              eyebrow size does not scale), so it fits from 576px of column upward.
              The Vietnamese labels are longer and do wrap here at some widths,
              which is why the separators are hidden rather than shown mid-row. */}
          <div data-anim="eyebrow" className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Eyebrow tone="signal">{COPY.hero.eyebrows[0]}</Eyebrow>
            <span className="hidden h-3 w-px bg-line-bright sm:block" aria-hidden="true" />
            <Eyebrow tone="free">{COPY.hero.eyebrows[1]}</Eyebrow>
            <span className="hidden h-3 w-px bg-line-bright sm:block" aria-hidden="true" />
            <Eyebrow>{COPY.hero.eyebrows[2]}</Eyebrow>
          </div>

          <h1 className="mt-7 text-[length:var(--text-hero)] uppercase">
            {COPY.hero.headline.map((line, index) => (
              <span key={line} data-anim="line" className="block overflow-hidden pb-[0.06em]">
                <span className={`block ${index === 2 ? "text-signal" : ""}`}>{line}</span>
              </span>
            ))}
          </h1>

          {/* Two claims, and the second half exists to keep the first honest.
              "No SQL" is the promise; "runs on your own machines" is the answer
              to the question it immediately raises in an owner's head, which is
              where their figures are going. The local-model clause is what makes
              "no data leaves your infrastructure" true rather than a slogan — it
              is a condition, and the sentence states it as one. */}
          <p data-anim="lead" className="mt-8 max-w-xl text-[length:var(--text-lead)] text-muted">
            <span className="text-ink">{COPY.hero.lead.ink}</span> {COPY.hero.lead.rest}
          </p>

          <div data-anim="actions" className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="#contact">{COPY.hero.actions.primary}</Button>
            <Button href="#surfaces" variant="ghost">
              {COPY.hero.actions.secondary}
            </Button>
          </div>
        </div>

        <div data-anim="scope" data-parallax="scope" className="relative">
          {/* The scope. It used to be here because the proposition was that
              something is being observed; it stays because the proposition is
              now that a question reaches every surface on one core — which is
              the same picture read the other way round, beams carrying a lookup
              outward and an answer back rather than telemetry inward. */}
          {/* Taller than wide on a phone, square from `sm` up. The box used to be
              square at every width, and that stopped working when the readout
              gained a two-line question above its figures: in a 280px square at
              320px wide, the text took the bottom third and the two lowest
              constellation labels printed straight through it. Flattening the ring
              enough to clear it would have needed a squash of 0.22 — a ring drawn
              as a horizontal line. Giving the box the height instead costs only
              scroll, on a page that scrolls anyway. */}
          <div className="bracket @container relative aspect-[4/5] w-full border border-line bg-panel/40 sm:aspect-[5/4] lg:aspect-square">
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

          <p className="mt-3 font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.16em] text-muted">
            {COPY.hero.scopeCaption}
          </p>
        </div>
      </div>
    </section>
  );
}
