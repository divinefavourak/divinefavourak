import React, { useState, useEffect } from "react";
import FadeIn from "../components/FadeIn.jsx";

function Home() {
  // FIXED SPELLING HERE
  const name = "Akanbi Divine-favour";
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
                alt="Akanbi Divine-favour"
                className="hero-image"
              />
            </div>
          </FadeIn>

          {/* Text Section - Right on Desktop, Bottom on Mobile */}
          <FadeIn delay={200}>
            <div className="hero-content">
              <div className="typewriter-text">
                &gt; Hello, I'm {typedName}<span className="cursor"></span>
              </div>

              <div className="subtitle">Frontend Developer & UI Designer</div>

              <p className="bio-text">
                Initializing creativity... Loading design systems... <br />
                I build clean, functional web experiences with a focus on usability and minimalism.
                No fluff, just code that works.
              </p>

              <div className="btn-group">
                <a href="#projects" className="btn">View Projects</a>
                <a href="#contact" className="btn btn-secondary">Contact Me</a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}

export default Home;