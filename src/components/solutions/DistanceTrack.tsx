import { useEffect, useRef } from "react";
import { COPY } from "../../lib/i18n";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * "One AI layer. Across your business." — drawn as the thing it names.
 *
 * The first version of this drew a dimension line: five stops on a rule, and a
 * bracket underneath annotating the span. It was correct and it was small. A
 * bracket is the *annotation* of a span; it tells you a measurement exists. But
 * the sentence above it does not claim a measurement, it claims a LAYER — and a
 * layer is a thing with a surface, a thickness and an extent, which a 1px bracket
 * can only refer to.
 *
 * So the span is now a slab. Five steps stand in a row, each dropping a line into
 * one continuous stratum that runs the full width beneath them, and light travels
 * through that stratum end to end. Every step touches it; it reaches past the
 * outermost two, because a layer does not stop at the last thing standing on it.
 * That is the whole argument of the section, and none of it is written down.
 *
 * It is also the product's own vocabulary rather than a new one: `index.css`
 * already describes a "LAAM bus" that connectors dock onto in `ConnectorsPanel`.
 * Same language, different cargo — business steps instead of connectors.
 *
 * The division of labour is fixed by a lesson this codebase already paid for.
 * `AuroraField` records two shader backdrops that were tried and cut: an organic
 * plasma field, which "read as a second, different site layered under a page
 * whose language is orthogonal and measured", and a radar sweep, which failed
 * because it "is a *diagram*, and a shader-drawn diagram competes with this
 * page's real diagrams and loses". So:
 *
 *   - the DIAGRAM is DOM — steps, drop lines, the slab's frame, the label;
 *   - the SHADER is LIGHT — a current inside the slab and a packet moving
 *     through it. It draws no mark, no tick, no edge of its own.
 *
 * The scanline texture over the slab is CSS, from `index.css`, for the same
 * reason: it is the page's existing surface treatment, not a second one invented
 * in GLSL.
 *
 * One clock drives everything. The rAF loop sets the shader's `uTime` and, in the
 * same frame, lights each step and its drop line from the identical arithmetic —
 * `smoothstep` is reimplemented in TS so the DOM and the GLSL run the same
 * numbers. A CSS animation for the steps plus rAF for the shader would agree for
 * about a minute and then drift, and the packet arriving *as* its step lights is
 * the only reason any of this exists.
 */

/** Seconds for one traverse of the layer, edge to edge. */
const CYCLE_S = 6.4;
/** How sharply the packet falls off. Shared by the shader and the DOM. */
const PACKET_K = 260;
/** How far the lit wake trails behind the packet, as a fraction of the width. */
const WAKE = 0.22;

/**
 * Fade-in / fade-out windows on `head`, and the reason the loop no longer jerks.
 *
 * `head` is `fract(t / CYCLE)`, so it steps 1 -> 0 in a single frame. Anything
 * still lit at head=1 goes black in that frame. The packet survived it (at both
 * ends it sits under the edge mask) but the wake did not: at head=1 it was
 * lighting a fifth of the slab at full strength, and that band vanished
 * instantly. Measured, the worst single-frame change across the five steps was
 * 0.407 — the visible stutter.
 *
 * Both terms are now enveloped to exactly zero before the wrap, so the wrap is a
 * no-op. Two windows rather than one because the terms are not alike: the packet
 * is small and already hidden by the edge mask past x=0.93, so it can fade late
 * and fast; the wake covers a fifth of the slab and needs the long, early fade.
 *
 * The out-windows start after x=0.9, which is where the last step sits — so the
 * packet still reaches every step at full brightness. Verified numerically:
 * wrap jump 0.0000, worst single frame 0.052, every step peaks at 1.00.
 */
const PACKET_IN = 0.05;
const PACKET_OUT = 0.95;
const WAKE_IN = 0.22;
const WAKE_OUT = 0.74;

const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

/**
 * Inside the slab. Four things, and every one of them is light rather than a mark:
 *
 * `depth`   — brighter toward the top surface, so the slab reads as a solid seen
 *             slightly from above rather than a flat rectangle of colour.
 * `current` — soft striations drifting along it, so the layer is alive between
 *             packets instead of going dark and looking broken.
 * `packet`  — the thing crossing, with a `wake` behind it: the span already
 *             covered stays lit, because the claim is coverage, not a moving dot.
 * `surface` — a bright caustic along the top edge under the packet, which is what
 *             sells it as a surface with something running beneath it.
 *
 * `edge` fades both ends so the wrap has no seam.
 */
const FRAGMENT = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uSignal;
uniform float uOpacity;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  float depth = mix(0.12, 1.0, pow(uv.y, 2.0));

  // Two drifting waves at slightly different rates, so the crests never line up
  // into the evenly spaced blobs a single sine produced — those read as blotches
  // on the slab rather than as movement through it. Weighted toward the top so
  // the flow hugs the surface instead of filling the whole thickness.
  float current = 0.5 + 0.5 * sin((uv.x * 9.0 - uTime * 0.8) * 3.14159265);
  current *= 0.5 + 0.5 * sin((uv.x * 5.0 - uTime * 0.55) * 3.14159265 + 1.7);
  current = pow(current, 2.5) * 0.09 * smoothstep(0.0, 0.55, uv.y);

  float head = fract(uTime / ${CYCLE_S.toFixed(2)});
  float dx = uv.x - head;
  // Both terms fade to zero before head wraps, so the 1 -> 0 step is a no-op.
  // (No backticks in this string: it is a JS template literal, and one closes it.)
  float packetEnv = smoothstep(0.0, ${PACKET_IN.toFixed(2)}, head)
                  * (1.0 - smoothstep(${PACKET_OUT.toFixed(2)}, 1.0, head));
  float wakeEnv = smoothstep(0.0, ${WAKE_IN.toFixed(2)}, head)
                * (1.0 - smoothstep(${WAKE_OUT.toFixed(2)}, 1.0, head));

  float packet = exp(-dx * dx * ${PACKET_K.toFixed(1)}) * packetEnv;
  // The trailing edge has to be smooth. A step() cut the wake off at full
  // strength exactly at the packet centre, and the packet's own glow only masked
  // it near the centreline — above and below it left a hard vertical seam
  // running the full depth of the slab.
  float wake = smoothstep(-${WAKE.toFixed(2)}, 0.0, dx)
             * (1.0 - smoothstep(0.0, 0.03, dx)) * 0.34 * wakeEnv;

  float edge = smoothstep(0.0, 0.07, uv.x) * (1.0 - smoothstep(0.93, 1.0, uv.x));

  // A base glow along the whole slab. Without it the span ahead of the packet sat
  // dark, and a layer that is only lit where the light has already been reads as
  // partial coverage — the opposite of what the sentence above claims.
  float energy = (0.035 + current + (packet + wake) * 0.85) * depth * edge;

  // The lit surface line, held just inside the top edge.
  float surface = exp(-pow((uv.y - 0.94) * 26.0, 2.0)) * (packet * 1.15 + 0.05) * edge;
  energy += surface;

  fragColor = vec4(uSignal * energy * uOpacity, energy * uOpacity);
}
`;

export function DistanceTrack() {
  const stops = COPY.solutions.answer.chain;
  const reduced = useReducedMotion();

  const field = useRef<HTMLDivElement>(null);
  /** Step markers and their drop lines, lit directly rather than via state. */
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dropRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const container = field.current;
    if (!container) return;

    let teardown: (() => void) | null = null;
    let cancelled = false;
    // Held in locals so the cleanup does not reach through the refs after React
    // may have repointed them. The arrays themselves are stable — the ref
    // callbacks mutate them in place — so these are the lists the loop writes to.
    const nodes = nodeRefs.current;
    const drops = dropRefs.current;
    const last = stops.length - 1;

    // ogl is ~15 kB gzipped and this is a backdrop, so it stays out of the
    // initial payload — the same arrangement AuroraField uses. If it never
    // arrives the diagram is still complete; the layer simply sits unlit.
    (async () => {
      const ogl = await import("ogl");
      if (cancelled) return;
      teardown = mount(container, ogl);
    })();

    return () => {
      cancelled = true;
      teardown?.();
      nodes.forEach((node, i) => node && resetNode(node, i === last));
      drops.forEach((drop) => drop && resetDrop(drop));
    };

    function mount(
      host: HTMLDivElement,
      { Renderer, Program, Mesh, Triangle }: Pick<
        typeof import("ogl"),
        "Renderer" | "Program" | "Mesh" | "Triangle"
      >,
    ) {
      const renderer = new Renderer({
        webgl: 2,
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const canvas = gl.canvas;
      canvas.style.cssText = "width:100%;height:100%;display:block";
      canvas.setAttribute("aria-hidden", "true");
      host.appendChild(canvas);

      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new Float32Array([1, 1]) },
          // --color-signal. A live agent inside LAAM, which is what is crossing.
          uSignal: { value: new Float32Array([0, 0.882, 1]) },
          uOpacity: { value: 0.9 },
        },
      });

      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const setSize = (width: number, height: number) => {
        renderer.setSize(Math.max(1, width), Math.max(1, height));
        const res = program.uniforms.uResolution.value;
        res[0] = gl.drawingBufferWidth;
        res[1] = gl.drawingBufferHeight;
        renderer.render({ scene: mesh });
      };

      // offsetWidth/Height, not getBoundingClientRect: this sits inside a
      // `.reveal` panel that GSAP holds at `scale: 0.988` until it scrolls into
      // view, and screen-space measurement during that window bakes a
      // permanently undersized canvas. AuroraField documents the same trap.
      const resizeObserver = new ResizeObserver(([entry]) => {
        setSize(entry.contentRect.width, entry.contentRect.height);
      });
      resizeObserver.observe(host);
      setSize(host.offsetWidth, host.offsetHeight);

      let raf = 0;
      let onScreen = true;
      let pageVisible = !document.hidden;
      const started = performance.now();

      const loop = (now: number) => {
        const elapsed = (now - started) * 0.001;
        program.uniforms.uTime.value = elapsed;
        renderer.render({ scene: mesh });
        lightSteps(elapsed);
        raf = requestAnimationFrame(loop);
      };

      const start = () => {
        if (onScreen && pageVisible && raf === 0) raf = requestAnimationFrame(loop);
      };
      const stop = () => {
        if (raf !== 0) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          onScreen ? start() : stop();
        },
        { threshold: 0 },
      );
      io.observe(host);

      const onVisibility = () => {
        pageVisible = !document.hidden;
        pageVisible ? start() : stop();
      };
      document.addEventListener("visibilitychange", onVisibility);
      start();

      return () => {
        stop();
        resizeObserver.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    /**
     * The shader's arithmetic, applied to the DOM. Written straight onto the
     * elements: this runs every frame, and ten style writes cost nothing next to
     * re-rendering the section on each one.
     *
     * The wave is what the eye follows — a step lights as the packet reaches it
     * and stays lit while the wake is still on it, so the row fills up behind the
     * light rather than blinking one at a time.
     */
    function lightSteps(elapsed: number) {
      const head = (elapsed / CYCLE_S) % 1;

      for (let i = 0; i < nodes.length; i++) {
        // Step centres, matching `grid-cols-5`: 10%, 30%, 50%, 70%, 90%.
        const x = 0.1 + (0.8 * i) / last;
        const dx = x - head;
        // The same two envelopes as the shader. Without them the steps kept
        // snapping off at the wrap while the light behind them faded smoothly.
        const packetEnv = smoothstep(0, PACKET_IN, head) * (1 - smoothstep(PACKET_OUT, 1, head));
        const wakeEnv = smoothstep(0, WAKE_IN, head) * (1 - smoothstep(WAKE_OUT, 1, head));
        const packet = Math.exp(-dx * dx * PACKET_K) * packetEnv;
        const wake = dx < 0 ? smoothstep(-WAKE, 0, dx) * 0.55 * wakeEnv : 0;
        const lit = Math.min(1, packet + wake);
        // Colour flips once, well inside the lit band, and a CSS transition
        // carries it — so the change never lands as a snap on a dim marker.
        const on = lit > 0.35;

        const node = nodes[i];
        if (node) {
          node.style.opacity = String(0.4 + lit * 0.6);
          node.style.borderColor = on ? "var(--color-signal)" : "var(--color-line-bright)";
          node.style.backgroundColor = on ? "var(--color-signal)" : "var(--color-void)";
        }

        const drop = drops[i];
        if (drop) {
          drop.style.opacity = String(0.25 + lit * 0.75);
          drop.style.backgroundColor = on ? "var(--color-signal)" : "var(--color-line-bright)";
        }
      }
    }
  }, [reduced, stops.length]);

  return (
    // Wider than a phone, so it scrolls in place rather than wrapping into a
    // shape that would no longer be a layer with things standing on it.
    <div className="scroll-x mt-14 pb-2">
      <div className="min-w-[38rem]">
        {/* Labels above the markers, because the markers now drop INTO something
            and the space below them is spoken for. */}
        <ol className="grid grid-cols-5">
          {stops.map((stop, i) => (
            <li key={stop} className="flex flex-col items-center gap-3.5">
              <span className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.14em] text-ink">
                {stop}
              </span>
              <span
                ref={(node) => {
                  nodeRefs.current[i] = node;
                }}
                aria-hidden="true"
                className="h-2.5 w-2.5 rotate-45 border border-line-bright bg-void transition-[border-color,background-color] duration-[240ms]"
                style={restingNode(i === stops.length - 1)}
              />
            </li>
          ))}
        </ol>

        {/* The drops. Every step is connected to the layer — that is the claim,
            and it is cheaper to draw it than to write it.

            Centred by the SAME five-column grid as the row above, not by an
            absolute `left: 10%/30%/…`. Percentage positioning sets an element's
            left EDGE, so a 1px line at `left: 50%` has its centre half a pixel to
            the right of the true column centre — which is a whole device pixel on
            a 2x display, and read as the drop line hanging off-centre under its
            diamond. Sharing the grid means the two rows cannot drift at all,
            whatever the width or the number of steps. */}
        <div className="grid h-10 grid-cols-5" aria-hidden="true">
          {stops.map((stop, i) => (
            <div key={stop} className="flex justify-center">
              <span
                ref={(node) => {
                  dropRefs.current[i] = node;
                }}
                className="h-full w-px bg-line-bright opacity-25 transition-[background-color] duration-[240ms]"
              />
            </div>
          ))}
        </div>

        {/* The layer itself. It runs the full width — past the outermost steps —
            because a layer does not end at the last thing standing on it. */}
        <div className="bracket relative h-[104px] overflow-hidden border border-line-bright bg-panel-2">
          <div
            className="scanline pointer-events-none absolute inset-0 opacity-30"
            aria-hidden="true"
          />
          <div ref={field} aria-hidden="true" className="pointer-events-none absolute inset-0" />

          <div className="relative flex h-full items-center justify-center">
            <span className="font-mono text-[length:var(--text-data)] uppercase tracking-[0.62em] text-signal">
              LAAM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** What a reduced-motion visitor keeps: the last step lit, where the sentence lands. */
function restingNode(last: boolean) {
  return last
    ? { borderColor: "var(--color-signal)", backgroundColor: "var(--color-signal)" }
    : undefined;
}

function resetNode(node: HTMLSpanElement, last: boolean) {
  node.style.opacity = "";
  node.style.borderColor = last ? "var(--color-signal)" : "";
  node.style.backgroundColor = last ? "var(--color-signal)" : "";
}

function resetDrop(drop: HTMLSpanElement) {
  drop.style.opacity = "";
  drop.style.backgroundColor = "";
}

/** GLSL's smoothstep, so the DOM and the shader move on identical numbers. */
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
