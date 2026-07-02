import React from 'react';
import { Link } from 'react-router-dom';

/**
 * DriveIcon — Desktop OS-style drive/folder shortcut.
 * Props:
 *   icon, label            — glyph + caption
 *   sub                    — optional small tagline under the label
 *   to                     — internal route (rendered as router Link)
 *   href                   — external/file URL (rendered as <a target=_blank>)
 *   accent                 — 'blue' | 'coral' | 'lime' | 'pink'
 */
function DriveIcon({ icon, label, sub, to, href, accent = 'blue' }) {
  const className = `nb-drive-icon nb-drive-${accent}`;

  const body = (
    <>
      <span className="nb-drive-icon-glyph">{icon}</span>
      <span className="nb-drive-icon-label">{label}</span>
      {sub && <span className="nb-drive-icon-sub">{sub}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {body}
      </Link>
    );
  }

  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  );
}

export default DriveIcon;
