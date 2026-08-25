import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "theme";

/**
 * Theme state, held outside React.
 *
 * Nav mounts ThemeToggle twice — once for desktop, once for mobile —
 * and CSS hides one of them. With useState each copy kept its own
 * value, so after a resize across the breakpoint the newly visible
 * toggle showed the previous theme's icon, and its first click
 * re-applied the theme that was already active.
 *
 * A module-level store with useSyncExternalStore gives every mounted
 * toggle the same value, with no provider to thread through the tree.
 */

function readStored() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* private mode, blocked site data — fall through to the OS */
  }
  return null;
}

function systemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  // The design is authored dark, so only an explicit OS preference
  // for light moves a visitor off it.
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

let current = readStored() ?? systemTheme();
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Applies the theme to <html>. Never writes to storage. */
function paint(theme) {
  const root = document.documentElement;
  // Both classes are set explicitly: the CSS guards its
  // prefers-color-scheme block with :root:not(.dark), so an explicit
  // "light" has to be present to override a dark OS.
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

/**
 * Set the theme as a deliberate choice, and remember it.
 *
 * Persistence lives here rather than in an effect. Writing on mount
 * saved the OS-derived value on a first visit, which then counted as
 * an explicit choice and stopped the site following later OS changes.
 */
export function setTheme(theme) {
  current = theme;
  paint(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* not persisting is survivable; the toggle still works */
  }
  emit();
}

export default function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    () => current,
    () => "dark"
  );

  // Keep <html> in step, including on first mount, without touching
  // storage.
  useEffect(() => {
    paint(theme);
  }, [theme]);

  // Follow the OS while the visitor has never chosen for themselves.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    if (readStored()) return;

    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (readStored()) return;
      current = systemTheme();
      paint(current);
      emit();
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return theme;
}
