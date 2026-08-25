/**
 * Display faces used by the canvas games.
 *
 * Canvas text is the awkward case in web font loading: `fillText`
 * does not participate in the normal font-loading lifecycle, so if
 * the face hasn't finished downloading the browser silently draws
 * the fallback instead — no error, no reflow, just the wrong font
 * for the first few seconds of play.
 *
 * `ensureGameFonts()` therefore explicitly awaits each face before
 * the first frame is drawn.
 *
 * This module is only ever reached through a dynamic import in
 * GameCanvas, so the font CSS and its woff2 payloads are emitted
 * into the playground chunk rather than the main bundle.
 */

import "@fontsource/orbitron/700.css";
import "@fontsource/orbitron/900.css";
import "@fontsource/bangers/400.css";
import "@fontsource/fredoka/600.css";

/**
 * Specs in CSS shorthand, which is the format document.fonts.load
 * expects. Size is irrelevant to what gets downloaded — only family
 * and weight matter — but a size is syntactically required.
 */
const FONT_SPECS = [
  '900 40px Orbitron',
  '700 20px Orbitron',
  '400 40px Bangers',
  '600 24px Fredoka',
];

/**
 * Resolve once every game face is ready to draw.
 *
 * Never rejects: a font that fails to load is a cosmetic problem,
 * and blocking the game on it would turn a degraded render into a
 * broken one.
 */
export async function ensureGameFonts() {
  if (!document.fonts?.load) return;
  await Promise.all(
    FONT_SPECS.map((spec) => document.fonts.load(spec).catch(() => {}))
  );
}

export default ensureGameFonts;
