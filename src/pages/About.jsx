import React from "react";
import Navbar from "../components/Navbar";
import "../styles/About.css";
import DarkModeToggle from "../components/DarkModeToggle";

function About() {
  return (
    <div className="container">
      <main className="about">
        <h1 className="page-title">
          About <span>Me</span>
        </h1>
        <p className="page-subtitle">
          A little background about my skills and experience.
        </p>

        <section className="about-content-flex">
          <div className="about-text-block">
            <p>
              👋 Hey, I’m <strong>Akanbi Divine-favour Solomon</strong> — but you can just call me Divine.  
              I design and build digital experiences that feel simple, clean, and enjoyable to use.
            </p>

            <h3>💻 What I Do</h3>
            <p>
              I turn rough ideas in Figma into polished, responsive websites using HTML, CSS, JavaScript, React, 
              and Tailwind. My goal is to bridge the gap between design and development so the final product 
              reflects both vision <em>and</em> usability.
            </p>

            <h3>⚡ Why It Matters</h3>
            <p>
              I focus on the little details that make a big difference — accessibility, speed, and clarity.  
              If something feels confusing or clunky, I keep iterating until it’s seamless.
            </p>

            <div className="about-cta">
              <a href="/projects" className="btn-primary">
                See My Projects →
              </a>
            </div>
          </div>
        </section>
      </main>

      <DarkModeToggle />

      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
    </div>
  );
}

export default About;
