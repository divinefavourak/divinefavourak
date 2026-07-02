import React, { useState, useEffect, useRef } from "react";

const BOOT_LINES = [
  { text: "> Initializing AKANBI.OS v2.0...", delay: 400 },
  { text: "> Loading kernel modules.............", delay: 800 },
  { text: "> Mounting /dev/frontend......... [OK]", delay: 1200, ok: true },
  { text: "> Mounting /dev/leader........... [OK]", delay: 1600, ok: true },
  { text: "> Connecting to Lagos, NG......... [OK]", delay: 2000, ok: true },
  { text: "> Running integrity checks.........", delay: 2400 },
  { text: "> All systems nominal............. [OK]", delay: 2700, ok: true },
  { text: "> SYSTEM READY", delay: 3000, ok: true },
];

function Splash({ onEnter }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    // Show lines one by one
    BOOT_LINES.forEach(({ delay }, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, delay);
    });

    // Start progress bar
    setTimeout(() => setProgressLoaded(true), 600);

    // Show button after all lines
    setTimeout(() => setShowBtn(true), 3300);
  }, []);

  return (
    <div className="nb-boot-screen" role="main" aria-label="Boot screen">
      <div className="nb-boot-logo" aria-label="AKANBI OS">AKANBI.OS</div>
      <p className="nb-boot-version">v2.0 — DUAL CORE EDITION</p>

      <div className="nb-boot-log" aria-live="polite" aria-label="Boot log">
        {BOOT_LINES.map((line, i) => (
          <div
            key={i}
            className={`nb-boot-line ${visibleLines.includes(i) ? 'visible' : ''}`}
          >
            {line.ok
              ? (
                <>
                  {line.text.replace('[OK]', '')}
                  <span className="ok">[OK]</span>
                </>
              )
              : line.text
            }
          </div>
        ))}
      </div>

      <div className="nb-boot-progress-wrap" role="progressbar" aria-valuemin="0" aria-valuemax="100">
        <div className={`nb-boot-progress-bar ${progressLoaded ? 'loaded' : ''}`} />
      </div>

      <button
        className={`nb-boot-btn ${showBtn ? 'show' : ''}`}
        onClick={onEnter}
        aria-label="Enter portfolio"
      >
        [ PRESS ANY KEY TO BOOT ]
      </button>
    </div>
  );
}

export default Splash;
