import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Desktop from "./pages/Desktop.jsx";
import Contact from "./pages/Contact.jsx";
import Splash from "./pages/Splash.jsx";
import Explorer from "./components/Explorer.jsx";
import OSTaskbar from "./components/OSTaskbar.jsx";
import OSStatusBar from "./components/OSStatusBar.jsx";
import SkipToContent from "./components/SkipToContent.jsx";
import PixelTransition from "./components/PixelTransition.jsx";

/** Reset the scrollable panes when navigating between "directories". */
function RouteScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById("main-content")?.scrollTo(0, 0);
    document.querySelector(".nb-explorer-main")?.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);
  const [pixelActive, setPixelActive] = useState(false);
  const location = useLocation();

  const handleEnter = () => {
    setPixelActive(true);
    // Hide splash once pixels cover screen
    setTimeout(() => setSplashDone(true), 450);
    // Reveal main site
    setTimeout(() => setMainVisible(true), 550);
    // Clean up pixel grid
    setTimeout(() => setPixelActive(false), 1500);
  };

  // Theme the whole app by mounted drive: blue on C:\, coral on D:\
  const driveClass = location.pathname.startsWith("/dev")
    ? "os-drive-dev"
    : location.pathname.startsWith("/leadership")
      ? "os-drive-leader"
      : "os-drive-desktop";

  return (
    <>
      {!splashDone && <Splash onEnter={handleEnter} />}
      <PixelTransition active={pixelActive} />
      <RouteScrollReset />

      <div
        className={driveClass}
        style={{
          opacity: mainVisible ? 1 : 0,
          transition: 'opacity 0.6s ease',
          visibility: splashDone ? 'visible' : 'hidden',
        }}
      >
        <SkipToContent />
        <OSTaskbar />

        <div
          id="main-content"
          className="main-content"
          itemScope
          itemType="https://schema.org/Person"
        >
          <Routes>
            <Route path="/" element={<Desktop />} />
            <Route path="/dev/:nodeId?" element={<Explorer driveKey="dev" />} />
            <Route path="/leadership/:nodeId?" element={<Explorer driveKey="leadership" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <OSStatusBar />
      </div>
    </>
  );
}

export default App;
