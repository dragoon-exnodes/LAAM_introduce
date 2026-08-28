import { useEffect, useState } from "react";
import { NAV_LINKS } from "../../lib/content";

export function Nav() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-[var(--duration-normal)] ${
        lifted ? "border-b border-line bg-void/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8 lg:pl-[var(--spacing-rail)]"
      >
        <a href="#top" className="flex items-baseline gap-2.5">
          {/* The boot sequence flies its own wordmark to this element's box on exit. */}
          <span
            data-navmark
            className="font-display text-lg font-bold tracking-[0.06em] [font-stretch:125%]"
          >
            LAAM
          </span>
          <span className="hidden font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.2em] text-faint sm:inline">
            v2.5.0
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-[length:var(--text-data)] text-muted transition-colors duration-[var(--duration-fast)] hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="border border-line-bright px-4 py-2 font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-ink transition-colors duration-[var(--duration-fast)] hover:border-signal hover:text-signal"
        >
          Book a walkthrough
        </a>
      </nav>
    </header>
  );
}
