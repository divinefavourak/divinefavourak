import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',           label: 'DESKTOP',      tabClass: 'nb-tab-home',  end: true },
  { to: '/dev',        label: 'C:\\ DEV',     tabClass: 'nb-tab-blue'  },
  { to: '/leadership', label: 'D:\\ LEADER',  tabClass: 'nb-tab-coral' },
  { to: '/contact',    label: 'CONTACT.TXT',  tabClass: 'nb-tab-lime'  },
];

function OSTaskbar() {
  const [time, setTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu whenever the route changes
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const tabClassName = (tabClass) => ({ isActive }) =>
    `nb-nav-tab ${tabClass}${isActive ? ' active' : ''}`;

  return (
    <>
      <nav className="nb-taskbar" aria-label="Main navigation">
        {/* Logo — back to the desktop */}
        <NavLink to="/" className="nb-logo" aria-label="Back to desktop">
          ▓ AKANBI.OS
        </NavLink>

        {/* Desktop nav */}
        <div className="nb-nav-links">
          {NAV_ITEMS.map(({ to, label, tabClass, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={tabClassName(tabClass)}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="nb-taskbar-right">
          <span className="nb-available" aria-label="Available for work">
            <span className="nb-dot" aria-hidden="true">●</span>
            AVAILABLE
          </span>
          <span className="nb-time" aria-label="Current time">{time}</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nb-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          className="nb-mobile-overlay"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map(({ to, label, tabClass, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={`nb-mobile-link ${tabClass}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}

export default OSTaskbar;
