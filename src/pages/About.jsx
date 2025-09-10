import React from "react";
import Navbar from "../components/Navbar";
import DarkModeToggle from "../components/DarkModeToggle";

function About() {
  return (
    <div className="container">
  

      <main className="about">
        <h1 className="page-title">About <span>Me</span></h1>
        <p className="page-subtitle">A little background about my skills and experience.</p>
        {/* Add your About content here */}
      </main>

      <DarkModeToggle />

      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
    </div>
  );
}

export default About;
