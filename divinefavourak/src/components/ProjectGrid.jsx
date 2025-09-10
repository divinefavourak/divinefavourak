import React, { useState } from "react";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    live: "https://divinefavourak.github.io/recipe-book/",
    title: "Recipe Book",
    description: "A website that allows users to search and save recipes.",
    category: "web",
    link: "https://divinefavourak.github.io/recipe-book/"
  },
  {
    live: "https://edu-guard-ai.vercel.app/",
    title: "EduGuard AI",
    description: "AI-powered academic fraud detection platform (Hackathon project).",
    category: "app",
    link: "https://edu-guard-ai.vercel.app/"
  },
  {
    image: "/portfolio-preview.png", // fallback screenshot for now
    title: "Portfolio Website",
    description: "This portfolio you’re viewing right now, built with React & Vite.",
    category: "web",
    link: "#"
  }
];

function ProjectGrid() {
  const [filter, setFilter] = useState("all");

  const filteredProjects = projects.filter(
    (p) => filter === "all" || p.category === filter
  );

  return (
    <main className="projects">
      <h1 className="page-title">
        My <span>Projects</span>
      </h1>
      <p className="page-subtitle">Here are some of my recent works</p>

      <div className="project-filter">
        {["all", "web", "app"].map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat === "all"
              ? "All"
              : cat === "web"
              ? "Web Projects"
              : "Mobile / App"}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredProjects.map((proj, i) => (
          <ProjectCard key={i} {...proj} />
        ))}
      </div>
    </main>
  );
}

export default ProjectGrid;
