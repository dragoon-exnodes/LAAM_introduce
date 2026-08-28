import { useEffect, useRef } from "react";
import { gsap } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
  kind: "trigger" | "read" | "agent" | "gate" | "write";
};

/** The shipped "multi-source report → email" template, drawn as it actually runs. */
const NODES: readonly Node[] = [
  { id: "cron", x: 60, y: 170, label: "brief", kind: "trigger" },
  { id: "stats", x: 230, y: 60, label: "research_laam", kind: "read" },
  { id: "web", x: 230, y: 170, label: "research_web", kind: "read" },
  { id: "tasks", x: 230, y: 280, label: "fetch_tasks", kind: "read" },
  { id: "compose", x: 440, y: 170, label: "synthesis", kind: "agent" },
  { id: "gate", x: 620, y: 170, label: "write gate", kind: "gate" },
  { id: "send", x: 800, y: 170, label: "gmail_send", kind: "write" },
];

const EDGES: readonly [string, string][] = [
  ["cron", "stats"],
  ["cron", "web"],
  ["cron", "tasks"],
  ["stats", "compose"],
  ["web", "compose"],
  ["tasks", "compose"],
  ["compose", "gate"],
  ["gate", "send"],
];

const NODE_W = 132;
const NODE_H = 46;

const KIND_COLOR: Record<Node["kind"], string> = {
  trigger: "var(--color-faint)",
  read: "var(--color-trace)",
  agent: "var(--color-ink)",
  gate: "var(--color-signal)",
  write: "var(--color-signal)",
};

function nodeById(id: string): Node {
  const node = NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown workflow node: ${id}`);
  return node;
}

/** Orthogonal-ish connector: out, curve, in — reads like a wiring diagram, not a noodle. */
function edgePath(fromId: string, toId: string): string {
  const from = nodeById(fromId);
  const to = nodeById(toId);
  const x1 = from.x + NODE_W / 2;
  const y1 = from.y;
  const x2 = to.x - NODE_W / 2;
  const y2 = to.y;
  const mid = x1 + (x2 - x1) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}

export function WorkflowDiagram() {
  const root = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const svg = root.current;
    if (!svg) return;

    const paths = svg.querySelectorAll<SVGPathElement>("[data-edge]");
    const nodes = svg.querySelectorAll<SVGGElement>("[data-node]");
    const pulse = svg.querySelector<SVGCircleElement>("[data-pulse]");

    if (reduced) {
      paths.forEach((p) => p.style.setProperty("stroke-dashoffset", "0"));
      gsap.set(nodes, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set(nodes, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 72%", once: true },
        defaults: { ease: "power2.out" },
      });

      tl.to(nodes, { opacity: 1, duration: 0.5, stagger: 0.08 })
        .to(paths, { strokeDashoffset: 0, duration: 0.75, stagger: 0.06 }, 0.25)
        .fromTo(
          pulse,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, onComplete: () => runPulse(pulse) },
          ">-0.2",
        );
    }, svg);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="scroll-x">
      <svg
        ref={root}
        viewBox="0 0 900 340"
        role="img"
        aria-label="Workflow: a cron trigger fans out to three parallel read steps, converges on a compose agent, passes a write gate, then sends mail."
        className="h-auto w-full min-w-[680px]"
      >
        <defs>
          <path id="pulse-track" d={edgePath("compose", "gate")} />
        </defs>

        {EDGES.map(([from, to]) => (
          <path
            key={`${from}-${to}`}
            data-edge
            d={edgePath(from, to)}
            fill="none"
            stroke="var(--color-line-bright)"
            strokeWidth="1"
          />
        ))}

        <circle data-pulse r="3" fill="var(--color-signal)" opacity="0">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="indefinite">
            <mpath href="#pulse-track" />
          </animateMotion>
        </circle>

        {NODES.map((node) => (
          <g key={node.id} data-node>
            <rect
              x={node.x - NODE_W / 2}
              y={node.y - NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              fill="var(--color-panel)"
              stroke={node.kind === "gate" ? "var(--color-signal)" : "var(--color-line-bright)"}
              strokeWidth="1"
            />
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={KIND_COLOR[node.kind]}
              style={{ font: "500 12px var(--font-mono)", letterSpacing: "0.06em" }}
            >
              {node.label}
            </text>
          </g>
        ))}

        <text
          x={230}
          y={332}
          textAnchor="middle"
          fill="var(--color-faint)"
          style={{ font: "400 11px var(--font-mono)", letterSpacing: "0.16em" }}
        >
          RUNS IN PARALLEL
        </text>
        <text
          x={620}
          y={332}
          textAnchor="middle"
          fill="var(--color-signal)"
          style={{ font: "400 11px var(--font-mono)", letterSpacing: "0.16em" }}
        >
          STOPS FOR A HUMAN
        </text>
      </svg>
    </div>
  );
}

/** SVG SMIL motion has no declarative "start on scroll", so it is begun by hand. */
function runPulse(pulse: SVGCircleElement | null) {
  const motion = pulse?.querySelector("animateMotion") as
    | (SVGElement & { beginElement?: () => void })
    | null;
  motion?.beginElement?.();
}
