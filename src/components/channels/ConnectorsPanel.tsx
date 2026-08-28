import { PanelFrame } from "./PanelFrame";

/**
 * Read/write is declared per TOOL, not per connector — every connector here has at
 * least one write. What differs is whether a write is `workflowSafe`, i.e. allowed
 * to run unattended behind a recipient allowlist. Exactly five are, and the rest
 * are fail-closed. Showing this per connector would misrepresent the model.
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

export function ConnectorsPanel() {
  return (
    <PanelFrame route="/connectors" status="5 unattended" tone="trace">
      <div className="flex h-full flex-col gap-4">
        <div className="grid grid-cols-3 gap-px bg-line">
          {CONNECTORS.map((connector) => (
            <div key={connector.name} className="bg-panel px-3 py-3.5">
              <p className="truncate font-mono text-[11px] text-ink">{connector.name}</p>
              <p
                className={`mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] ${
                  connector.unattended ? "text-signal" : "text-faint"
                }`}
              >
                {connector.unattended ? "allowlist" : "confirm only"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto border border-dashed border-line-bright px-3.5 py-3">
          <p className="font-mono text-[11px] text-muted">+ mount an MCP server</p>
          <p className="mt-1 font-mono text-[10px] text-faint">
            fail-closed by default · SSRF guarded · per user
          </p>
        </div>
      </div>
    </PanelFrame>
  );
}
