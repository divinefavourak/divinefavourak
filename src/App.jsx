import React, { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Projects from "./pages/Projects.jsx";
import About from "./pages/About.jsx";
import Splash from "./pages/Splash.jsx";
import PillNav from "./components/PillNav.jsx";
import FadeIn from "./components/FadeIn.jsx";
import SectionIndicator from "./components/SectionIndicator.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import SkipToContent from "./components/SkipToContent.jsx";
import PixelTransition from "./components/PixelTransition.jsx";

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);
  const [pixelActive, setPixelActive] = useState(false);

  const handleEnter = () => {
    setPixelActive(true);
    // Remove splash once pixels are mostly covering the screen (~450ms)
    setTimeout(() => setSplashDone(true), 450);
    // Reveal main site shortly after splash is gone
    setTimeout(() => setMainVisible(true), 550);
    // Clean up pixel grid after animation completes
    setTimeout(() => setPixelActive(false), 1500);
  };

  // Smooth scroll for anchor links
  useEffect(() => {
    if (!mainVisible) return;
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.getElementById(this.getAttribute('href').substring(1));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }, [mainVisible]);

  return (
    <>
      {!splashDone && <Splash onEnter={handleEnter} />}
      <PixelTransition active={pixelActive} />

      <div
        style={{
          opacity: mainVisible ? 1 : 0,
          transition: 'opacity 0.6s ease',
          visibility: splashDone ? 'visible' : 'hidden',
        }}
      >
        <SkipToContent />
        <SectionIndicator />
        <ScrollToTop />
        <PillNav
          items={[
            { href: '#home',     label: 'Home'     },
            { href: '#about',    label: 'About'    },
            { href: '#projects', label: 'Projects' },
            { href: '#contact',  label: 'Contact'  },
          ]}
          pillColor="#ffffff"
          hoveredPillTextColor="#000000"
          baseColor="#ffffff"
        />
        <div className="main-content">
          <section id="home">
            <FadeIn>
              <Home />
            </FadeIn>
          </section>

          <section id="about">
            <FadeIn>
              <About />
            </FadeIn>
          </section>

          <section id="projects">
            <FadeIn>
              <Projects />
            </FadeIn>
          </section>

          <section id="contact">
            <FadeIn>
              <Contact />
            </FadeIn>
          </section>
        </div>
      </div>
    </>
  );
}

export default App;
