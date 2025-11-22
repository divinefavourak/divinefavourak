import React from "react";

function About() {
  return (
    <div className="container">
      {/* Terminal Window Container */}
      <div className="terminal-window">
        <h1 style={{ textAlign: "center", borderBottom: "1px solid #333", paddingBottom: "1rem", marginBottom: "2rem" }}>
          &gt; System_Information
        </h1>

        <div className="specs-grid">
          {/* Left Column: Stats */}
          <div className="spec-box">
            <h3 style={{ color: "var(--dim-color)", marginBottom: "1rem", borderBottom: "1px dashed #333", paddingBottom: "0.5rem" }}>// User_Stats</h3>
            
            <div className="spec-row">
              <span style={{ color: "#888" }}>Name:</span>
              <strong>Divine-favour</strong>
            </div>
            <div className="spec-row">
              <span style={{ color: "#888" }}>Role:</span>
              <strong>Frontend Dev</strong>
            </div>
            <div className="spec-row">
              <span style={{ color: "#888" }}>Level:</span>
              <strong>200L Student</strong>
            </div>
            <div className="spec-row">
              <span style={{ color: "#888" }}>Loc:</span>
              <strong>Lagos, NG</strong>
            </div>
            <div className="spec-row">
              <span style={{ color: "#888" }}>Status:</span>
              <strong style={{ color: "#0f0" }}>Online</strong>
            </div>
          </div>

          {/* Right Column: Bio */}
          <div className="spec-box">
            <h3 style={{ color: "var(--dim-color)", marginBottom: "1rem", borderBottom: "1px dashed #333", paddingBottom: "0.5rem" }}>// Execute_Bio.exe</h3>
            
            <p style={{ marginBottom: "1rem", lineHeight: "1.8", color: "var(--primary-color)" }}>
              &gt; <strong>Identity Confirmed:</strong> Akanbi Divine-favour Solomon.
            </p>
            <p style={{ marginBottom: "1rem", color: "#ccc" }}>
              I am a Computer Science student at the University of Lagos. I breathe code and vibe with clean UI. 
              My mission is to bridge the gap between rough ideas and polished digital realities.
            </p>
            <p style={{ marginBottom: "2rem", color: "#ccc" }}>
              I focus on accessibility, speed, and clarity. If a UI feels clunky, I debug until it flows like water.
            </p>
            
            <a href="/projects" className="btn">
              Run_Diagnostics &gt;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;