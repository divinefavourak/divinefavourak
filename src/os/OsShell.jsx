import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Desktop from "./Desktop.jsx";
import Splash from "./Splash.jsx";
import Explorer from "./components/Explorer.jsx";
import OSTaskbar from "./components/OSTaskbar.jsx";
import OSStatusBar from "./components/OSStatusBar.jsx";
import PixelTransition from "./components/PixelTransition.jsx";

import "../styles/os-legacy.css";

/* ============================================================
   AKANBI.OS — the original portfolio, preserved at /os.

   This was the whole application; it is now one lazily-loaded
   route. The legacy stylesheet is imported here rather than
   globally, which does two things:

     1. every selector in it is scoped under .os-root, so its
        aggressive resets (border-radius: 0 !important, 3px black
        borders) cannot leak into the redesigned pages;
     2. because this module is only reached through React.lazy,
        Vite emits the CSS as a separate chunk — visitors who never
        find the easter egg never download it.
   ============================================================ */

/** Reset the scrollable panes when navigating between "directories". */
function RouteScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById("os-main")?.scrollTo(0, 0);
    document.querySelector(".nb-explorer-main")?.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function OsShell() {
  const [splashDone, setSplashDone] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);
  const [pixelActive, setPixelActive] = useState(false);
  const location = useLocation();

  const handleEnter = () => {
    setPixelActive(true);
    setTimeout(() => setSplashDone(true), 450);
    setTimeout(() => setMainVisible(true), 550);
    setTimeout(() => setPixelActive(false), 1500);
  };

  // Theme the shell by mounted drive: blue on C:\, coral on D:\
  const driveClass = location.pathname.startsWith("/os/dev")
    ? "os-drive-dev"
    : location.pathname.startsWith("/os/leadership")
      ? "os-drive-leader"
      : "os-drive-desktop";

  return (
    // .os-root is the hook every legacy selector hangs off. The
    // splash and pixel transition sit inside it too — their styles
    // are scoped the same way.
    <div className={`os-root ${driveClass}`}>
      {!splashDone && <Splash onEnter={handleEnter} />}
      <PixelTransition active={pixelActive} />
      <RouteScrollReset />

      <div
        style={{
          opacity: mainVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
          visibility: splashDone ? "visible" : "hidden",
        }}
      >
        <OSTaskbar />

        <div id="os-main" className="main-content">
          <Routes>
            <Route index element={<Desktop />} />
            <Route path="dev/:nodeId?" element={<Explorer driveKey="dev" />} />
            <Route
              path="leadership/:nodeId?"
              element={<Explorer driveKey="leadership" />}
            />
            <Route path="*" element={<Navigate to="/os" replace />} />
          </Routes>
        </div>

        <OSStatusBar />
      </div>
    </div>
  );
}
