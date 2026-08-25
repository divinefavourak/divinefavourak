import React from 'react';

function OSStatusBar() {
  return (
    <footer className="nb-statusbar" role="contentinfo" aria-label="Site status bar">
      <span aria-label="System ready">
        <span style={{ color: 'var(--lime)' }}>●</span>&nbsp;READY
      </span>

      <span className="nb-status-sep" aria-hidden="true">│</span>
      <span>Lagos, NG</span>

      <span className="nb-status-sep" aria-hidden="true">│</span>

      <div className="nb-status-socials">
        <a
          href="https://github.com/divinefavourak"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <i className="fab fa-github" aria-hidden="true" />
        </a>
        <a
          href="https://linkedin.com/in/divine-favour-akanbi-999b5b385/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <i className="fab fa-linkedin-in" aria-hidden="true" />
        </a>
        <a
          href="https://x.com/akcodex1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          title="X"
        >
          <i className="fab fa-x-twitter" aria-hidden="true" />
        </a>
        <a
          href="https://instagram.com/ak.codex"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
        >
          <i className="fab fa-instagram" aria-hidden="true" />
        </a>
      </div>

      <span className="nb-status-sep" aria-hidden="true">│</span>
      <span>© {new Date().getFullYear()}</span>
    </footer>
  );
}

export default OSStatusBar;
