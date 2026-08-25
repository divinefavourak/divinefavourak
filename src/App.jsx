import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import Nav from "./components/layout/Nav.jsx";
import Footer from "./components/layout/Footer.jsx";
import SkipToContent from "./components/layout/SkipToContent.jsx";
import ScrollLine from "./components/motion/ScrollLine.jsx";

import Home from "./pages/Home.jsx";
import Work from "./pages/Work.jsx";
import CaseStudy from "./pages/CaseStudy.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

/**
 * The previous portfolio, preserved as an easter egg. Lazy so that
 * neither its components nor its 1,700-line legacy stylesheet reach
 * the main bundle.
 */
const OsShell = lazy(() => import("./os/OsShell.jsx"));

/** Restore the top of the page on navigation, as a browser would. */
function ScrollToTop() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "instant" });
  }, [pathname, reduced]);

  return null;
}

/** The redesigned site: masthead, page, footer. */
function SiteLayout({ children }) {
  const location = useLocation();
  const reduced = useReducedMotion();

  return (
    <>
      <SkipToContent />
      <ScrollLine />
      <Nav />

      <div id="main-content" tabIndex={-1}>
        {/* mode="wait" lets the outgoing page finish before the
            incoming one starts, so the two never overlap mid-fade. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={location.pathname}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      <Footer />
    </>
  );
}

export default function App() {
  const location = useLocation();

  // The OS shell renders its own full-screen chrome — taskbar,
  // status bar, splash — so it deliberately bypasses SiteLayout
  // rather than nesting inside it.
  //
  // Matched on the segment boundary, not the prefix: startsWith("/os")
  // is also true for "/oscar", which would take this branch and then
  // match no inner route, rendering a blank page with no nav, footer
  // or 404.
  const isOsRoute =
    location.pathname === "/os" || location.pathname.startsWith("/os/");

  if (isOsRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-paper" />}>
        <Routes>
          <Route path="/os/*" element={<OsShell />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <ScrollToTop />
      <SiteLayout>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* The old drive URLs are in the published sitemap, so
              they redirect rather than 404. */}
          <Route path="/dev/*" element={<Navigate to="/os/dev" replace />} />
          <Route
            path="/leadership/*"
            element={<Navigate to="/os/leadership" replace />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </SiteLayout>
    </>
  );
}
