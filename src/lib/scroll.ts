import type Lenis from "lenis";

/**
 * One place to ask for a scroll, because there are two scrollers on this page and
 * only one of them is ever right.
 *
 * Lenis owns the scroll position when it is running: it holds its own target and
 * writes the real position every frame from the GSAP ticker. A native
 * `window.scrollTo` does not update that target, so Lenis animates straight back
 * to where it was — the page twitches and returns. It has to be told instead.
 *
 * Lenis is also conditional: App only constructs it when the visitor has not asked
 * for reduced motion. So the fallback is not defensive coding, it is the other
 * half of the feature — with no Lenis there is no smooth scroller to fight, and a
 * plain jump is exactly what a reduced-motion visitor asked for.
 */
let lenis: Lenis | null = null;

/** Called by App on both sides of the Lenis lifecycle; null on teardown. */
export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToY(y: number) {
  if (lenis) {
    lenis.scrollTo(y);
    return;
  }
  window.scrollTo({ top: y });
}
