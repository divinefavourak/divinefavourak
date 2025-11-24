import React from "react";

function About() {
  const techStack = [
    "JavaScript", "TypeScript", "Python", "C", "HTML5/CSS3",
    "React", "React Native", "Node.js", "TailwindCSS", "Three.js",
    "Expo", "Vite", "Git/GitHub", "Google Cloud", "Vercel"
  ];

  return (
    <div className="container" style={{ paddingBottom: "3rem" }}>
      <div className="terminal-window">
        <h1 style={{ textAlign: "center", borderBottom: "1px solid var(--accent-gray)", paddingBottom: "1rem", marginBottom: "2rem" }}>
          &gt; System_Information
        </h1>

        <div className="specs-grid">
          {/* Left Column: Stats */}
          <div className="spec-box">
            <h3 style={{ color: "var(--dim-color)", marginBottom: "1rem", borderBottom: "1px dashed var(--accent-gray)", paddingBottom: "0.5rem" }}>// User_Stats</h3>
            
            <div className="spec-row">
              <span style={{ color: "var(--dim-color)" }}>Name:</span>
              <strong>Divine-favour</strong>
            </div>
            <div className="spec-row">
              <span style={{ color: "var(--dim-color)" }}>Role:</span>
              <strong>Frontend Dev</strong>
            </div>
            <div className="spec-row">
              <span style={{ color: "var(--dim-color)" }}>Level:</span>
              <strong>200L Student</strong>
            </div>
            <div className="spec-row">
              <span style={{ color: "var(--dim-color)" }}>Loc:</span>
              <strong>Lagos, NG</strong>
            </div>
            <div className="spec-row">
              <span style={{ color: "var(--dim-color)" }}>Status:</span>
              <strong style={{ color: "var(--primary-color)" }}>Online</strong>
            </div>
          </div>

          {/* Right Column: Bio */}
          <div className="spec-box">
            <h3 style={{ color: "var(--dim-color)", marginBottom: "1rem", borderBottom: "1px dashed var(--accent-gray)", paddingBottom: "0.5rem" }}>// Execute_Bio.exe</h3>
            
            <p style={{ marginBottom: "1rem", lineHeight: "1.8", color: "var(--primary-color)" }}>
              &gt; <strong>Identity Confirmed:</strong> Akanbi Divine-favour Solomon.
            </p>
            <p style={{ marginBottom: "1rem", color: "#ccc" }}>
              I am a 200-level Computer Science student at the University of Lagos. I breathe code, vibe with clean UI, and find joy in making things work and look good.
            </p>
            <p style={{ marginBottom: "1rem", color: "#ccc" }}>
              I keep it real — <strong>no fluff, no filters, just growth and grind.</strong> My goal is to bridge the gap between rough ideas and polished digital realities.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="spec-box" style={{ marginTop: "2rem" }}>
           <h3 style={{ color: "var(--dim-color)", marginBottom: "1rem", borderBottom: "1px dashed var(--accent-gray)", paddingBottom: "0.5rem" }}>// Installed_Dependencies</h3>
           <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {techStack.map((tech, index) => (
                <span key={index} style={{ 
                  border: "1px solid var(--dim-color)", 
                  padding: "0.3rem 0.8rem", 
                  fontSize: "0.85rem",
                  color: "var(--primary-color)",
                  backgroundColor: "#111"
                }}>
                  [{tech}]
                </span>
              ))}
           </div>
        </div>

        {/* Fixed Button at Bottom */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <a href="/projects" className="btn">
              Run_Diagnostics &gt;
            </a>
        </div>

      </div>
    </div>
  );
}

export default About;
