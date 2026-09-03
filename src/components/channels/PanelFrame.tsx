type Props = {
  route: string;
  status: string;
  tone?: "signal" | "trace" | "ion" | "free";
  children: React.ReactNode;
};

const TONE = {
  signal: "text-signal",
  trace: "text-trace",
  ion: "text-ion",
  free: "text-free",
} as const;

/** Shared chrome for every channel readout, so the console reads as one device. */
export function PanelFrame({ route, status, tone = "trace", children }: Props) {
  return (
    /*
     * The floor matters as much as `h-full`. In the stacked (mobile / tablet
     * portrait) layout the surrounding frame carries only a MIN height, so there
     * is no definite height for `h-full` to resolve against and it computes to 0.
     * Panels that size their body with `flex-1` then get nothing: the workflow
     * DAG collapsed to a 2px band and the connector canvas drew into a zero-height
     * box. One floor here fixes every panel, including ones written later.
     */
    <div className="flex h-full min-h-[19rem] flex-col">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{route}</span>
        <span className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] ${TONE[tone]}`}>
          <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
          {status}
        </span>
      </header>
      {/* A flex column, not a plain box. Panels used to fill this with `h-full`
          — height:100% — but its own height comes from flexing, and a percentage
          against a flex-sized parent does not resolve. That is what left the
          workflow DAG a 2px band on tablet and phone even after the frame had a
          floor. Children now use flex-1 and take the space directly. */}
      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">{children}</div>
    </div>
  );
}
