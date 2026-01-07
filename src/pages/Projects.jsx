import React from "react";
import FadeIn from "../components/FadeIn.jsx";

const projectData = [
  {
    title: "Recipe Book",
    desc: "A search engine for recipes built with JS. Find meals instantly.",
    tech: "JAVASCRIPT / API",
    link: "https://divinefavourak.github.io/recipe-book/",
    preview: {
      status: "STABLE",
      version: "v1.0.2",
      lastDeployed: "2 months ago"
    }
  },
  {
    title: "EduGuard AI",
    desc: "Academic fraud detection platform for modern institutions.",
    tech: "REACT / AI INTEGRATION",
    link: "https://edu-guard-ai.vercel.app/",
    preview: {
      status: "BETA",
      version: "v0.9.5",
      lastDeployed: "1 week ago"
    }
  },
  {
    title: "WhatsApp Bot",
    desc: "Multi-session bot with AI integration (Gemini 2.5), MongoDB auth, admin dashboard, and remote pairing. Express backend with crash-resilient architecture.",
    tech: "NODE.JS / EXPRESS / MONGODB",
    link: "https://jesutobi-bot.onrender.com/",
    preview: {
      status: "ONLINE",
      version: "v2.3.1",
      lastDeployed: "Running..."
    }
  },
  {
    title: "RCCG R63 Teens",
    desc: "Full-stack event management system with registration, ticketing, payments (Paystack), QR check-ins, and approval workflows.",
    tech: "DJANGO / REACT / POSTGRESQL",
    link: "https://rccg-r63-juniorchurch.vercel.app/",
    preview: {
      status: "PRODUCTION",
      version: "v1.5.0",
      lastDeployed: "3 days ago"
    }
  },
  {
    title: "Portfolio v1",
    desc: "The current system you are viewing. High performance.",
    tech: "REACT / VITE",
    link: "#",
    preview: {
      status: "LIVE",
      version: "v1.0.0",
      lastDeployed: "Just now"
    }
  }
];

function Projects() {
  return (
    <div className="container" style={{ paddingBottom: "3rem" }}>
      <div className="terminal-window">
        <h1 style={{ borderBottom: "1px solid #333", paddingBottom: "1rem", marginBottom: "2rem" }}>
          &gt; dir /projects
        </h1>

        <div className="project-grid">
          {projectData.map((proj, index) => (
            <FadeIn key={index} delay={index * 150}>
              <div className="project-card">
                <h3>{proj.title}</h3>
                <p style={{
                  color: "var(--dim-color)",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                  borderBottom: "1px dashed var(--accent-gray)",
                  paddingBottom: "0.5rem"
                }}>
                  [{proj.tech}]
                </p>

                <div style={{
                  marginBottom: '1rem',
                  border: '1px solid #333',
                  background: '#000',
                  padding: '2px'
                }}>
                  {/* Browser Mockup Header */}
                  <div style={{
                    background: '#222',
                    padding: '5px 10px',
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></div>
                  </div>

                  {proj.link && proj.link !== "#" ? (
                    <div style={{
                      height: "200px",
                      width: "100%",
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      <iframe
                        src={proj.link}
                        title={`${proj.title} Preview`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "200%",
                          height: "200%",
                          border: "none",
                          transform: "scale(0.5)",
                          transformOrigin: "0 0",
                          pointerEvents: "none",
                          background: "#fff"
                        }}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div style={{
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "#111",
                      color: "var(--primary-color)",
                      fontFamily: "monospace"
                    }}>
                      <div style={{ marginBottom: "0.5rem" }}>STATUS: {proj.preview.status}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>VER: {proj.preview.version} | Last: {proj.preview.lastDeployed}</div>
                    </div>
                  )}
                </div>

                <p style={{ marginBottom: "1.5rem", fontSize: "0.95rem", lineHeight: "1.6" }}>
                  {proj.desc}
                </p>
                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: "100%", textAlign: "center" }}>
                  EXECUTE &gt;
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;