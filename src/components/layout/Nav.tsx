import { useEffect, useState } from "react";
import { COPY, locale, urlForLocale } from "../../lib/i18n";

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
        <a href="#top" className="flex items-center gap-3">
          {/* The product's own initial on a lit square, the shape LAAM's own
              app wears in its header. `data-navmark`: the boot sequence's OWN
              icon mark (the same bordered square, larger) FLIPs onto this
              exact box on exit, so it is never redrawn — it lands. It lives
              here rather than on the wordmark text now, because the boot mark
              is an icon square too; landing an icon on an icon scales
              cleanly, where the earlier text-onto-square pairing would have
              read as a crop. */}
          <span
            data-navmark
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center border border-signal font-display text-sm font-bold text-signal"
          >
            L
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-[0.04em] [font-stretch:125%]">
              LAAM
            </span>
            {/* "Ennam SJC", not `COPY.footer.org` ("Enterprise AI Agent"):
                this line names who MADE the product, the same role
                AAAA_introduce's nav subtitle plays for its own maker —
                `footer.org` here is a product descriptor, not a maker's name,
                and "by Enterprise AI Agent" reads as nonsense. Matches the
                footer's own "Ennam SJC" link text below rather than
                introducing a second spelling. */}
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              by Ennam SJC
            </span>
          </span>
        </a>

        {/* `xl:flex`, not `lg:flex`. Five links, and the longest label
            ("Custom for Your Business" / "Tùy chỉnh cho doanh nghiệp") pushes
            the single-line width to ~705px EN / ~704px VI including gaps.
            At `lg` (1024, an iPad Pro portrait width) the space actually left
            for this list — nav width minus the logo, the language toggle, the
            CTA and the outer gaps — is only ~604px, so every link wraps to two
            lines and the header looks broken rather than just tight.
            Binary-searched in-browser rather than guessed: EN stops wrapping
            at 1160px, VI (the wider case) at 1280px. `xl` (1280) clears both
            with real margin, not a hairline one — re-check both locales if a
            link label changes. */}
        <ul className="hidden items-center gap-8 xl:flex">
          {COPY.nav.links.map((link) => (
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

        <div className="flex items-center gap-4">
          {/* A real link, not a button: the locale lives in the URL, so switching
              is a navigation. That also means it is shareable, opens in a new tab
              the way a link should, and needs no client-side state at all. */}
          <a
            href={urlForLocale(locale === "vi" ? "en" : "vi")}
            aria-label={COPY.langToggle.aria}
            // `-m-3 p-3`: the visible "VI"/"EN" glyph is ~17x18px, well under
            // the ~40-44px minimum tap target. Padding grows the hit area and
            // the matching negative margin cancels it back out visually, so
            // the nav's own gap-4 spacing to its neighbours is unchanged —
            // only the invisible tappable region grows.
            className="-m-3 p-3 font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-muted transition-colors duration-[var(--duration-fast)] hover:text-ink"
          >
            {COPY.langToggle.label}
          </a>

          {/* Stands down below `sm`, matching AAAA_introduce's own nav: the
              mark grew from bare text into an icon-plus-two-line block, which
              leaves this row tighter than it was, and a phone reaches the same
              destination through the hero's primary button a screen-length
              below and through the closing CTA — this one is not the only
              path to it. */}
          <a
            href="#contact"
            className="hidden border border-line-bright px-4 py-2 font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-ink transition-colors duration-[var(--duration-fast)] hover:border-signal hover:text-signal sm:block"
          >
            {COPY.nav.cta}
          </a>
        </div>
      </nav>
    </header>
  );
}
