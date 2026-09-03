import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ConnectorStreams } from "./ConnectorStreams";
import { PanelFrame } from "./PanelFrame";

/**
 * The two things a connector panel has to say, kept on separate axes so neither
 * is mistaken for the other:
 *
 *   connected  — is it wired up right now? Drives the drawing: gold strand and
 *                traffic if yes, cool blue and a hollow terminal if not. Same
 *                two states LAAM's own /constellation uses.
 *   unattended — may its WRITE run without a person? That is declared per TOOL,
 *                not per connector: every service here has at least one write,
 *                and what differs is whether it is `workflowSafe` behind a
 *                recipient allowlist or fail-closed and held. Stays a label.
 *
 * Which are connected is fictional, like everything else on this page — a real
 * answer belongs to whoever is signed in. Some are off on purpose: an honest
 * picture of a working install has lights that are not lit yet.
 *
 * Four of the nine carry an unattended write. The registry has five
 * `workflowSafe: true` tools, but the fifth belongs to the credential-free
 * `demo` connector, which is internal QA and deliberately not shown.
 */
const CONNECTORS = [
  { name: "GitHub", connected: true, unattended: false },
  { name: "Jira", connected: false, unattended: false },
  { name: "Trello", connected: false, unattended: false },
  { name: "Drive", connected: true, unattended: false },
  { name: "Calendar", connected: false, unattended: false },
  { name: "Gmail", connected: true, unattended: true },
  { name: "Slack", connected: true, unattended: true },
  { name: "WhatsApp", connected: false, unattended: true },
  { name: "Zalo OA", connected: false, unattended: true },
] as const;

const CONNECTED = CONNECTORS.filter((c) => c.connected).length;

export function ConnectorsPanel() {
  const reduced = useReducedMotion();

  return (
    <PanelFrame route="/connectors" status={`${CONNECTED} connected`} tone="trace">
      <div className="relative h-full">
        <ConnectorStreams streams={CONNECTORS} />

        {/* Labels stay HTML over the canvas: crisp at any DPR, selectable, and
            readable as the list of services they are. The canvas lands each
            strand on the row's vertical centre, so the two stay registered. */}
        <ul className="absolute inset-y-0 right-0 m-0 flex list-none flex-col justify-center gap-0 p-0">
          {CONNECTORS.map((c, i) => (
            <li
              key={c.name}
              className="flex flex-1 items-center gap-3 pr-1"
              style={
                reduced
                  ? undefined
                  : { animation: `dock-in 460ms var(--ease-out-expo) ${i * 55}ms backwards` }
              }
            >
              {/* Fixed width and left-aligned: every name starts at the same mark,
                  so the gap to its strand is identical on all nine rows. Ragged
                  left edges were leaving the short names visibly adrift. */}
              <span
                className="w-[5.5rem] shrink-0 font-mono text-[11px]"
                style={{ color: c.connected ? "#ffce7a" : "var(--color-muted)" }}
              >
                {c.name}
              </span>
              <span
                className={`w-[4.5rem] shrink-0 text-right font-mono text-[9px] uppercase tracking-[0.14em] ${
                  c.unattended ? "text-signal/70" : "text-faint"
                }`}
              >
                {c.unattended ? "allowlist" : "confirm"}
              </span>
            </li>
          ))}
        </ul>

        {/* The core's caption and the open socket, bottom-left — clear of the
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
