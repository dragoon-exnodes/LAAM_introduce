import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * An aurora band across the top edge — the page's only ambient animation.
 *
 * It works because it is light arriving from above rather than a subject drawn in
 * the middle: it sits behind the console without trying to explain anything. Two
 * earlier attempts failed on exactly that test. A molten/plasma field was organic
 * and swirling, which read as a second, different site layered under a page whose
 * language is orthogonal and measured. A radar sweep was on-theme but is a
 * *diagram*, and a shader-drawn diagram competes with this page's real diagrams
 * and loses.
 *
 * Follows the React Bits "Aurora" background: simplex noise drives a height curve,
 * a three-stop ramp colours it across x, and a smoothstep softens the lower edge.
 * The scaffolding (lazy WebGL, DPR cap, pause when off-screen or backgrounded,
 * reduced-motion opt-out) is this project's own.
 */

const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform float uBlend;
uniform float uOpacity;
uniform vec2  uResolution;
uniform vec3  uColorStops[3];
out vec4 fragColor;

// Simplex noise (Ashima / Gustavson), 2D.
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  // Three-stop ramp across the width.
  vec3 ramp = uv.x < 0.5
    ? mix(uColorStops[0], uColorStops[1], uv.x * 2.0)
    : mix(uColorStops[1], uColorStops[2], (uv.x - 0.5) * 2.0);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);

  float intensity = 0.6 * height;
  float mid = 0.20;
  float alpha = smoothstep(mid - uBlend * 0.5, mid + uBlend * 0.5, intensity);

  float a = alpha * uOpacity;
  fragColor = vec4(intensity * ramp * a, a);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return [1, 1, 1];
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ];
}

type Props = {
  /** Three ramp stops, left to right. Defaults to the console's own palette. */
  colorStops?: [string, string, string];
  amplitude?: number;
  blend?: number;
  speed?: number;
  opacity?: number;
  className?: string;
};

export function AuroraField({
  colorStops = ["#00e1ff", "#9b8cff", "#4fbeff"],
  amplitude = 1.0,
  blend = 0.5,
  speed = 0.5,
  opacity = 0.55,
  className = "",
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = host.current;
    if (!container) return;

    let teardown: (() => void) | null = null;
    let cancelled = false;

    // ogl is ~15 kB gzipped and this is a backdrop, so it stays out of the
    // initial payload. If it has not arrived yet, the page simply has no aurora.
    (async () => {
      const ogl = await import("ogl");
      if (cancelled) return;
      teardown = mount(container, ogl);
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };

    function mount(
      container: HTMLDivElement,
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
      // Additive over the page's own darkness, so the band glows rather than sits.
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const canvas = gl.canvas;
      canvas.style.cssText = "width:100%;height:100%;display:block";
      // Purely decorative light. The other two canvases on the page are marked in
      // JSX; this one is created by the renderer, so it has to be marked here or a
      // screen reader announces an unlabelled graphic in the middle of the page.
      canvas.setAttribute("aria-hidden", "true");
      container.appendChild(canvas);

      const stops = colorStops.map(hexToRgb);
      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uBlend: { value: blend },
          uOpacity: { value: opacity },
          uResolution: { value: new Float32Array([1, 1]) },
          uColorStops: { value: stops.map((c) => new Float32Array(c)) },
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

      // getBoundingClientRect() is screen-space and shrinks with any ancestor's
      // CSS transform — this container often sits inside a `.reveal` panel that
      // GSAP holds at `scale: 0.988` from the moment it mounts (eagerly, for
      // every `.reveal` target on the page, regardless of scroll position) until
      // it scrolls into view and un-scales. Measuring in screen-space during
      // that window bakes a permanently too-small canvas: the panel's *layout*
      // size never actually changes, only its rendered transform does, so
      // ResizeObserver — which only reports layout/box-size changes — never
      // fires again to correct it. offsetWidth/Height and ResizeObserver's own
      // contentRect are both layout-space and immune to ancestor transforms, so
      // they read the panel's true final size even while it sits scaled down.
      const resizeObserver = new ResizeObserver(([entry]) => {
        setSize(entry.contentRect.width, entry.contentRect.height);
      });
      resizeObserver.observe(container);
      setSize(container.offsetWidth, container.offsetHeight);

      let raf = 0;
      let onScreen = true;
      let pageVisible = !document.hidden;
      const started = performance.now();

      const loop = (now: number) => {
        program.uniforms.uTime.value = ((now - started) * 0.001) * speed;
        renderer.render({ scene: mesh });
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
      io.observe(container);

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
    // Tuning is fixed per mount; nothing here is meant to be live-edited.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    />
  );
}
