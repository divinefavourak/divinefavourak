import React, { useState, useEffect } from "react";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "enabled"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  }, [darkMode]);

  return (
    <div className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
      <i className={darkMode ? "fas fa-sun" : "fas fa-moon"}></i>
    </div>
  );
}

export default DarkModeToggle;
