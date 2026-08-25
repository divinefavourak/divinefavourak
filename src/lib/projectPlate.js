/**
 * Generates a typographic "plate" for a project as an SVG data URI.
 *
 * DepthCarousel renders plain <img> elements, so it cannot show the
 * live iframe previews the cards elsewhere use. Until real
 * screenshots exist in public/work/, this stands in — and because
 * it's drawn from the project's own data it reads as a designed
 * cover rather than a missing image.
 *
 * Deterministic: the hue is derived from the slug, so a project
 * keeps the same plate across reloads and deploys.
 */

const PALETTE = {
  paper: '#12100D',
  ink: '#EFE9DE',
  muted: '#A2988A',
  accent: '#E2B279'
};

/** Stable small integer from a string. */
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** XML text nodes must not contain raw &, < or >. */
const escapeXml = s =>
  String(s).replace(
    /[&<>]/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]
  );

/**
 * @param {object} project a row from src/data/projects.js
 * @param {number} index   position, rendered as 01, 02, …
 * @returns {string} an `data:image/svg+xml,…` URI
 */
export function projectPlate(project, index = 0) {
  const w = 800;
  const h = 1000;
  const number = String(index + 1).padStart(2, '0');

  // Two accent hues rotated off the base amber, so consecutive
  // plates in the stack are distinguishable without going rainbow.
  const hue = (hash(project.slug) % 60) - 30;

  // Wrap the title by hand — SVG has no text flow, so a long title
  // would otherwise run straight off the edge.
  const words = String(project.title).split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > 14 && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  const titleSpans = lines
    .slice(0, 4)
    .map(
      (text, i) =>
        // An SVG rendered inside an <img> cannot load webfonts, so
        // this must be a system stack — it can't be Bricolage. A
        // heavy, tightly-tracked grotesque is the closest match the
        // system reliably provides.
        `<text x="64" y="${640 + i * 82}" font-family="'Segoe UI', system-ui, sans-serif" font-weight="650" letter-spacing="-2" font-size="72" fill="${PALETTE.ink}">${escapeXml(text)}</text>`
    )
    .join('');

  const stack = (project.stack || []).slice(0, 3).join('  ·  ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${PALETTE.paper}"/>
      <stop offset="100%" stop-color="hsl(${30 + hue}, 18%, 12%)"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w - 140}" cy="200" r="220" fill="${PALETTE.accent}" opacity="0.07"/>
  <text x="64" y="120" font-family="monospace" font-size="26" letter-spacing="6" fill="${PALETTE.accent}">${number}</text>
  <text x="64" y="176" font-family="monospace" font-size="22" letter-spacing="5" fill="${PALETTE.muted}">${escapeXml(String(project.category || '').toUpperCase())}</text>
  ${titleSpans}
  <text x="64" y="${h - 96}" font-family="monospace" font-size="22" letter-spacing="3" fill="${PALETTE.muted}">${escapeXml(stack)}</text>
  <rect x="64" y="${h - 64}" width="${w - 128}" height="1" fill="${PALETTE.accent}" opacity="0.35"/>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** A project's real screenshot if it has one, otherwise its plate. */
export function projectImage(project, index) {
  return project.image || projectPlate(project, index);
}
