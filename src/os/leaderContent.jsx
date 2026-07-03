import React from "react";
import FadeIn from "../components/FadeIn.jsx";

/* ============================================================
   D:\LEADER — file contents
   Each export renders inside the Explorer when its file is opened.
   ============================================================ */

const roles = [
  {
    icon: "👑",
    logo: "/logos/rccg.png",
    logoAlt: "RCCG logo",
    title: "Regional Teens President",
    org: "Region 63 Junior Church — RCCG",
    desc: "Regional Teens President of Region 63 Junior Church, The Redeemed Christian Church of God (RCCG). Responsible for the spiritual development, pastoral care, and welfare of teenagers across the region — organising events, overseeing regional activities, and mentoring teen leaders.",
    badge: "CURRENT",
    link: "https://rccg.org",
    linkLabel: "RCCG.ORG →",
  },
  {
    icon: "🏛️",
    logo: "/logos/dtce.png",
    logoAlt: "RCCG DTCE logo",
    title: "National Teens Vice President",
    org: "RCCG DTCE — Lagos Zone 5",
    desc: "Serving under RCCG's Directorate of Teens and Children Education (DTCE) on the National Teens Board for Lagos Zone 5 — working alongside the president to oversee teen leadership programmes, drive zone-wide strategy, coordinate outreach initiatives, and ensure the growth and spiritual health of the teens department across the zone.",
    badge: "CURRENT",
    link: null,
    linkLabel: null,
  },
];

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
            Youth Leader &amp; Church President
          </p>

          <div className="nb-role-pills">
            <span className="nb-role-pill">👑 Regional Teens President — R63, RCCG</span>
            <span className="nb-role-pill">🏛️ National Teens VP — RCCG DTCE, Lagos Zone 5</span>
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
