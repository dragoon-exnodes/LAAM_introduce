import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PanelFrame } from "./PanelFrame";

/**
 * Connectors as things that PLUG INTO LAAM, which is what the panel is about —
 * a bus down the left with a port per service, not a grid of nine names that
 * could belong to any product.
 *
 * Read/write is declared per TOOL, not per connector: every service here has at
 * least one write. What differs is whether that write is `workflowSafe` — allowed
 * to run unattended behind a recipient allowlist — or fail-closed and held for a
 * person. The label is therefore about the write, never about the service.
 *
 * Four of the nine carry one. The registry has five `workflowSafe: true` tools,
 * but the fifth belongs to the credential-free `demo` connector, which is
 * internal QA and deliberately not shown — the header used to count it and read
 * "5 unattended" above four visible ALLOWLIST labels.
 */
type Port = {
  name: string;
  /** The tool that actually moves when this port is exercised. */
  tool: string;
  unattended: boolean;
};

const PORTS: readonly Port[] = [
  { name: "GitHub", tool: "github_list_repos", unattended: false },
  { name: "Jira", tool: "jira_search_issues", unattended: false },
  { name: "Trello", tool: "trello_list_cards", unattended: false },
  { name: "Drive", tool: "gdrive_search", unattended: false },
  { name: "Calendar", tool: "gcal_list_events", unattended: false },
  { name: "Gmail", tool: "gmail_send", unattended: true },
  { name: "Slack", tool: "slack_send_message", unattended: true },
  { name: "WhatsApp", tool: "whatsapp_send", unattended: true },
  { name: "Zalo OA", tool: "zalo_send_message", unattended: true },
];

/** How long each port stays lit as traffic moves down the bus. */
const DWELL_MS = 1100;

export function ConnectorsPanel({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (reduced || !active) return;
    const id = window.setTimeout(() => setLit((i) => (i + 1) % PORTS.length), DWELL_MS);
    return () => window.clearTimeout(id);
  }, [lit, active, reduced]);

  // Derived, not stored: leaving the panel costs no render and no reset effect.
  const current = active && !reduced ? lit : -1;

  return (
    <PanelFrame route="/connectors" status="4 unattended" tone="trace">
      <div className="flex h-full gap-0">
        {/* The bus. Everything to its right is docked into it. */}
        <div className="relative w-16 shrink-0">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, var(--color-line-bright) 12%, var(--color-line-bright) 88%, transparent)" }}
          />
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.3em] text-faint">
            laam
          </span>
        </div>

        <ul className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          {PORTS.map((port, i) => {
            const isLit = i === current;
            return (
              <li
                key={port.name}
                className="relative flex items-center gap-2.5"
                style={
                  reduced
                    ? undefined
                    : { animation: `dock-in 420ms var(--ease-out-expo) ${i * 55}ms backwards` }
                }
              >
                {/* The lead from the bus into this port. */}
                <span
                  aria-hidden="true"
                  className="h-px w-5 shrink-0 transition-colors duration-300"
                  style={{ background: isLit ? "var(--color-signal)" : "var(--color-line-bright)" }}
                />
                {/* The port itself: filled while traffic is on it, hollow at rest. */}
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rotate-45 transition-colors duration-300"
                  style={{
                    background: isLit ? "var(--color-signal)" : "transparent",
                    boxShadow: isLit ? "0 0 8px var(--color-signal)" : "none",
                    border: `1px solid ${isLit ? "var(--color-signal)" : "var(--color-line-bright)"}`,
                  }}
                />

                <span className="w-20 shrink-0 truncate font-mono text-[11px] text-ink">
                  {port.name}
                </span>

                {/* The tool name only surfaces on the port being exercised — nine of
                    them at once is a wall of monospace nobody reads. */}
                <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-faint">
                  {isLit ? port.tool : ""}
                </span>

                <span
                  className={`shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] ${
                    port.unattended ? "text-signal" : "text-faint"
                  }`}
                >
                  {port.unattended ? "allowlist" : "confirm only"}
                </span>
              </li>
            );
          })}

          {/* The open port. Dashed because it is not a service — it is the socket
              anything speaking MCP plugs into, which is the second half of this
              panel's headline. */}
          <li
            className="relative flex items-center gap-2.5"
            style={
              reduced
                ? undefined
                : { animation: `dock-in 420ms var(--ease-out-expo) ${PORTS.length * 55}ms backwards` }
            }
          >
            <span
              aria-hidden="true"
              className="h-px w-5 shrink-0"
              style={{ backgroundImage: "repeating-linear-gradient(to right, var(--color-line-bright) 0 3px, transparent 3px 6px)" }}
            />
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rotate-45 border border-dashed"
              style={{ borderColor: "var(--color-line-bright)" }}
            />
            <span className="w-20 shrink-0 font-mono text-[11px] text-muted">+ MCP</span>
            <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-faint">
              any server · per user
            </span>
            <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
              fail-closed
            </span>
          </li>
        </ul>
      </div>
    </PanelFrame>
  );
}
