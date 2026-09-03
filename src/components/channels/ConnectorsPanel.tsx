import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

/**
 * Read/write is declared per TOOL, not per connector — every connector here has at
 * least one write. What differs is whether a write is `workflowSafe`, i.e. allowed
 * to run unattended behind a recipient allowlist. Showing this per connector would
 * misrepresent the model, so the label is about the write, not the service.
 *
 * Four of the nine carry one. The registry has five `workflowSafe: true` tools, but
 * the fifth belongs to the credential-free `demo` connector, which is internal QA
 * and is deliberately not on this grid — the header used to count it and read
 * "5 unattended" over four visible ALLOWLIST labels.
 */
const CONNECTORS = [
  { name: "GitHub", unattended: false },
  { name: "Jira", unattended: false },
  { name: "Trello", unattended: false },
  { name: "Drive", unattended: false },
  { name: "Calendar", unattended: false },
  { name: "Gmail", unattended: true },
  { name: "Slack", unattended: true },
  { name: "WhatsApp", unattended: true },
  { name: "Zalo OA", unattended: true },
] as const;

/**
 * A loop of real tool calls through those connectors.
 *
 * The panel's own first claim is "write tools gated, never silent", and it was
 * text with half a panel of empty space under it. Reads sail through; the write
 * stops dead at a confirmation card and stays there. That is the whole safety
 * model of the product in one animation, and it is the reason the grid above
 * says "confirm only" on five of its tiles.
 *
 * Tool names are the real ones from LAAM's connector registry.
 */
type Call = {
  tool: string;
  connector: string;
  kind: "read" | "write";
  /** How long this step holds before the next, in ms. */
  ms: number;
};

const CALLS: readonly Call[] = [
  { tool: "github_list_repos", connector: "GitHub", kind: "read", ms: 1100 },
  { tool: "gdrive_search", connector: "Drive", kind: "read", ms: 1100 },
  // The long one: nothing proceeds until a person says so.
  { tool: "slack_send_message", connector: "Slack", kind: "write", ms: 3600 },
];

export function ConnectorsPanel({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced || !active) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % CALLS.length), CALLS[step].ms);
    return () => window.clearTimeout(id);
  }, [step, active, reduced]);

  // Derived, not stored: leaving the panel costs no render and no reset effect.
  const shown = active && !reduced ? step : CALLS.length - 1;
  const current = CALLS[shown];
  const gated = current.kind === "write";

  return (
    <PanelFrame route="/connectors" status="4 unattended" tone="trace">
      <div className="flex h-full flex-col gap-4">
        <div className="grid shrink-0 grid-cols-3 gap-px bg-line">
          {CONNECTORS.map((connector) => {
            const calling = connector.name === current.connector;
            return (
              <div
                key={connector.name}
                className="bg-panel px-3 py-3.5 transition-colors duration-300"
                style={
                  calling
                    ? { background: "rgba(34,211,238,0.07)", boxShadow: "inset 2px 0 0 var(--color-signal)" }
                    : undefined
                }
              >
                <p className="truncate font-mono text-[11px] text-ink">{connector.name}</p>
                <p
                  className={`mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] ${
                    connector.unattended ? "text-signal" : "text-faint"
                  }`}
                >
                  {connector.unattended ? "allowlist" : "confirm only"}
                </p>
              </div>
            );
          })}
        </div>

        {/* The call in flight, and what happens to it. */}
        <div className="min-h-0 flex-1">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              tool call
            </span>
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.16em] ${
                gated ? "text-signal" : "text-trace"
              }`}
            >
              {gated ? "write · held" : "read · passed"}
            </span>
          </div>

          <p
            key={current.tool}
            className="mt-2.5 font-mono text-[12px] text-ink"
            style={reduced ? undefined : { animation: "channel-in 320ms var(--ease-out-expo) both" }}
          >
            <span className="text-faint">›</span> {current.tool}
          </p>

          {/* LAAM's own write gate, in the shape the product renders it: title,
              the fields being sent, then confirm/cancel. It is the thing a
              partner most needs to believe, so it is shown rather than claimed. */}
          {gated && (
            <div
              className="mt-3.5 rounded-xl border p-3.5"
              style={{
                borderColor: "rgba(34,211,238,0.35)",
                background: "rgba(34,211,238,0.06)",
                animation: reduced ? undefined : "channel-in 380ms var(--ease-out-expo) both",
              }}
            >
              <p className="font-mono text-[11px] text-ink">Action needs confirmation</p>
              <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[10.5px]">
                <dt className="text-faint">channel</dt>
                <dd className="text-muted">#release-ops</dd>
                <dt className="text-faint">message</dt>
                <dd className="truncate text-muted">Nightly report is ready — 3 sources</dd>
              </dl>
              <div className="mt-3.5 flex gap-2">
                <span className="rounded-lg bg-signal px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-void">
                  confirm
                </span>
                <span className="rounded-lg border border-line-bright px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  cancel
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border border-dashed border-line-bright px-3.5 py-3">
          <p className="font-mono text-[11px] text-muted">+ mount an MCP server</p>
          <p className="mt-1 font-mono text-[10px] text-faint">
            fail-closed by default · SSRF guarded · per user
          </p>
        </div>
      </div>
    </PanelFrame>
  );
}
