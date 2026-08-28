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
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{route}</span>
        <span className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] ${TONE[tone]}`}>
          <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
          {status}
        </span>
      </header>
      <div className="min-h-0 flex-1 p-4 sm:p-5">{children}</div>
    </div>
  );
}
