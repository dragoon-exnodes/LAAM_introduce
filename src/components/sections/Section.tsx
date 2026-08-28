import { useLayoutEffect, useRef } from "react";
import { revealOnScroll } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Props = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

/** Wraps a band of the page and reveals its `.reveal` children once, in order. */
export function Section({ id, children, className = "" }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Layout effect so the hidden start state is set before the browser paints,
  // otherwise the content flashes in at full opacity and then jumps down.
  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;
    return revealOnScroll(scope, reduced);
  }, [reduced]);

  return (
    <section
      ref={root}
      id={id}
      className={`relative mx-auto max-w-[1400px] px-5 py-[var(--spacing-section)] sm:px-8 lg:pl-[calc(var(--spacing-rail)+2rem)] ${className}`}
    >
      {children}
    </section>
  );
}
