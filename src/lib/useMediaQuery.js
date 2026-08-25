import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query from JavaScript.
 *
 * Needed where a value has to reach a component as a *prop* rather
 * than a class — DepthCarousel takes its card width and spread as
 * numbers and computes layout in JS, so Tailwind breakpoints can't
 * reach it.
 *
 * Initialised from a lazy useState rather than an effect, so the
 * first render already has the right answer and the carousel doesn't
 * lay out at desktop sizes and then snap.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);

    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
