import { useEffect, useState } from "react";

/**
 * Vertical progress rail pinned to the right edge.
 *
 * A tick per section, with the active one labelled. It reads as a
 * table of contents you never have to open — position in the
 * document made visible without spending any horizontal space.
 *
 * Driven by IntersectionObserver rather than scroll maths: the
 * browser already knows which sections are on screen, and asking it
 * avoids recomputing offsets on every frame.
 */
export default function SectionRail({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    if (!nodes.length) return;

    // Track ratios for every section and pick the most visible, so a
    // short section sandwiched between tall ones still gets its turn
    // rather than being skipped as the page scrolls past it.
    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));

        let best = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (best) setActiveId(best);
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9] }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sections]);

  return (
    // Shown from md rather than xl. It was the clearest indication
    // of position in the document and phones never saw it; the
    // labels still wait until xl, where there's room for them.
    <nav
      aria-label="Sections"
      className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 md:block xl:right-5"
    >
      <ul className="flex flex-col items-end gap-3">
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-3"
              >
                <span
                  className={
                    "label hidden transition-all duration-300 xl:inline " +
                    (isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-70")
                  }
                >
                  {section.label}
                </span>
                <span
                  aria-hidden="true"
                  className={
                    "block h-px transition-all duration-300 " +
                    (isActive
                      ? "w-8 bg-ink"
                      : "w-4 bg-faint group-hover:w-6 group-hover:bg-muted")
                  }
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
