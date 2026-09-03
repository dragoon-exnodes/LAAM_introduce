import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ConnectorStreams } from "./ConnectorStreams";
import { PanelFrame } from "./PanelFrame";

/**
 * One axis only: is this connector wired up right now? Gold strand carrying
 * traffic if yes, cool blue line to a hollow terminal if not — the same two
 * states LAAM's own /constellation uses.
 *
 * The per-write allowlist/confirm split used to sit here as a second label
 * column. It was a different question on a different axis (declared per TOOL,
 * not per connector) and reading one off the other was easy to do and wrong.
 * The copy beside this panel still makes that point in words — "write tools
 * gated, never silent" — which is where a nuance like that belongs.
 *
 * Which are connected is fictional, like everything else on this page: a real
 * answer belongs to whoever is signed in. Some are off on purpose — an honest
 * picture of a working install has lights that are not lit yet.
 */
const CONNECTORS = [
  { name: "GitHub", connected: true },
  { name: "Jira", connected: false },
  { name: "Trello", connected: false },
  { name: "Drive", connected: true },
  { name: "Calendar", connected: false },
  { name: "Gmail", connected: true },
  { name: "Slack", connected: true },
  { name: "WhatsApp", connected: false },
  { name: "Zalo OA", connected: false },
] as const;

const CONNECTED = CONNECTORS.filter((c) => c.connected).length;

export function ConnectorsPanel() {
  const reduced = useReducedMotion();

  return (
    <PanelFrame route="/connectors" status={`${CONNECTED} connected`} tone="trace">
      {/* min-h as well as h-full. In the stacked mobile layout the frame only has
          a MIN height, so there is no definite height for `h-full` to resolve
          against and it computes to 0 — which collapsed this box, sent the
          absolutely-positioned labels out through the top of the panel, and left
          the canvas with nothing to draw into. */}
      <div className="relative min-h-0 flex-1">
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
                className="shrink-0 font-mono text-[11px]"
                style={{ color: c.connected ? "#ffce7a" : "var(--color-muted)" }}
              >
                {c.name}
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
