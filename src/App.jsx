import React, { useEffect } from "react";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Projects from "./pages/Projects.jsx";
import About from "./pages/About.jsx";
import Navbar from "./components/Navbar.jsx";
import FadeIn from "./components/FadeIn.jsx";

function App() {
  // Smooth scroll for anchor links
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <>
      <Navbar />
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
    </>
  );
}

export default App;
