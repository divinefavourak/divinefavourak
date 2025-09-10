import React from "react";

function Home() {
  return (
    <main className="landing">
      <div className="landing-content">
        <h1 className="animated-text">
          Hi, I'm <span>Divine</span>
        </h1>
        <h2 className="animated-subtext">Frontend Developer & UI Designer</h2>
        <p className="animated-paragraph">
          I create beautiful, responsive websites with engaging user experiences.
        </p>
        <div className="btn-group">
          <a href="/projects" className="btn btn-primary">View My Work</a>
          <a href="/contact" className="btn btn-secondary">Hire Me</a>
        </div>
      </div>

      <div className="landing-image">
        <div className="image-wrapper">
          <img src="/IMG-20250102-WA0000.jpg" alt="Profile" />
          <div className="color-spot spot-1"></div>
          <div className="color-spot spot-2"></div>
          <div className="color-spot spot-3"></div>
        </div>
      </div>
    </main>
  );
}

export default Home;
