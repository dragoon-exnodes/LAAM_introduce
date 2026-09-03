import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./lib/motion";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { BootSequence } from "./components/system/BootSequence";
import { Grain, Vignette } from "./components/system/Grain";
import { Nav } from "./components/layout/Nav";
import { Rail } from "./components/layout/Rail";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/hero/Hero";
import { TelemetryRibbon } from "./components/hero/TelemetryRibbon";
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

    // Lenis drives the scroll position, so ScrollTrigger has to measure from it.
    lenis.on("scroll", ScrollTrigger.update);
    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
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

  return (
    <>
      <BootSequence onDone={onBooted} skip={reduced} />

      <a
        href="#watch"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-void"
      >
        Skip to content
      </a>

      <Nav />
      <Rail />

      <main>
        <Hero ready={booted} />
        <TelemetryRibbon />
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
