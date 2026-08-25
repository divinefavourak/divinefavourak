import React from "react";
import FadeIn from "./components/FadeIn.jsx";
import sharedRoles from "../data/experience.js";

/* ============================================================
   D:\LEADER — file contents
   Each export renders inside the Explorer when its file is opened.

   Roles come from src/data/experience.js, shared with the
   redesigned site. This adapter maps the shared schema onto the
   field names this drive's markup expects.
   ============================================================ */

const roles = sharedRoles.map((r) => ({
  icon: r.kind === "Student leadership" ? "📣" : "👑",
  logo: r.logo,
  logoAlt: r.logoAlt,
  title: r.title,
  org: r.org,
  desc: r.description,
  badge: r.current ? "CURRENT" : "PAST",
  link: r.link,
  linkLabel: r.link ? new URL(r.link).hostname.replace(/^www\./, "").toUpperCase() + " →" : null,
}));

export const leaderRoleCount = roles.length;

export function LeaderProfile() {
  return (
    <>
      <p className="nb-dir-header">{">"} cat profile.txt</p>

      <div className="nb-leader-hero">
        <img
          src="/lead.jpg"
          alt="Divine-favour Akanbi — Youth Leader and Church President"
          className="nb-leader-img"
          loading="lazy"
        />

        <div className="nb-leader-hero-content">
          <h2>Divine-favour Akanbi</h2>

          <p className="nb-hero-role" style={{ borderLeftColor: 'var(--coral)', marginBottom: '1rem' }}>
            Student Leader &amp; Youth Pastor
          </p>

          {/* Rendered from shared data so a new role appears here
              automatically instead of needing a second edit. */}
          <div className="nb-role-pills">
            {roles.map((r) => (
              <span className="nb-role-pill" key={r.title}>
                {r.icon} {r.title} — {r.org}
              </span>
            ))}
          </div>

          <div className="nb-leader-logos" aria-label="Affiliated organisations">
            <img src="/logos/rccg.png" alt="The Redeemed Christian Church of God (RCCG)" title="RCCG" />
            <img src="/logos/dtce.png" alt="RCCG Directorate of Teens and Children Education (DTCE)" title="RCCG DTCE" />
          </div>

          <p className="nb-bio">
            Beyond the code, I lead. Faith and service are core to who I am — mentoring teens, building communities, and steering the next generation with purpose and direction.
          </p>
        </div>
      </div>
    </>
  );
}

export function LeaderRoles() {
  return (
    <>
      <p className="nb-dir-header">
        {">"} ls -la /roles &nbsp;&nbsp;({roles.length} roles)
      </p>

      <div className="nb-role-grid">
        {roles.map((role, i) => (
          <FadeIn key={role.title} delay={i * 150}>
            <div className="nb-role-card">
              <div className="nb-role-card-bar">
                <div className="nb-role-card-bar-title">
                  {role.logo ? (
                    <img src={role.logo} alt={role.logoAlt} className="nb-role-logo" />
                  ) : (
                    <span className="nb-role-icon" aria-hidden="true">{role.icon}</span>
                  )}
                  <span className="nb-role-card-title">{role.title}</span>
                </div>
                <span className="nb-role-badge">{role.badge}</span>
              </div>

              <div className="nb-role-card-body">
                <p className="nb-role-org">{role.org}</p>
                <p className="nb-role-desc">{role.desc}</p>

                {role.link && (
                  <div>
                    <a
                      href={role.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nb-btn nb-btn-coral"
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.9rem' }}
                    >
                      {role.linkLabel}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </>
  );
}
