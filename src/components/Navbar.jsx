import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-logo">
        <Link to="/" className="logo">
          Port<span>folio</span>
        </Link>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

        <span className="nav-close" onClick={() => setMenuOpen(false)}>
          <i className="fas fa-times"></i>
        </span>
      </div>

      <span className="nav-toggle" onClick={() => setMenuOpen(true)}>
        <i className="fas fa-bars"></i>
      </span>
    </nav>
  );
}

export default Navbar;
