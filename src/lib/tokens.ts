/**
 * Design tokens, read at runtime.
 *
 * Canvas cannot use CSS custom properties: `strokeStyle` needs a literal. The
 * naive answer is to copy the hex next to the drawing code, which is how this
 * page ended up with one colour written out sixteen times and no token behind
 * it — the stylesheet stopped being the palette and the literals became it.
 * These read the token instead, so `tokens.css` stays the single source.
 *
 * Call from inside an effect or a layout pass, NEVER at module scope: module
 * evaluation can run before the stylesheet is applied, and the lookup then
 * returns "" — which paints black without erroring.
 */

function read(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export function tokenHex(name: string, fallback: string): string {
  return read(name, fallback);
}

/** Channels, so a token can be interpolated into `rgba(...)` with an alpha or
 *  mixed with another colour: `rgba(${tokenRgb(...).join(",")},0.5)`. */
export function tokenRgb(name: string, fallback: string): readonly [number, number, number] {
  const n = parseInt(read(name, fallback).replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
}
