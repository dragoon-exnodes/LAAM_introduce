import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Nine services converging on one core, drawn to the panel's own canvas.
 *
 * The previous version was a rail with a dot per row — the right idea rendered
 * as a list with a line beside it. This is the same statement made with the
 * page's actual graphics budget: bundled paths that gather as they approach the
 * core, packets travelling inward along them, and a lit ring that answers.
 *
 * Bundling is the point, not decoration. Nine separate lines fanning into a
 * point is a starburst — it says nine things touch LAAM. Pulling them through a
 * shared waist first says they arrive over one surface, which is what a
 * connector layer IS.
 *
 * No new dependency: 2D canvas, same as the hero constellation.
 */

export type Stream = {
  name: string;
  /** True when the connector's write may run unattended behind an allowlist. */
  unattended: boolean;
};

/** Vertical extent of the fan, as a fraction of canvas height. */
const SPREAD = 0.86;

export function ConnectorStreams({ streams, litIndex }: { streams: readonly Stream[]; litIndex: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  // Mirrored into a ref so the rAF loop can read the current value without the
  // effect below tearing down and rebuilding the canvas every time it changes.
  const litRef = useRef(litIndex);
  useEffect(() => {
    litRef.current = litIndex;
  }, [litIndex]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 1.6);
    let raf = 0;
    let W = 0;
    let H = 0;
    let T = 0;

    // Core sits left-of-centre; the services enter from the right edge.
    let coreX = 0;
    let coreY = 0;
    let coreR = 0;
    let waistX = 0;

    type Packet = { i: number; t: number; sp: number };
    let packets: Packet[] = [];

    function layout() {
      const r = host!.getBoundingClientRect();
      W = canvas!.width = Math.max(1, Math.round(r.width * DPR));
      H = canvas!.height = Math.max(1, Math.round(r.height * DPR));
      canvas!.style.width = `${r.width}px`;
      canvas!.style.height = `${r.height}px`;
      coreX = W * 0.17;
      coreY = H / 2;
      coreR = Math.min(W * 0.09, H * 0.17);
      // Where the strands gather before the last run into the core.
      waistX = W * 0.36;
    }

    function buildPackets() {
      packets = [];
      if (reduced) return;
      for (let i = 0; i < streams.length; i++) {
        const n = streams[i].unattended ? 3 : 2;
        for (let k = 0; k < n; k++) {
          packets.push({ i, t: Math.random(), sp: 0.0022 + Math.random() * 0.0018 });
        }
      }
    }

    /**
     * Where a strand terminates, level with its label's row.
     *
     * Stops well short of the right edge: the labels live over there, and a
     * strand run to the edge passes straight through its own service name —
     * the lit one drew a line through "Drive" and its status.
     */
    function entry(i: number) {
      const span = H * SPREAD;
      const step = streams.length > 1 ? span / (streams.length - 1) : 0;
      return { x: W * 0.62, y: (H - span) / 2 + i * step };
    }

    /**
     * Cubic through the waist. Both control points sit at the waist's x so every
     * strand flattens into the same horizontal channel there, then peels off to
     * its own entry — that is what makes the bundle read as one cable.
     */
    function pathPoints(i: number) {
      const e = entry(i);
      const sx = coreX + coreR * 1.02;
      const sy = coreY;
      return [sx, sy, waistX, sy + (e.y - sy) * 0.06, waistX, e.y, e.x, e.y] as const;
    }

    function bez(t: number, a: number, b: number, c: number, d: number) {
      const u = 1 - t;
      return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
    }

    function frame() {
      T++;
      ctx!.clearRect(0, 0, W, H);
      const lit = litRef.current;

      // ---- strands ----
      for (let i = 0; i < streams.length; i++) {
        const p = pathPoints(i);
        const isLit = i === lit;
        const warm = streams[i].unattended;

        ctx!.beginPath();
        ctx!.moveTo(p[0], p[1]);
        ctx!.bezierCurveTo(p[2], p[3], p[4], p[5], p[6], p[7]);
        ctx!.lineWidth = (isLit ? 1.6 : 0.9) * DPR;
        ctx!.strokeStyle = isLit
          ? "rgba(34,211,238,0.85)"
          : warm
            ? "rgba(34,211,238,0.22)"
            : "rgba(148,175,205,0.16)";
        ctx!.shadowBlur = isLit ? 10 * DPR : 0;
        ctx!.shadowColor = "#22d3ee";
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      }

      // ---- packets running inward ----
      for (const pk of packets) {
        pk.t -= pk.sp * (pk.i === lit ? 2.6 : 1);
        if (pk.t < 0) pk.t += 1;
        const p = pathPoints(pk.i);
        const x = bez(pk.t, p[0], p[2], p[4], p[6]);
        const y = bez(pk.t, p[1], p[3], p[5], p[7]);
        const isLit = pk.i === lit;
        // Fade in from the edge and out into the core, so packets arrive rather
        // than stopping dead on the ring.
        const edge = Math.min(1, Math.min(pk.t, 1 - pk.t) * 6);
        ctx!.beginPath();
        ctx!.arc(x, y, (isLit ? 2 : 1.3) * DPR, 0, 6.3);
        ctx!.fillStyle = `rgba(${isLit ? "180,240,255" : "140,200,225"},${edge * (isLit ? 0.95 : 0.5)})`;
        ctx!.shadowBlur = (isLit ? 10 : 4) * DPR;
        ctx!.shadowColor = "#22d3ee";
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      // ---- the core answers: a slow breath, plus a kick when a packet lands ----
      const breathe = 0.5 + 0.5 * Math.sin(T * 0.03);
      const glow = 0.35 + breathe * 0.25;

      const g = ctx!.createRadialGradient(coreX, coreY, 0, coreX, coreY, coreR * 1.6);
      g.addColorStop(0, `rgba(34,211,238,${0.16 * glow})`);
      g.addColorStop(1, "rgba(34,211,238,0)");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(coreX, coreY, coreR * 1.6, 0, 6.3);
      ctx!.fill();

      // Three widening, dimming passes is what reads as a lit tube; one blurred
      // stroke reads as a flat circle. Same treatment as the hero's core.
      const passes: [number, string, number][] = [
        [10 * DPR, `rgba(34,211,238,${0.16 * glow})`, 26 * DPR],
        [5 * DPR, `rgba(34,211,238,${0.4 * glow})`, 16 * DPR],
        [1.6 * DPR, `rgba(190,245,255,${0.85 * glow})`, 12 * DPR],
      ];
      for (const [lw, stroke, blur] of passes) {
        ctx!.beginPath();
        ctx!.arc(coreX, coreY, coreR, 0, 6.3);
        ctx!.lineWidth = lw;
        ctx!.strokeStyle = stroke;
        ctx!.shadowBlur = blur;
        ctx!.shadowColor = "#22d3ee";
        ctx!.stroke();
      }
      ctx!.shadowBlur = 0;
    }

    layout();
    buildPackets();

    if (reduced) {
      frame();
      return;
    }

    const loop = () => {
      frame();
      raf = requestAnimationFrame(loop);
    };

    let running = false;
    let onScreen = false;
    const sync = () => {
      const want = onScreen && !document.hidden;
      if (want && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!want && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    }, { rootMargin: "100px" });
    io.observe(host);
    document.addEventListener("visibilitychange", sync);

    const ro = new ResizeObserver(() => {
      layout();
      buildPackets();
    });
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduced, streams]);

  return (
    <div ref={hostRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </div>
  );
}
