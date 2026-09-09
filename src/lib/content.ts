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
 * The STRUCTURE of the channels — everything that is not language.
 *
 * Route, panel and tone are product facts, identical in every locale; the titles,
 * bodies and bullet points live in lib/i18n, which holds them per language and is
 * zipped with this list BY INDEX. Nothing in the type system enforces that pairing,
 * so the two lists have to be edited together: change the count or the order here
 * and `COPY.howItWorks.items` must move with it, or panels silently pair with the
 * wrong prose and the build still passes.
 *
 * Four, not the seven this page used to show. The marketing brief the copy now
 * follows names four surfaces under "How LAAM Works" — chat, voice, automation and
 * the connected tools — and says nothing about monitoring or search. Rather than
 * write copy the brief does not contain for two panels, the panels stand down.
 * `MonitoringPanel` and `SearchPanel` are still built and still wired through
 * `ChannelPanel`; they are simply not on the page. Adding a row back here plus a
 * matching entry in both locales is all it takes to bring one in.
 *
 * `label` stays here and stays English on purpose: it names a surface the way
 * `/chat` names a route, so the tab row reads as product nomenclature rather than
 * prose.
 */
export type Channel = {
  route: string;
  label: string;
  panel: PanelKey;
  tone: "signal" | "trace" | "ion";
};

export const CHANNELS: readonly Channel[] = [
  { route: "/chat", label: "Assistant", panel: "chat", tone: "trace" },
  { route: "/constellation", label: "Voice", panel: "voice", tone: "ion" },
  { route: "/workflows", label: "Automation", panel: "workflow", tone: "signal" },
  { route: "/connectors", label: "Connectors", panel: "connectors", tone: "trace" },
] as const;
