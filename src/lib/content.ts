/**
 * What the page is MADE of, as opposed to what it says.
 *
 * The prose moved to lib/i18n when the site gained a second language. What stays
 * here is the part that is identical in every locale: which channels exist, which
 * route and panel each one is, and the accent it wears.
 */

export type PanelKey =
  | "monitoring"
  | "chat"
  | "voice"
  | "workflow"
  | "connectors"
  | "search"
  | "access";

/**
 * The STRUCTURE of the seven channels — everything that is not language.
 *
 * Route, panel and tone are product facts, identical in every locale; the titles,
 * bodies and bullet points moved to lib/i18n, which holds them per language and
 * is zipped with this list by index. `label` stays here and stays English on
 * purpose: it names a surface the way `/monitoring` names a route, and the tab row
 * reads as product nomenclature rather than prose.
 */
export type Channel = {
  route: string;
  label: string;
  panel: PanelKey;
  tone: "signal" | "trace" | "ion";
};

export const CHANNELS: readonly Channel[] = [
  { route: "/monitoring", label: "Telemetry", panel: "monitoring", tone: "signal" },
  { route: "/chat", label: "Assistant", panel: "chat", tone: "trace" },
  { route: "/constellation", label: "Voice", panel: "voice", tone: "ion" },
  { route: "/workflows", label: "Automation", panel: "workflow", tone: "signal" },
  { route: "/connectors", label: "Connectors", panel: "connectors", tone: "trace" },
  { route: "/search", label: "Recall", panel: "search", tone: "trace" },
  { route: "/settings/access", label: "Access", panel: "access", tone: "signal" },
] as const;

