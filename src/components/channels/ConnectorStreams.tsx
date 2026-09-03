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
  /** Authorized and carrying traffic. Drives the whole visual state. */
  connected: boolean;
};

// The product's own two states, from /constellation: gold for a connector that
// is wired up, cool blue for one that is merely available.
const GOLD = "255,206,122";
const COOL = "120,170,205";

/** Vertical extent of the fan, as a fraction of canvas height. */
const SPREAD = 0.86;

export function ConnectorStreams({ streams }: { streams: readonly Stream[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
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
      waistX = W * 0.40;
    }

    function buildPackets() {
      packets = [];
      if (reduced) return;
      for (let i = 0; i < streams.length; i++) {
        // Nothing travels a strand that is not connected. Their line is the offer,
        // not a flow.
        if (!streams[i].connected) continue;
        for (let k = 0; k < 3; k++) {
          packets.push({ i, t: Math.random(), sp: 0.0024 + Math.random() * 0.0016 });
        }
      }
    }

    /**
     * Where a strand terminates, level with its label's row.
     *
     * Stops just short of the label column — far enough that the terminal ring
     * clears the first letter of the name (at 0.71 it sat on it), close enough
     * that the terminal still reads as attached to it.
     * The names are left-aligned to a fixed mark on the panel side, so this one
     * x sits the same distance from every row rather than leaving short names
     * like "Jira" stranded.
     */
    function entry(i: number) {
      const span = H * SPREAD;
      const step = streams.length > 1 ? span / (streams.length - 1) : 0;
      return { x: W * 0.685, y: (H - span) / 2 + i * step };
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

      // ---- strands: gold if connected, cool blue if merely available ----
      for (let i = 0; i < streams.length; i++) {
        const p = pathPoints(i);
        const on = streams[i].connected;

        ctx!.beginPath();
        ctx!.moveTo(p[0], p[1]);
        ctx!.bezierCurveTo(p[2], p[3], p[4], p[5], p[6], p[7]);
        ctx!.lineWidth = (on ? 1.5 : 0.9) * DPR;
        ctx!.strokeStyle = on ? `rgba(${GOLD},0.85)` : `rgba(${COOL},0.3)`;
        ctx!.shadowBlur = on ? 8 * DPR : 0;
        ctx!.shadowColor = "#ffce7a";
        ctx!.stroke();
        ctx!.shadowBlur = 0;

        // Terminal marker, as on /constellation: a filled ring where a service is
        // wired up, a hollow one where it is only on offer.
        const [ex, ey] = [p[6], p[7]];
        ctx!.beginPath();
        ctx!.arc(ex, ey, 3.2 * DPR, 0, 6.3);
        ctx!.lineWidth = 1.2 * DPR;
        ctx!.strokeStyle = on ? `rgba(${GOLD},0.95)` : `rgba(${COOL},0.45)`;
        if (on) {
          ctx!.shadowBlur = 10 * DPR;
          ctx!.shadowColor = "#ffce7a";
        }
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      }

      // ---- packets running inward ----
      for (const pk of packets) {
        pk.t -= pk.sp;
        if (pk.t < 0) pk.t += 1;
        const p = pathPoints(pk.i);
        const x = bez(pk.t, p[0], p[2], p[4], p[6]);
        const y = bez(pk.t, p[1], p[3], p[5], p[7]);
        // Fade in from the far end and out into the core, so packets arrive
        // rather than stopping dead on the ring.
        const edge = Math.min(1, Math.min(pk.t, 1 - pk.t) * 6);
        ctx!.beginPath();
        ctx!.arc(x, y, 1.8 * DPR, 0, 6.3);
        ctx!.fillStyle = `rgba(255,225,170,${edge * 0.95})`;
        ctx!.shadowBlur = 9 * DPR;
        ctx!.shadowColor = "#ffce7a";
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      // ---- the core answers: a slow breath, plus a kick when a packet lands ----
      const breathe = 0.5 + 0.5 * Math.sin(T * 0.03);
      const glow = 0.35 + breathe * 0.25;

      const g = ctx!.createRadialGradient(coreX, coreY, 0, coreX, coreY, coreR * 1.6);
      g.addColorStop(0, `rgba(${GOLD},${0.16 * glow})`);
      g.addColorStop(1, `rgba(${GOLD},0)`);
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(coreX, coreY, coreR * 1.6, 0, 6.3);
      ctx!.fill();

      // Three widening, dimming passes is what reads as a lit tube; one blurred
      // stroke reads as a flat circle. Same treatment as the hero's core.
      const passes: [number, string, number][] = [
        [10 * DPR, `rgba(${GOLD},${0.16 * glow})`, 26 * DPR],
        [5 * DPR, `rgba(${GOLD},${0.4 * glow})`, 16 * DPR],
        [1.6 * DPR, `rgba(255,238,205,${0.9 * glow})`, 12 * DPR],
      ];
      for (const [lw, stroke, blur] of passes) {
        ctx!.beginPath();
        ctx!.arc(coreX, coreY, coreR, 0, 6.3);
        ctx!.lineWidth = lw;
        ctx!.strokeStyle = stroke;
        ctx!.shadowBlur = blur;
        ctx!.shadowColor = "#ffce7a";
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
