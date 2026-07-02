import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NBWindow from "../components/NBWindow.jsx";
import DriveIcon from "../components/DriveIcon.jsx";
import { DRIVES } from "../os/filesystem.jsx";

/* ============================================================
   Desktop — AKANBI.OS home screen at "/".
   Two mounted drives = two lives. Pick one to explore.
   ============================================================ */

function Desktop() {
  const name = "Divine-favour Akanbi Solomon";
  const [typedName, setTypedName] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < name.length) {
        setTypedName(name.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="nb-desktop">
      {/* Desktop shortcuts — Linux-style icon column */}
      <aside className="nb-desktop-icons" aria-label="Desktop shortcuts">
        <DriveIcon
          icon="💾"
          label={`C:\\ DEV/`}
          sub={DRIVES.dev.tagline}
          to={DRIVES.dev.route}
          accent="blue"
        />
        <DriveIcon
          icon="💾"
          label={`D:\\ LEADER/`}
          sub={DRIVES.leadership.tagline}
          to={DRIVES.leadership.route}
          accent="coral"
        />
        <DriveIcon icon="📬" label="CONTACT.TXT" to="/contact" accent="lime" />
        <DriveIcon icon="📄" label="RESUME.PDF" href="/resume.pdf" accent="pink" />
      </aside>

      <div className="nb-desktop-main">
      <NBWindow title="DIVINE-FAVOUR.EXE" accent="--yellow">
        <div className="nb-hero">
          <div className="nb-hero-img-wrap">
            <img
              src="/1000934452.jpg"
              alt="Divine-favour Akanbi Solomon — Frontend Developer and UI Designer based in Lagos, Nigeria"
              className="nb-hero-img"
              itemProp="image"
              width="300"
              height="370"
            />
          </div>

          <div className="nb-hero-content">
            <div className="nb-available-badge">
              <span className="nb-dot" aria-hidden="true">●</span>
              AVAILABLE FOR WORK
            </div>

            <h1 className="nb-hero-name" itemProp="name">
              <span className="nb-visually-hidden">
                Divine-favour Akanbi Solomon — Frontend Developer &amp; UI Designer, Lagos Nigeria
              </span>
              <span aria-hidden="true">
                {typedName}
                {!done && <span className="nb-cursor" aria-hidden="true">█</span>}
              </span>
            </h1>

            <p className="nb-hero-role" itemProp="jobTitle">
              Frontend Developer &amp; UI Designer
            </p>

            <p className="nb-hero-bio" itemProp="description">
              One person, two operating modes.<br />
              Mount a drive below to explore that side of me.
            </p>

            <div className="nb-btn-group">
              <button
                className="nb-btn nb-btn-blue"
                onClick={() => navigate(DRIVES.dev.route)}
              >
                MOUNT C:\DEV ▶
              </button>
              <button
                className="nb-btn nb-btn-coral"
                onClick={() => navigate(DRIVES.leadership.route)}
              >
                MOUNT D:\LEADER ▶
              </button>
            </div>
          </div>
        </div>
      </NBWindow>

      <p className="nb-desktop-hint">
        {">"} select a drive to mount — C:\ for code, D:\ for leadership
      </p>

      {/* Philosophy — the statement that unites both drives */}
      <div className="nb-philosophy">
        <p>"Code builds systems.<br />Leadership builds people.<br />I do both."</p>
      </div>
      </div>
    </div>
  );
}

export default Desktop;
