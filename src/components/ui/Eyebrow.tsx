import { ScrambleText } from "./ScrambleText";

type Props = {
  children: React.ReactNode;
  tone?: "muted" | "signal" | "trace" | "ion" | "free";
  /** Decode the label on first view. Only valid when children is a plain string. */
  scramble?: boolean;
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  muted: "text-faint",
  signal: "text-signal",
  trace: "text-trace",
  ion: "text-ion",
  free: "text-free",
};

/**
 * Section markers are the product's own route names, not 01/02/03 — the label
 * carries real information about where the capability lives.
 */
export function Eyebrow({ children, tone = "muted", scramble = false }: Props) {
  const className = `font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.22em] ${TONE[tone]}`;

  if (scramble && typeof children === "string") {
    return <ScrambleText text={children} className={className} />;
  }

  return <span className={className}>{children}</span>;
}
