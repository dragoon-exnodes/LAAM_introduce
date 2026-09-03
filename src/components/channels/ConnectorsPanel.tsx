import { useEffect, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ConnectorStreams } from "./ConnectorStreams";
import { PanelFrame } from "./PanelFrame";

/**
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
const CONNECTORS = [
  { name: "GitHub", tool: "github_list_repos", unattended: false },
  { name: "Jira", tool: "jira_search_issues", unattended: false },
  { name: "Trello", tool: "trello_list_cards", unattended: false },
  { name: "Drive", tool: "gdrive_search", unattended: false },
  { name: "Calendar", tool: "gcal_list_events", unattended: false },
  { name: "Gmail", tool: "gmail_send", unattended: true },
  { name: "Slack", tool: "slack_send_message", unattended: true },
  { name: "WhatsApp", tool: "whatsapp_send", unattended: true },
  { name: "Zalo OA", tool: "zalo_send_message", unattended: true },
] as const;

/** How long traffic dwells on one connector before moving to the next. */
const DWELL_MS = 1600;

export function ConnectorsPanel({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (reduced || !active) return;
    const id = window.setTimeout(() => setLit((i) => (i + 1) % CONNECTORS.length), DWELL_MS);
    return () => window.clearTimeout(id);
  }, [lit, active, reduced]);

  // Derived, not stored: leaving the panel costs no render and no reset effect.
  const current = active && !reduced ? lit : -1;

  return (
    <PanelFrame route="/connectors" status="4 unattended" tone="trace">
      <div className="relative h-full">
        <ConnectorStreams streams={CONNECTORS} litIndex={current} />

        {/* Labels stay HTML over the canvas: crisp at any DPR, selectable, and
            readable as the list of services they are. The canvas draws each
            strand to the row's vertical centre, so the two stay registered. */}
        <ul className="absolute inset-y-0 right-0 m-0 flex list-none flex-col justify-center gap-0 p-0" style={{ height: "100%" }}>
          {CONNECTORS.map((c, i) => {
            const isLit = i === current;
            return (
              <li
                key={c.name}
                className="flex flex-1 items-center justify-end gap-2.5 pr-1 text-right"
                style={
                  reduced
                    ? undefined
                    : { animation: `dock-in 460ms var(--ease-out-expo) ${i * 55}ms backwards` }
                }
              >
                {/* Only the connector carrying traffic names its tool — nine at
                    once is a wall of monospace nobody reads. */}
                <span className="min-w-0 truncate font-mono text-[10px] text-faint transition-opacity duration-300" style={{ opacity: isLit ? 1 : 0 }}>
                  {c.tool}
                </span>
                <span
                  className="shrink-0 font-mono text-[11px] transition-colors duration-300"
                  style={{ color: isLit ? "var(--color-signal)" : "var(--color-ink)" }}
                >
                  {c.name}
                </span>
                <span
                  className={`w-[4.5rem] shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] ${
                    c.unattended ? "text-signal/70" : "text-faint"
                  }`}
                >
                  {c.unattended ? "allowlist" : "confirm"}
                </span>
              </li>
            );
          })}
        </ul>

        {/* The core's own caption, and the open socket. Bottom-left, clear of the
            strands, which all leave the core to the right. */}
        <div className="absolute bottom-0 left-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">laam</p>
          <p className="mt-1.5 font-mono text-[10px] text-faint">
            + any MCP server
            <span className="ml-2 text-line-bright">fail-closed · per user</span>
          </p>
        </div>
      </div>
    </PanelFrame>
  );
}
