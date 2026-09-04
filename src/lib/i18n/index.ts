import { en } from "./en";
import { vi } from "./vi";

/**
 * Locale is decided once, at module load, from the URL — and never changes after.
 *
 * A marketing page has no state worth preserving across a language switch, so
 * switching navigates instead of re-rendering. That buys a great deal: no context,
 * no provider, no hook, and every component keeps a plain module import rather
 * than becoming locale-aware. The reload also replays the boot sequence, which is
 * the right first frame for a page you have just arrived at in another language.
 *
 * The URL is the only source of truth. Nothing is remembered in storage, because
 * "English is the default" has to stay true on every fresh visit — a remembered
 * preference would quietly make the default whatever a given visitor last clicked,
 * and the page would no longer be able to say what it opens as.
 *
 * Detection accepts both shapes so the choice of hosting can come later: `/vi/...`
 * for a host that rewrites unknown paths to index.html, and `?lang=vi` for one
 * that does not. Anything else is English.
 */
export const LOCALES = ["en", "vi"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

function detect(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const { pathname, search } = window.location;
  if (/^\/vi(\/|$)/.test(pathname)) return "vi";
  if (new URLSearchParams(search).get("lang") === "vi") return "vi";
  return DEFAULT_LOCALE;
}

export const locale: Locale = detect();

/** Every string the page says in its own voice, in the locale being served. */
export const COPY = locale === "vi" ? vi : en;

/**
 * The URL for the same page in the other locale, preserving the path so a link
 * shared mid-page still lands where it was.
 *
 * Query-param form on purpose: a `/vi` path only resolves if the host rewrites
 * unknown paths to index.html, and this page does not yet know where it will
 * live. `detect()` above already reads both, so moving to path-based later is a
 * one-line change here and nothing else.
 */
export function urlForLocale(next: Locale): string {
  if (typeof window === "undefined") return "/";
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace(/^\/vi(?=\/|$)/, "") || "/";
  if (next === DEFAULT_LOCALE) url.searchParams.delete("lang");
  else url.searchParams.set("lang", next);
  return url.pathname + url.search + url.hash;
}

/**
 * `lang` drives more than screen readers here: `index.css` keys the display
 * leading off it, because Vietnamese uppercase stacks a tone mark over a
 * circumflex and needs roughly a third more line box than Latin does.
 */
export function applyDocumentLocale() {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.title = COPY.meta.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", COPY.meta.description);
}
