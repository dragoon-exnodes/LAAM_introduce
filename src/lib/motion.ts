import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Standard scroll reveal: elements marked `.reveal` inside `scope` rise into place
 * once, staggered in DOM order.
 *
 * The hidden start state lives here rather than in CSS on purpose. Markup is
 * visible by default, so a reduced-motion visitor — or anyone whose JS failed to
 * run — reads the page as normal instead of staring at empty sections.
 */
export function revealOnScroll(scope: HTMLElement, reduced: boolean) {
  if (reduced) return () => {};

  const targets = scope.querySelectorAll<HTMLElement>(".reveal");
  if (targets.length === 0) return () => {};

  const tween = gsap.fromTo(
    targets,
    { opacity: 0, y: 18 },
    {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: "expo.out",
      stagger: 0.07,
      scrollTrigger: { trigger: scope, start: "top 78%", once: true },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
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
