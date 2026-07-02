import React from 'react';

/**
 * NBWindow — Neobrutalist OS window chrome wrapper.
 * 
 * Props:
 *   title  {string}  - window title bar text
 *   accent {string}  - CSS variable name for bar bg, e.g. '--yellow', '--blue', '--coral', '--lime'
 *   titleInv {bool}  - if true, title text is white (for dark accent bars like coral)
 *   children         - window body content
 */
function NBWindow({ title, accent = '--yellow', titleInv = false, children }) {
  return (
    <div className="nb-window" style={{ '--window-accent': `var(${accent})` }}>
      <div className="nb-window-bar">
        <span className={`nb-window-title${titleInv ? ' inv' : ''}`}>{title}</span>
        <div className="nb-window-controls">
          <span className="nb-control">−</span>
          <span className="nb-control">□</span>
          <span className="nb-control">×</span>
        </div>
      </div>
      <div className="nb-window-body">
        {children}
      </div>
    </div>
  );
}

export default NBWindow;
