import type { PanelKey } from "../../lib/content";
import { MonitoringPanel } from "./MonitoringPanel";
import { ChatPanel } from "./ChatPanel";
import { VoicePanel } from "./VoicePanel";
import { WorkflowPanel } from "./WorkflowPanel";
import { ConnectorsPanel } from "./ConnectorsPanel";
import { SearchPanel } from "./SearchPanel";
import { AccessPanel } from "./AccessPanel";

/** Maps a channel to its readout, keeping JSX out of the content module. */
export function ChannelPanel({ panel, active }: { panel: PanelKey; active: boolean }) {
  switch (panel) {
    case "monitoring":
      return <MonitoringPanel active={active} />;
    case "chat":
      return <ChatPanel active={active} />;
    case "voice":
      return <VoicePanel active={active} />;
    case "workflow":
      return <WorkflowPanel active={active} />;
    case "connectors":
      return <ConnectorsPanel active={active} />;
    case "search":
      return <SearchPanel />;
    case "access":
      return <AccessPanel />;
  }
}
