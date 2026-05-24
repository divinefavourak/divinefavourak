import React, { useState, useEffect } from "react";
import FadeIn from "../components/FadeIn.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

function Home() {
  // FIXED SPELLING HERE
  const name = "Divine-favour Akanbi Solomon";
  const [typedName, setTypedName] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < name.length) {
        // Use functional update to ensure characters are added correctly
        setTypedName((prev) => name.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container">
      <div className="terminal-window">
        <p style={{ color: "#666", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Last Login: {new Date().toDateString()} [SECURE CONNECTION ESTABLISHED]
        </p>

        <div className="hero-section">
          {/* Image Section - Left on Desktop, Top on Mobile */}
          <FadeIn>
            <div className="hero-image-container">
              <img
                src="/1000934452.jpg"
                alt="Divine-favour Akanbi Solomon — Frontend Developer and UI Designer based in Lagos, Nigeria"
                className="hero-image"
                itemProp="image"
              />
            </div>
          </FadeIn>

          {/* Text Section - Right on Desktop, Bottom on Mobile */}
          <FadeIn delay={200}>
            <div className="hero-content">
              <StatusBadge text="Available for work!" />

              <h1 className="typewriter-text" itemProp="name">
                <span style={{ position:"absolute", width:"1px", height:"1px", padding:0, margin:"-1px", overflow:"hidden", clip:"rect(0,0,0,0)", whiteSpace:"nowrap", borderWidth:0 }}>
                  Divine-favour Akanbi Solomon — Frontend Developer &amp; UI Designer, Lagos Nigeria
                </span>
                <span aria-hidden="true">&gt; Hello, I'm {typedName}<span className="cursor"></span></span>
              </h1>

              <div className="subtitle" itemProp="jobTitle">
                <span style={{ color: "#00ff88" }}>Frontend Developer</span> & UI Designer
              </div>

              <p className="bio-text" itemProp="description">
                Initializing creativity... Loading design systems... <br />
                I build clean, functional web experiences with a focus on usability and minimalism.
                No fluff, just code that works.
              </p>

              <div className="btn-group">
                <a href="#projects" className="btn">View Projects →</a>
                <a href="#contact" className="btn btn-secondary">Contact Me →</a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}

export default Home;