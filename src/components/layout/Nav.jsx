import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SiGithub, SiLinkedin, SiX, SiInstagram } from "react-icons/si";
import Container from "./Container.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import profile from "../../data/profile.js";
import { cn } from "../../lib/utils.js";
import { EASE } from "../motion/motion.js";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

/** Keyed by the `label` in profile.socials. */
const SOCIAL_ICONS = {
  GitHub: SiGithub,
  LinkedIn: SiLinkedin,
  X: SiX,
  Instagram: SiInstagram,
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    // Passive: this never calls preventDefault, and saying so lets
    // the browser scroll without waiting on it.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on navigation — without this the overlay would stay open
  // over the page the visitor just asked for.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Close when the viewport reaches the desktop breakpoint.
  //
  // The overlay and the hamburger are both md:hidden. Widening the
  // window with the menu open hid them both via CSS while menuOpen
  // stayed true — so the scroll lock below never released and no
  // control remained to close it. The page became unscrollable until
  // a reload.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => {
      if (e.matches) setMenuOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // While the overlay is open, freeze the page behind it and let
  // Escape dismiss it.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const socials = profile.socials.filter((s) => SOCIAL_ICONS[s.label]);

  return (
    <>
      <motion.header
        initial={reduced ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
          scrolled && !menuOpen
            ? "border-b border-rule bg-paper/85 backdrop-blur-md"
            : "border-b border-transparent"
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          <Link
            to="/"
            className="font-display text-xl tracking-tight transition-opacity hover:opacity-60"
          >
            {profile.name}
            <span className="text-accent">.</span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "relative px-3 py-1.5 text-sm transition-colors",
                    isActive ? "text-ink" : "text-muted hover:text-ink"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      // layoutId animates this underline between nav
                      // items rather than cross-fading it.
                      <motion.span
                        layoutId={reduced ? undefined : "nav-active"}
                        className="absolute inset-x-3 -bottom-px h-px bg-ink"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <span aria-hidden="true" className="mx-2 h-4 w-px bg-rule" />

            <ul className="flex items-center gap-1">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} — ${s.handle}`}
                      title={s.label}
                      className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-ink"
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>

            <ThemeToggle />
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center text-ink"
            >
              <span className="relative block h-3 w-6">
                {/* Two bars that rotate into an X. Transform-only, so
                    the button never changes size mid-animation. */}
                <span
                  className={cn(
                    "absolute left-0 block h-px w-6 bg-current transition-transform duration-300",
                    menuOpen ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-6 bg-current transition-transform duration-300",
                    menuOpen ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-30 bg-paper pt-16 md:hidden"
          >
            <Container className="flex h-full flex-col pb-10">
              <nav aria-label="Mobile" className="mt-6">
                <ul>
                  {LINKS.map(({ to, label, end }) => (
                    <li key={to} className="border-b border-rule">
                      <NavLink
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                          cn(
                            "block py-5 font-display text-3xl transition-opacity",
                            isActive ? "text-ink" : "text-muted"
                          )
                        }
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.label];
                  return (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted"
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {s.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto flex flex-wrap gap-3 pt-10">
                <Link to="/work" className="pill pill-filled">
                  View work
                </Link>
                <Link to="/contact" className="pill pill-accent">
                  Get in touch
                </Link>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill"
                >
                  Resume
                </a>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
