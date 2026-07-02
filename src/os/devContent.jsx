import React from "react";
import FadeIn from "../components/FadeIn.jsx";
import {
  SiJavascript, SiTypescript, SiPython, SiC,
  SiReact, SiNodedotjs, SiExpress,
  SiHtml5, SiCss3, SiTailwindcss, SiThreedotjs,
  SiVite, SiExpo, SiGithub,
  SiMongodb, SiPostgresql, SiGooglecloud, SiVercel,
} from "react-icons/si";

/* ============================================================
   C:\DEV — file contents
   Each export renders inside the Explorer when its file is opened.
   ============================================================ */

const projectData = [
  {
    title: "Recipe Book",
    desc: "A search engine for recipes built with vanilla JS and REST APIs. Find meals instantly by name or ingredient.",
    tech: ["JavaScript", "API", "HTML/CSS"],
    link: "https://divinefavourak.github.io/recipe-book/",
    github: "https://github.com/divinefavourak/recipe-book",
    status: "stable",
  },
  {
    title: "EduGuard AI",
    desc: "Academic fraud detection platform for modern institutions. Built with React and integrated AI analysis.",
    tech: ["React", "AI", "Vite"],
    link: "https://edu-guard-ai.vercel.app/",
    github: "https://github.com/divinefavourak/edu-guard-ai",
    status: "beta",
  },
  {
    title: "WhatsApp Bot",
    desc: "Multi-session bot with Gemini 2.5 AI integration, MongoDB auth, admin dashboard, and crash-resilient architecture.",
    tech: ["Node.js", "Express", "MongoDB", "Gemini"],
    link: "https://jesutobi-bot.onrender.com/",
    github: null,
    status: "online",
  },
  {
    title: "RCCG R63 Teens",
    desc: "Full-stack event management system with registration, ticketing, Paystack payments, QR check-ins, and approval workflows.",
    tech: ["Django", "React", "PostgreSQL", "Paystack"],
    link: "https://rccg-r63-juniorchurch.vercel.app/",
    github: null,
    status: "production",
  },
  {
    title: "Portfolio v3",
    desc: "The system you are currently browsing. Directory-OS navigation with two mounted drives — one per life.",
    tech: ["React", "Vite", "React Router"],
    link: "#",
    github: null,
    status: "live",
  },
];

const techStack = [
  { name: "JavaScript",   Icon: SiJavascript },
  { name: "TypeScript",   Icon: SiTypescript },
  { name: "Python",       Icon: SiPython },
  { name: "C",            Icon: SiC },
  { name: "React",        Icon: SiReact },
  { name: "React Native", Icon: SiReact },
  { name: "Node.js",      Icon: SiNodedotjs },
  { name: "Express",      Icon: SiExpress },
  { name: "HTML5",        Icon: SiHtml5 },
  { name: "CSS3",         Icon: SiCss3 },
  { name: "TailwindCSS",  Icon: SiTailwindcss },
  { name: "Three.js",     Icon: SiThreedotjs },
  { name: "Vite",         Icon: SiVite },
  { name: "Expo",         Icon: SiExpo },
  { name: "Git / GitHub", Icon: SiGithub },
  { name: "MongoDB",      Icon: SiMongodb },
  { name: "PostgreSQL",   Icon: SiPostgresql },
  { name: "Google Cloud", Icon: SiGooglecloud },
  { name: "Vercel",       Icon: SiVercel },
];

const timeline = [
  { date: "2021", title: "Started Programming", desc: "First lines of HTML & CSS. Fell in love with building things." },
  { date: "2022", title: "Deep Dive — JavaScript", desc: "Mastered ES6+, DOM manipulation. Built first interactive projects." },
  { date: "2023", title: "React & Full Stack", desc: "Picked up React, Node.js, and started building real apps." },
  { date: "2024–Now", title: "CS @ UNILAG", desc: "Computer Science degree. Exploring algorithms, data structures & more." },
  { date: "2025", title: "Freelance + Projects", desc: "Shipped production apps, integrated AI, led client projects." },
];

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
              <strong>Frontend Dev &amp; UI Designer</strong>
            </div>
            <div className="nb-spec-row">
              <span>Level</span>
              <strong>200L CS Student — UNILAG</strong>
            </div>
            <div className="nb-spec-row">
              <span>Loc</span>
              <strong>Lagos, Nigeria</strong>
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
