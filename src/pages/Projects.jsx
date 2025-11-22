import React from "react";

const projectData = [
  {
    title: "Recipe Book",
    desc: "A search engine for recipes built with JS. Find meals instantly.",
    tech: "JAVASCRIPT / API",
    link: "https://divinefavourak.github.io/recipe-book/"
  },
  {
    title: "EduGuard AI",
    desc: "Academic fraud detection platform for modern institutions.",
    tech: "REACT / AI INTEGRATION",
    link: "https://edu-guard-ai.vercel.app/"
  },
  {
    title: "Portfolio v1",
    desc: "The current system you are viewing. High performance.",
    tech: "REACT / VITE",
    link: "#"
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