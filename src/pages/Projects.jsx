import React from "react";

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
    <div className="container">
      <div className="terminal-window">
        <h1 style={{ borderBottom: "1px solid #333", paddingBottom: "1rem", marginBottom: "2rem" }}>
          &gt; dir /projects
        </h1>

        <div className="project-grid">
          {projectData.map((proj, index) => (
            <div className="project-card" key={index}>
              <h3 style={{ color: "var(--primary-color)" }}>{proj.title}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--dim-color)", marginBottom: "0.5rem", fontWeight: "bold" }}>
                [{proj.tech}]
              </p>

              {/* Preview Block: Iframe or Text Status */}
              {proj.link && proj.link !== "#" ? (
                <div style={{
                  border: "1px solid #444",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  overflow: "hidden",
                  backgroundColor: "#222"
                }}>
                  {/* Browser Mockup Header */}
                  <div style={{
                    height: "20px",
                    backgroundColor: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    paddingLeft: "8px",
                    borderBottom: "1px solid #444"
                  }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ff5f56" }}></div>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ffbd2e" }}></div>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#27c93f" }}></div>
                  </div>

                  {/* Scaled Iframe Container */}
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
                        width: "200%", // 2x width
                        height: "200%", // 2x height
                        border: "none",
                        transform: "scale(0.5)", // Scale back down
                        transformOrigin: "0 0",
                        pointerEvents: "none"
                      }}
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <div style={{
                  border: "1px dashed #444",
                  padding: "0.5rem",
                  marginBottom: "1rem",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  color: "#888"
                }}>
                  <div>STATUS: <span style={{ color: "var(--primary-color)" }}>{proj.preview.status}</span></div>
                  <div>VER: {proj.preview.version} | Last: {proj.preview.lastDeployed}</div>
                </div>
              )}

              <p style={{ marginBottom: "1.5rem", color: "#ccc" }}>{proj.desc}</p>
              <a href={proj.link} target="_blank" rel="noreferrer" className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
                EXECUTE &gt;
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;