import React, { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-logo">
          <a href="#home" className="logo">
            &lt; Akanbi.Dev /&gt;
          </a>
        </div>

        {/* Mobile Toggle Button (Morphing Hamburger) */}
        <div className={`nav-toggle ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#home" onClick={handleNavClick}>Home</a>
          <a href="#about" onClick={handleNavClick}>About</a>
          <a href="#projects" onClick={handleNavClick}>Projects</a>
          <a href="#contact" onClick={handleNavClick}>Contact</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
