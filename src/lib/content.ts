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
 *
 * That claim has to be earned, and two labels were not earning it. `Telemetry` and
 * `Recall` were editorial inventions dressed as nomenclature — the routes are
 * `/monitoring` and `/search`, the panel frames print those routes, and the hero's
 * constellation already labels the same two surfaces `Monitoring` and `Search`. So
 * one page was naming seven surfaces with two different vocabularies, and the
 * invented half was the harder half to read. They now match everywhere. (`Telemetry`
 * carried a second problem: it is the vocabulary of the product this page used to
 * be selling.)
 */
export type Channel = {
  route: string;
  label: string;
  panel: PanelKey;
  tone: "signal" | "trace" | "ion";
};

export const CHANNELS: readonly Channel[] = [
  { route: "/monitoring", label: "Monitoring", panel: "monitoring", tone: "signal" },
  { route: "/chat", label: "Assistant", panel: "chat", tone: "trace" },
  { route: "/constellation", label: "Voice", panel: "voice", tone: "ion" },
  { route: "/workflows", label: "Automation", panel: "workflow", tone: "signal" },
  { route: "/connectors", label: "Connectors", panel: "connectors", tone: "trace" },
  { route: "/search", label: "Search", panel: "search", tone: "trace" },
  { route: "/settings/access", label: "Access", panel: "access", tone: "signal" },
] as const;

