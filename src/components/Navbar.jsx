import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-logo">
        <Link to="/" className="logo">
         &lt; Akanbi.Dev /&gt;
        </Link>
      </div>

      {/* Mobile Toggle Button (Text Based) */}
      <div className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        [ :: MENU :: ]
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        {/* Close Button (Visible only on mobile inside the menu) */}
        <span className="nav-close" onClick={() => setMenuOpen(false)}>
          [ CLOSE X ]
        </span>

        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar;
