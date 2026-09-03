import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Scroll reveal for elements marked `.reveal` inside `scope`.
 *
 * Batched per element, not per section. The previous version hung one trigger on
 * the whole section, so arriving at its top played everything in it — including
 * the parts still a screen below, which had therefore finished animating before
 * anyone could see them. ScrollTrigger.batch fires each element as IT enters and
 * staggers whatever crosses together, which is the behaviour the effect was
 * always meant to have.
 *
 * The hidden start state lives here rather than in CSS on purpose. Markup is
 * visible by default, so a reduced-motion visitor — or anyone whose JS failed to
 * run — reads the page as normal instead of staring at empty sections.
 */
export function revealOnScroll(scope: HTMLElement, reduced: boolean) {
  if (reduced) return () => {};

  const targets = gsap.utils.toArray<HTMLElement>(scope.querySelectorAll(".reveal"));
  if (targets.length === 0) return () => {};

  // Transform and opacity only: both run on the compositor, so a reveal never
  // competes with Lenis for layout work while the page is being scrolled.
  gsap.set(targets, { opacity: 0, y: 26, scale: 0.988, willChange: "transform, opacity" });

  const triggers = ScrollTrigger.batch(targets, {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.09,
        overwrite: true,
        // Dropped once it has landed: a permanent will-change keeps a layer alive
        // for every revealed element on the page, which is most of them.
        onComplete: () => gsap.set(batch, { willChange: "auto" }),
      }),
  });

  return () => {
    triggers.forEach((t) => t.kill());
    gsap.set(targets, { clearProps: "all" });
  };
}

/** Counts a numeric readout up when it scrolls into view. */
export function countUp(
  el: HTMLElement,
  to: number,
  reduced: boolean,
  format: (n: number) => string = (n) => String(Math.round(n)),
) {
  if (reduced) {
    el.textContent = format(to);
    return () => {};
  }

  const state = { value: 0 };
  const tween = gsap.to(state, {
    value: to,
    duration: 1.4,
    ease: "expo.out",
    onUpdate: () => {
      el.textContent = format(state.value);
    },
    scrollTrigger: { trigger: el, start: "top 88%", once: true },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
