import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./lib/motion";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { registerLenis } from "./lib/scroll";
import { COPY, applyDocumentLocale } from "./lib/i18n";
import { BootSequence } from "./components/system/BootSequence";
import { Grain, Vignette } from "./components/system/Grain";
import { Nav } from "./components/layout/Nav";
import { Rail } from "./components/layout/Rail";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/hero/Hero";
import { InquiryRibbon } from "./components/hero/InquiryRibbon";
import { Problem } from "./components/sections/Problem";
import { Channels } from "./components/sections/Channels";
import { Evidence } from "./components/sections/Evidence";
import { Status } from "./components/sections/Status";
import { Contact } from "./components/sections/Contact";

export default function App() {
  const reduced = useReducedMotion();
  const [booted, setBooted] = useState(reduced);
  const onBooted = useCallback(() => setBooted(true), []);

  useEffect(() => {
    if (reduced) return;

    // `anchors` routes in-page links through Lenis. Without it a native jump moves
    // the document without emitting a Lenis scroll, and every ScrollTrigger below
    // is left measuring a stale position.
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });
    // Published so anything that needs to MOVE the page asks Lenis rather than the
    // window — see lib/scroll.ts. The channel tabs are the first caller.
    registerLenis(lenis);

    // Lenis drives the scroll position, so ScrollTrigger has to measure from it.
    lenis.on("scroll", ScrollTrigger.update);
    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
      registerLenis(null);
      lenis.destroy();
    };
  }, [reduced]);

  // The sticky console's track height is in viewport units, so a resize — or the
  // boot curtain lifting — changes where every trigger should fire.
  useEffect(() => {
    if (!booted) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [booted]);

  // Sets <html lang>, the title and the description from the locale the URL
  // chose. `lang` also drives the display leading — Vietnamese uppercase needs
  // a taller line box than Latin (see index.css).
  useEffect(applyDocumentLocale, []);

  return (
    <>
      <BootSequence onDone={onBooted} skip={reduced} />

      <a
        href="#why"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-void"
      >
        {COPY.skipToContent}
      </a>

      <Nav />
      <Rail />

      <main>
        <Hero ready={booted} />
        <InquiryRibbon />
        <Problem />
        <Channels />
        <Evidence />
        <Status />
        <Contact />
      </main>

      <Footer />

      <Vignette />
      <Grain />
    </>
  );
}
