import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/motion";
import { AuroraField } from "./AuroraField";

const CHANNELS = [
  "calibrating measurement grid",
  "mounting transcript reader",
  "resolving machines · 4 hosts",
  "telemetry channels 6/6 online",
] as const;

type Props = { onDone: () => void; skip: boolean };

/**
 * The console powers on before it shows you anything. This is not a spinner —
 * it holds the first frames until fonts are ready, so the hero never reflows
 * mid-reveal, and it sets the instrument premise before a word is read.
 *
 * The exit is a CRT power-down: the panel collapses to a single bright line, the
 * line blooms, then wipes. A curtain lift was the obvious move and read as a
 * generic page transition; a monitor switching off is the one exit that belongs to
 * a page pretending to be a monitor. On the way out the wordmark flies to the exact
 * box it will occupy in the nav, so the mark is never re-drawn — it lands.
 */
export function BootSequence({ onDone, skip }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(skip);
  const finished = useRef(skip);
  const released = useRef(skip);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }

    document.body.dataset.booting = "true";
    const scope = root.current;
    if (!scope) return;

    // Two moments, deliberately separate. The hero is released the instant the
    // panel starts collapsing, so it animates in behind a shrinking overlay rather
    // than after a beat of empty screen. Tearing the overlay down waits for the
    // beam to finish.
    const release = () => {
      if (released.current) return;
      released.current = true;
      onDone();
    };

    const end = () => {
      if (finished.current) return;
      finished.current = true;
      delete document.body.dataset.booting;
      setGone(true);
      release();
    };

    const ctx = gsap.context(() => {
      const readout = { value: 0 };

      // Phase one: power on. Runs to completion regardless of the network.
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });

      intro
        .from("[data-boot='rule']", { scaleX: 0, duration: 0.9 })
        .from("[data-boot='mark']", { opacity: 0, duration: 0.4 }, 0.15)
        .from("[data-boot='line']", { opacity: 0, x: -10, duration: 0.45, stagger: 0.14 }, 0.3)
        .to(
          readout,
          {
            value: 100,
            duration: 1.25,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter.current) {
                counter.current.textContent = String(Math.round(readout.value)).padStart(3, "0");
              }
            },
          },
          0.2,
        );

      // Phase two: power down, but only once the fonts have landed — a reveal that
      // reflows mid-animation is worse than a slightly longer wait.
      Promise.all([intro.then(), document.fonts.ready]).then(() => {
        if (finished.current) return;

        const exit = gsap.timeline({ onComplete: end });

        exit
          .to("[data-boot='line'], [data-boot='count']", {
            opacity: 0,
            duration: 0.26,
            ease: "power1.in",
          })
          .to("[data-boot='rule']", { scaleX: 0, duration: 0.38, ease: "expo.in" }, "<")
          .to("[data-boot='aurora']", { opacity: 0, duration: 0.42 }, "<");

        // Measured now, not at mount: the nav has settled and the fonts have loaded,
        // so the two boxes are final. Skipped entirely if the nav mark is missing.
        const flight = flyMarkToNav(scope);
        if (flight) exit.to("[data-boot='mark']", { ...flight, duration: 0.62, ease: "expo.inOut" }, 0.1);

        exit
          // The collapse. transform-origin is centre, so the panel closes onto the beam.
          .to(
            "[data-boot='panel']",
            { scaleY: 0.004, duration: 0.4, ease: "power3.in", onStart: release },
            ">-0.06",
          )
          .set("[data-boot='mark']", { opacity: 0 }, "<")
          // The beam takes over exactly as the panel finishes closing, and overshoots
          // in brightness for a frame — the surge a tube makes as it gives up.
          .set("[data-boot='panel']", { opacity: 0 })
          .fromTo(
            "[data-boot='beam']",
            { opacity: 0, scaleX: 1, scaleY: 1 },
            { opacity: 1, scaleY: 2.4, duration: 0.12, ease: "power2.out" },
            "<",
          )
          .to("[data-boot='beam']", { scaleY: 1, duration: 0.16, ease: "power2.inOut" })
          .to("[data-boot='beam']", {
            scaleX: 0,
            opacity: 0,
            duration: 0.5,
            ease: "expo.inOut",
          });
      });
    }, scope);

    const onSkip = () => {
      ctx.revert();
      end();
    };

    window.addEventListener("keydown", onSkip, { once: true });
    window.addEventListener("pointerdown", onSkip, { once: true });

    // Never let a stalled font request trap the visitor behind the curtain.
    const failsafe = window.setTimeout(end, 5200);

    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("pointerdown", onSkip);
      ctx.revert();
      delete document.body.dataset.booting;
    };
  }, [onDone, skip]);

  if (gone) return null;

  return (
    <div ref={root} role="status" aria-label="Loading" className="fixed inset-0 z-[90]">
      <div
        data-boot="panel"
        className="absolute inset-0 flex flex-col justify-center overflow-hidden bg-void px-6 will-change-transform sm:px-12 lg:px-20"
      >
        {/* The light the console comes online under — the same aurora that closes
            the page, so the first and last frames rhyme. */}
        <div data-boot="aurora" className="absolute inset-0">
          <AuroraField
            colorStops={["#0b6fa8", "#00e1ff", "#4fbeff"]}
            opacity={0.5}
            speed={0.7}
            amplitude={1.05}
            blend={0.55}
            className="[mask-image:linear-gradient(to_bottom,black,black_58%,transparent)]"
          />
        </div>

        <div className="relative mx-auto w-full max-w-[1400px]">
          <div className="flex items-end justify-between gap-8">
            <span
              data-boot="mark"
              className="inline-block origin-top-left font-display text-2xl font-bold tracking-[0.08em] [font-stretch:125%] sm:text-3xl"
            >
              LAAM
            </span>
            <span
              data-boot="count"
              className="font-display text-5xl font-bold tabular-nums text-signal [font-stretch:118%] sm:text-7xl"
            >
              <span ref={counter}>000</span>
            </span>
          </div>

          <span
            data-boot="rule"
            className="mt-5 block h-px origin-left bg-line-bright"
            aria-hidden="true"
          />

          <ul className="mt-6 space-y-1.5">
            {CHANNELS.map((line) => (
              <li
                key={line}
                data-boot="line"
                className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-faint"
              >
                <span className="text-trace">✓</span> {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The line the tube collapses onto. Sits outside the panel so it survives the
          panel's own scale, and carries a bloom so it reads as emitted, not drawn. */}
      <span
        data-boot="beam"
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-signal opacity-0 shadow-[0_0_24px_6px_var(--color-signal)]"
      />
    </div>
  );
}

/**
 * FLIP: where does the boot wordmark have to go to land exactly on the nav's?
 * Returns null when the nav mark is not on the page, so the exit degrades to a
 * plain collapse rather than throwing.
 */
function flyMarkToNav(scope: HTMLElement) {
  const mark = scope.querySelector<HTMLElement>("[data-boot='mark']");
  const target = document.querySelector<HTMLElement>("[data-navmark]");
  if (!mark || !target) return null;

  const from = mark.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (from.width === 0 || to.width === 0) return null;

  const scale = to.width / from.width;
  return {
    x: to.left - from.left,
    y: to.top - from.top,
    scale,
  };
}
