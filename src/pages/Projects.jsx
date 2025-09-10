import React from "react";
import Navbar from "../components/Navbar";
import ProjectGrid from "../components/ProjectGrid";
import DarkModeToggle from "../components/DarkModeToggle";

function Projects() {
  return (
    <div className="container">
      <Navbar />
      <ProjectGrid />
      <DarkModeToggle />

      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
    </div>
  );
}

export default Projects;
