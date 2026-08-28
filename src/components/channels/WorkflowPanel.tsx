import { PanelFrame } from "./PanelFrame";

/**
 * The shipped `multi-source-report-email` template, with its real node ids and
 * real node kinds (`agent | connector | condition | foreach | mcp`).
 */
const STEPS = [
  { label: "brief", tone: "faint", note: "agent" },
  { label: "research_laam · research_web · fetch_tasks", tone: "trace", note: "parallel" },
  { label: "synthesis", tone: "ink", note: "agent" },
  { label: "write gate", tone: "signal", note: "waiting on you" },
  { label: "send · gmail_send", tone: "faint", note: "held" },
] as const;

const TONE = {
  faint: "text-faint border-line",
  trace: "text-trace border-trace-dim",
  ink: "text-ink border-line-bright",
  signal: "text-signal border-signal",
} as const;

/** The run as a vertical waterfall — the shape a person actually watches. */
export function WorkflowPanel() {
  return (
    <PanelFrame route="/workflows" status="run #418" tone="signal">
      <div className="flex h-full flex-col gap-4">
        <dl className="grid grid-cols-3 gap-px border border-line bg-line">
          {[
            ["Workflow", "multi-source-report-email"],
            ["Trigger", "schedule"],
            ["Run", "resumable · 1 held"],
          ].map(([label, value]) => (
            <div key={label} className="bg-panel px-3 py-2.5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">{label}</dt>
              <dd className="mt-1 truncate font-mono text-[11px] text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <ol className="flex flex-col justify-center gap-2.5">
        {STEPS.map((step, index) => (
          <li key={step.label} className="flex items-stretch gap-3">
            <div className="flex w-4 flex-col items-center">
              <span
                className={`mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  step.tone === "signal" ? "bg-signal" : step.tone === "faint" ? "bg-faint" : "bg-trace"
                }`}
                aria-hidden="true"
              />
              {index < STEPS.length - 1 && <span className="w-px flex-1 bg-line" aria-hidden="true" />}
            </div>

            <div className={`flex flex-1 items-center justify-between gap-3 border px-3.5 py-2.5 ${TONE[step.tone]}`}>
              <span className="font-mono text-[11px]">{step.label}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">
                {step.note}
              </span>
            </div>
          </li>
          ))}
        </ol>

        <p className="mt-auto border-t border-line pt-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          next run tomorrow 07:00 · resumes from the held node
        </p>
      </div>
    </PanelFrame>
  );
}
