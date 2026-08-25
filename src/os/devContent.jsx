import React from "react";
import FadeIn from "./components/FadeIn.jsx";
import profile from "../data/profile.js";
import { projects } from "../data/projects.js";
import { stackItems } from "../data/stack.js";
import timelineData from "../data/timeline.js";

/* ============================================================
   C:\DEV — file contents
   Each export renders inside the Explorer when its file is opened.

   The data itself lives in src/data/ and is shared with the
   redesigned site, so adding a project surfaces it in both places.
   These adapters map the shared schema onto the field names this
   drive's markup was originally written against.
   ============================================================ */

const projectData = projects.map((p) => ({
  title: p.title,
  desc: p.summary,
  tech: p.stack,
  link: p.links.live,
  github: p.links.repo,
  status: p.status,
}));

const techStack = stackItems;
const timeline = timelineData;

export const devProjectCount = projectData.length;

export function DevAbout() {
  return (
    <>
      <p className="nb-dir-header">{">"} cat about.txt</p>

      <div className="nb-about-grid">
        <img
          src="/1000934452.jpg"
          alt="Divine-favour Akanbi"
          className="nb-about-img"
          loading="lazy"
        />
        <div className="nb-about-text">
          <h2>// About.txt</h2>

          <div className="nb-spec-table">
            <div className="nb-spec-row">
              <span>Name</span>
              <strong>Divine-favour</strong>
            </div>
            <div className="nb-spec-row">
              <span>Role</span>
              <strong>{profile.title}</strong>
            </div>
            <div className="nb-spec-row">
              <span>Level</span>
              <strong>CS Student — {profile.education.shortName}</strong>
            </div>
            <div className="nb-spec-row">
              <span>Loc</span>
              <strong>{profile.location}</strong>
            </div>
            <div className="nb-spec-row">
              <span>Status</span>
              <span className="nb-online-badge">● ONLINE</span>
            </div>
          </div>

          <p className="nb-bio">
            I'm a Computer Science student at the University of Lagos who breathes code and vibes with clean UI. I find joy in making things work <em>and</em> look good — bridging the gap between rough ideas and polished digital realities.
            <br /><br />
            No fluff, no filters — just <strong>growth and grind.</strong>
          </p>
        </div>
      </div>
    </>
  );
}

export function DevStack() {
  return (
    <>
      <p className="nb-dir-header">{">"} cat stack.sys &nbsp;&nbsp;({techStack.length} packages installed)</p>

      <FadeIn>
        <p className="nb-sub-label">Installed_Packages</p>
        <div className="nb-tags">
          {techStack.map(({ name, Icon }) => (
            <span key={name} className="nb-tag">
              <Icon className="nb-tag-icon" aria-hidden="true" />
              {name}
            </span>
          ))}
        </div>
      </FadeIn>
    </>
  );
}

export function DevLogs() {
  return (
    <>
      <p className="nb-dir-header">{">"} tail -f history.log</p>

      <FadeIn>
        <p className="nb-sub-label">System_Logs</p>
        <div className="nb-timeline">
          {timeline.map(({ date, title, desc }) => (
            <div className="nb-timeline-entry" key={date}>
              <div className="nb-timeline-date">{date}</div>
              <div className="nb-timeline-content">
                <div className="nb-timeline-title">{title}</div>
                <div className="nb-timeline-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </>
  );
}

export function DevProjects() {
  return (
    <>
      <p className="nb-dir-header">
        {">"} ls -la /projects &nbsp;&nbsp;({projectData.length} items)
      </p>

      <div className="nb-project-grid">
        {projectData.map((proj, i) => (
          <FadeIn key={proj.title} delay={i * 100}>
            <div
              className="nb-project-card"
              itemScope
              itemType="https://schema.org/SoftwareApplication"
            >
              <div className="nb-project-header">
                <span className="nb-project-title" itemProp="name">
                  {proj.title}
                </span>
                <span className={`nb-project-status nb-status-${proj.status}`}>
                  {proj.status.toUpperCase()}
                </span>
              </div>

              <div className="nb-project-body">
                <div className="nb-project-tech-row">
                  {proj.tech.map((t) => (
                    <span key={t} className="nb-tech-tag">{t}</span>
                  ))}
                </div>

                {proj.link && proj.link !== '#' ? (
                  <div className="nb-project-preview">
                    <div className="nb-browser-bar">
                      <span className="nb-browser-dot" />
                      <span className="nb-browser-dot" />
                      <span className="nb-browser-dot" />
                    </div>
                    <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden', background: '#fff' }}>
                      <iframe
                        src={proj.link}
                        title={`${proj.title} Preview`}
                        style={{
                          position: 'absolute', top: 0, left: 0,
                          width: '200%', height: '200%', border: 'none',
                          transform: 'scale(0.5)', transformOrigin: '0 0',
                          pointerEvents: 'none',
                        }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="nb-project-preview" style={{ background: '#111', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--lime)', fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
                    <div style={{ marginBottom: '0.4rem' }}>STATUS: {proj.status.toUpperCase()}</div>
                    <div style={{ color: '#555' }}>THIS SYSTEM</div>
                  </div>
                )}

                <p className="nb-project-desc" itemProp="description">
                  {proj.desc}
                </p>

                <div className="nb-project-actions">
                  {proj.link && proj.link !== '#' && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nb-btn nb-btn-blue"
                      itemProp="url"
                    >
                      DEMO ▶
                    </a>
                  )}
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nb-btn nb-btn-inv"
                    >
                      &lt; SOURCE &gt;
                    </a>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </>
  );
}
