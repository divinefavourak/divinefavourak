/**
 * Playground registry.
 *
 * Engines are loaded lazily (dynamic import) so ~45 KB of game code
 * never reaches a visitor who doesn't press Play. Each loader
 * resolves to a `createGame(canvas)` factory returning `{ destroy }`.
 *
 * The display faces the engines draw with are handled centrally by
 * src/games/gameFonts.js, which GameCanvas awaits before the first
 * frame — canvas fillText silently falls back if a face isn't ready.
 */

export const games = [
  {
    slug: "mosquito-blaster",
    title: "Mosquito Blaster",
    subtitle: "Naija Malaria Slayer",
    year: "2025",
    blurb:
      "A twin-stick shooter about the country's most persistent enemy. Wave-based, with power-ups named after things every Nigerian understands.",
    controls: "Move to aim · Click to shoot · Esc to pause",
    accent: "#AAFF00",
    width: 800,
    height: 600,
    load: () => import("../games/engines/mosquitoBlaster.js"),
  },
  {
    slug: "jollof-color-mismatch",
    title: "Jollof Color Mismatch",
    subtitle: "Naija vs Ghana",
    year: "2025",
    blurb:
      "A colour-matching reflex game wrapped in the only debate that matters. Sixty seconds, one grid, escalating combos.",
    controls: "Click the tile that doesn't match · 60 seconds",
    accent: "#FF4D00",
    width: 800,
    height: 600,
    load: () => import("../games/engines/jollofMismatch.js"),
  },
];

export function getGame(slug) {
  return games.find((g) => g.slug === slug) ?? null;
}

export default games;
