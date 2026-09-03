import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { CYCLE_MS, NODES, levelAt, modeAt, placeNodes, type Mode, type Placed } from "../../lib/constellation";

/**
 * The hero subject: LAAM's own constellation command centre, rendered from the
 * same 2D canvas language as the product (`ConstellationCanvas.tsx`) — a lit
 * core ring, a particle swarm inside it, curved beams out to each surface, and
 * energy flowing back down those beams.
 *
 * Replaces a stock Spline robot that carried 4.1 MB of 3D runtime (physics,
 * navmesh, gaussian splats, WebGPU — for a decorative model) and said nothing
 * about the product. This draws with the 2D context and ships no library at all.
 *
 * Bounded to its container on purpose: Aurora is the page's one full-bleed
 * background, so the constellation stays a framed subject inside the hero box.
 */

/** Ring radius and vertical squash, in percent of the box. */
const RADIUS = 39;
const SQUASH = 0.9;

type Rgb = readonly [number, number, number];
const GOLD: Rgb = [255, 206, 122];
const THINK: Rgb = [180, 232, 255];

export function ConstellationStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // jsdom / unsupported

    // Cap DPR: the beams and swarm are fill-rate bound, and past ~1.6 the extra
    // pixels buy nothing on this size of box.
    const DPR = Math.min(window.devicePixelRatio || 1, 1.6);

    let raf = 0;
    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let coreR = 0;
    let placed: Placed[] = [];
    // Frame counter for ambient motion; wall-clock for the scripted turn, so the
    // narrative keeps its timing even if frames drop.
    let T = 0;
    let start = performance.now();

    let swarm: { a: number; r: number; sp: number; ph: number; size: number }[] = [];
    const flows: { ni: number; t: number; sp: number; b: number[] | null }[] = [];
    const ripples: { t: number; str: number }[] = [];
    let rippleCd = 0;
    // Eased toward 1 while thinking, so the tint shift is a transition, not a cut.
    let thinkFactor = 0;

    // Entrance: 0 → 1 once, the first time the stage is on screen. The core
    // ignites, then each beam draws outward in turn. Without it the whole
    // constellation simply exists when you arrive, which wastes the one moment
    // the visitor is guaranteed to be looking at it.
    let boot = 0;
    const BOOT_MS = 1500;
    // Each beam starts at a fraction of the entrance and takes the rest of it to
    // reach its node, so they fan out in sequence rather than together.
    const BEAM_STAGGER = 0.06;

    function layout() {
      const rect = host!.getBoundingClientRect();
      W = canvas!.width = Math.max(1, Math.round(rect.width * DPR));
      H = canvas!.height = Math.max(1, Math.round(rect.height * DPR));
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      cx = W / 2;
      cy = H / 2;
      coreR = Math.min(W, H) * 0.17;
      placed = placeNodes(NODES, RADIUS, SQUASH);
    }

    function buildSwarm() {
      const n = reduced ? 90 : Math.round(Math.min(W, H) / DPR / 1.6);
      swarm = Array.from({ length: n }, () => ({
        a: Math.random() * 6.28,
        // pow(<1) biases outward so the core doesn't clot in the middle
        r: Math.pow(Math.random(), 0.6),
        sp: Math.random() * 0.5 + 0.5,
        ph: Math.random() * 6.28,
        size: Math.random() * 1.2 + 0.4,
      }));
    }

    function buildFlows() {
      flows.length = 0;
      if (reduced) return;
      for (let ni = 0; ni < placed.length; ni++) {
        const count = placed[ni].tint === "idle" ? 1 : 2;
        for (let i = 0; i < count; i++) {
          flows.push({ ni, t: Math.random(), sp: 0.0022 + Math.random() * 0.0022, b: null });
        }
      }
    }

    function mix(a: Rgb, b: Rgb, t: number): string {
      return `${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)}`;
    }

    // Cubic ease-out: fast off the mark, settling rather than stopping dead.
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    function frame(now: number) {
      T++;
      const elapsed = now - start;
      const mode: Mode = reduced ? "idle" : modeAt(elapsed);
      const level = reduced ? 0.1 : levelAt(elapsed, mode);
      thinkFactor += ((mode === "thinking" ? 1 : 0) - thinkFactor) * 0.06;
      boot = reduced ? 1 : Math.min(1, elapsed / BOOT_MS);
      const bootE = easeOut(boot);

      ctx!.clearRect(0, 0, W, H);

      // ---- beams: core → each surface ----
      for (let ni = 0; ni < placed.length; ni++) {
        const p = placed[ni];
        const px = cx + (p.x / 100) * W;
        const py = cy + (p.y / 100) * H;
        const dx = px - cx;
        const dy = py - cy;
        const d = Math.hypot(dx, dy) || 1;
        const ux = dx / d;
        const uy = dy / d;

        const sx = cx + ux * coreR * 1.06;
        const sy = cy + uy * coreR * 1.06;
        // Stop short of the label pill so the beam touches its ring, not its text.
        const ex = px - ux * 9 * DPR;
        const ey = py - uy * 9 * DPR;
        const mx = (sx + ex) / 2;
        const my = (sy + ey) / 2;
        // Bow every beam the same way around the core; sign by quadrant keeps the
        // curve on the outside rather than cutting back through the ring.
        const perp = p.x * p.y > 0 ? 1 : -1;
        const bx = mx + -uy * d * 0.2 * perp;
        const by = my + ux * d * 0.2 * perp;

        const gold = p.tint === "gold";
        const idle = p.tint === "idle";

        // Entrance: this beam's own 0→1, offset so they fan out one after another.
        const grow = Math.max(0, Math.min(1, (bootE - ni * BEAM_STAGGER) / (1 - (placed.length - 1) * BEAM_STAGGER)));
        if (grow <= 0) continue;

        ctx!.beginPath();
        ctx!.moveTo(sx, sy);
        if (grow >= 1) {
          ctx!.quadraticCurveTo(bx, by, ex, ey);
        } else {
          // Walk the curve to `grow` instead of stroking the whole thing — a
          // quadratic has no built-in partial draw, and scaling the endpoint
          // would straighten the bow as it grew.
          const steps = 18;
          for (let s = 1; s <= steps; s++) {
            const t = (s / steps) * grow;
            const u = 1 - t;
            ctx!.lineTo(u * u * sx + 2 * u * t * bx + t * t * ex, u * u * sy + 2 * u * t * by + t * t * ey);
          }
        }
        ctx!.lineWidth = (gold ? 1.6 : idle ? 0.7 : 1.1) * DPR;
        ctx!.strokeStyle = gold
          ? "rgba(255,206,122,0.5)"
          : idle
            ? "rgba(140,175,200,0.14)"
            : "rgba(91,214,255,0.3)";
        ctx!.shadowBlur = (gold ? 6 : idle ? 0 : 3) * DPR;
        ctx!.shadowColor = gold ? "#ffce7a" : "#5bd6ff";
        ctx!.stroke();
        ctx!.shadowBlur = 0;

        for (const f of flows) if (f.ni === ni) f.b = [sx, sy, bx, by, ex, ey];
      }

      // ---- ambient arcs behind the core ----
      if (!reduced) {
        for (let k = 0; k < 6; k++) {
          const a0 = T * 0.0016 + k * 1.05;
          const a1 = a0 + 2.2 + Math.sin(T * 0.0025 + k);
          const r0 = coreR * 1.25;
          const r1 = Math.min(W, H) * 0.34 * (1 + 0.22 * Math.sin(k));
          ctx!.beginPath();
          ctx!.moveTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0);
          ctx!.quadraticCurveTo(
            cx + Math.cos((a0 + a1) / 2) * r1 * 1.25,
            cy + Math.sin((a0 + a1) / 2) * r1 * 1.25,
            cx + Math.cos(a1) * r0,
            cy + Math.sin(a1) * r0,
          );
          ctx!.lineWidth = 0.6 * DPR;
          ctx!.strokeStyle = "rgba(91,214,255,0.07)";
          ctx!.stroke();
        }
      }

      // ---- energy travelling down the beams into the core ----
      for (const f of flows) {
        f.t -= f.sp * (0.6 + level + thinkFactor * 0.8);
        if (f.t < 0) f.t += 1;
        const b = f.b;
        if (!b) continue;
        const u = 1 - f.t;
        const x = u * u * b[0] + 2 * u * f.t * b[2] + f.t * f.t * b[4];
        const y = u * u * b[1] + 2 * u * f.t * b[3] + f.t * f.t * b[5];
        const gold = placed[f.ni]?.tint === "gold";
        ctx!.beginPath();
        ctx!.arc(x, y, 1.6 * DPR, 0, 6.3);
        ctx!.fillStyle = gold ? "rgba(255,217,143,0.9)" : "rgba(169,233,255,0.85)";
        ctx!.shadowBlur = 8 * DPR;
        ctx!.shadowColor = gold ? "#ffce7a" : "#5bd6ff";
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      // ---- swarm inside the ring ----
      const rot = T * 0.0016 * (1 + thinkFactor * 3);
      const wob = reduced ? 0 : 0.04 * (1 + thinkFactor * 1.6);
      for (const p of swarm) {
        const aa = p.a + rot * p.sp;
        const rr = (p.r + (reduced ? 0 : Math.sin(T * 0.05 * p.sp + p.ph) * wob)) * coreR * 0.9;
        const al = Math.min(1, (1 - p.r * 0.7) * (0.45 + level * 0.5 + thinkFactor * 0.3)) * bootE;
        ctx!.beginPath();
        ctx!.arc(cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr, p.size * DPR, 0, 6.3);
        ctx!.fillStyle = `rgba(${150 + p.r * 60},${210 + p.r * 30},255,${al})`;
        ctx!.fill();
      }

      // ---- inner glow ----
      const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      g.addColorStop(0, `rgba(120,200,255,${(0.1 + level * 0.16) * bootE})`);
      g.addColorStop(0.7, "rgba(40,110,170,0.05)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(cx, cy, coreR * 1.1, 0, 6.3);
      ctx!.fill();

      // ---- ripples: loud moments push a ring out, rest breathes ----
      rippleCd--;
      if (!reduced) {
        if (level > 0.45 && rippleCd <= 0) {
          if (ripples.length < 14) ripples.push({ t: 0, str: Math.min(1.3, 0.4 + level * 0.8) });
          rippleCd = 8;
        } else if (T % 160 === 0) {
          if (ripples.length < 14) ripples.push({ t: 0, str: 0.22 });
        }
      }

      const ringRGB = mix(GOLD, THINK, thinkFactor);
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.t += 0.014;
        if (rp.t >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        ctx!.beginPath();
        ctx!.arc(cx, cy, coreR * (1.02 + rp.t * 1.9), 0, 6.3);
        ctx!.lineWidth = (2.2 * (1 - rp.t) + 0.4) * DPR;
        ctx!.strokeStyle = `rgba(${ringRGB},${(1 - rp.t) * (1 - rp.t) * 0.5 * rp.str})`;
        ctx!.stroke();
      }

      // ---- the core ring: three widening, dimming passes read as a lit tube,
      // where one blurred stroke reads as a flat circle ----
      const parts = ringRGB.split(",").map(Number);
      // 0.6 not 0.75: at 0.75 the hot pass washes the tint out to near-white and
      // the ring stops reading as gold at all.
      const hot = `rgb(${parts.map((c) => Math.round(c + (255 - c) * 0.6)).join(",")})`;
      const glow = `rgb(${ringRGB})`;
      // The ring sweeps closed as it ignites, rather than fading in as a full circle.
      const sweep = -Math.PI / 2;
      const arc = 6.2832 * bootE;
      const passes: [number, string, number][] = [
        [(12 + level * 12) * DPR, `rgba(${ringRGB},${0.18 * bootE})`, (42 + level * 54) * DPR],
        [(6 + level * 7) * DPR, `rgba(${ringRGB},${0.46 * bootE})`, (26 + level * 36) * DPR],
        [(2 + level * 2.6) * DPR, hot, (18 + level * 24) * DPR],
      ];
      for (const [lw, stroke, blur] of passes) {
        ctx!.beginPath();
        ctx!.arc(cx, cy, coreR, sweep, sweep + arc);
        ctx!.lineWidth = lw;
        ctx!.strokeStyle = stroke;
        ctx!.shadowBlur = blur;
        ctx!.shadowColor = glow;
        ctx!.stroke();
      }
      ctx!.shadowBlur = 0;
    }

    layout();
    buildSwarm();
    buildFlows();

    // Reduced motion: one static frame, no loop, no timers.
    if (reduced) {
      frame(performance.now());
      return;
    }

    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };

    // Only burn frames while the stage is actually on screen. Scrolling past the
    // hero on a long page otherwise keeps a full rAF loop running for nothing.
    let running = false;
    let onScreen = false;
    let elapsedWhenPaused = 0;

    const startLoop = () => {
      if (running) return;
      running = true;
      // Re-base the clock so the scripted turn resumes where it paused rather
      // than jumping to wherever a free-running loop would have reached.
      start = performance.now() - (elapsedWhenPaused % CYCLE_MS);
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (!running) return;
      running = false;
      elapsedWhenPaused = performance.now() - start;
      cancelAnimationFrame(raf);
    };
    // Runs on both triggers: the stage must be visible AND the tab in front.
    const sync = () => {
      if (onScreen && !document.hidden) startLoop();
      else stopLoop();
    };

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    }, { rootMargin: "120px" });
    io.observe(host);

    document.addEventListener("visibilitychange", sync);

    const ro = new ResizeObserver(() => {
      layout();
      buildSwarm();
      buildFlows();
    });
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduced]);

  const labels = placeNodes(NODES, RADIUS, SQUASH);

  return (
    <div ref={hostRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* Labels stay HTML, not canvas text: crisp at any DPR, selectable, and
          readable by a screen reader as the list of surfaces it actually is. */}
      <ul className="absolute inset-0 m-0 list-none p-0">
        {labels.map((n, i) => (
          <li
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${50 + n.x}%`,
              top: `${50 + n.y}%`,
              // Lands just after its beam arrives. Reduced motion skips the
              // animation entirely (the media query in index.css zeroes it).
              animation: reduced ? undefined : `node-in 420ms cubic-bezier(0.16,1,0.3,1) ${560 + i * 90}ms backwards`,
            }}
          >
            <span
              className={`flex items-center gap-1.5 whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.14em] sm:text-[0.65rem] ${
                n.tint === "gold" ? "text-[#ffce7a]" : n.tint === "idle" ? "text-faint" : "text-[#a9e9ff]"
              }`}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: n.tint === "gold" ? "#ffce7a" : n.tint === "idle" ? "#6b8296" : "#5bd6ff",
                  boxShadow: n.tint === "idle" ? "none" : "0 0 8px currentColor",
                }}
              />
              {n.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
