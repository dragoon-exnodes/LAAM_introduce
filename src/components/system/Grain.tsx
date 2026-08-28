/**
 * A fixed film grain over the whole page. Large flat dark fields band badly on
 * 8-bit displays; the noise breaks the gradient steps and gives the panels the
 * texture of something photographed rather than filled.
 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.16] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/** Corner vignette — the console has an edge, and the eye should feel it. */
export function Vignette() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[69]"
      style={{
        background:
          "radial-gradient(130vw 110vh at 50% 42%, transparent 52%, rgba(2,4,7,0.55) 100%)",
      }}
    />
  );
}
