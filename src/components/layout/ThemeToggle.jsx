import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

/**
 * Resolve the theme to apply on first paint.
 *
 * Three states, not two: an explicit stored choice wins; otherwise
 * we follow the OS. Storage access is wrapped because it throws
 * outright in some privacy modes rather than returning null.
 */
function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* private mode, blocked site data — fall through to the OS */
  }
  return null;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    // The design is authored dark, so that's the default. Only a
    // stored choice, or an explicit OS preference for light, moves
    // a visitor off it.
    return (
      readStoredTheme() ??
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark")
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    // Both classes are set explicitly. The CSS guards its
    // prefers-color-scheme block with :root:not(.light), so an
    // explicit "light" has to be present to override a dark OS.
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* not persisting is survivable; the toggle still works */
    }
  }, [theme]);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-ink"
    >
      {/* Sun and moon are drawn inline rather than pulled from an
          icon set — two glyphs don't justify a dependency. */}
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
    </button>
  );
}
