import { useEffect, useRef, useState } from "react";
import { hasLink } from "../../data/projects.js";

/**
 * The visual for a project card.
 *
 * Three tiers, best first:
 *
 *   1. `project.image` — a real screenshot in public/work/. Always
 *      preferred: fastest, art-directable, and works offline.
 *   2. A live preview of the deployed site, framed and scaled down.
 *      This is what the previous portfolio did, and it means a
 *      project never ships without a visual. The frame is inert
 *      (pointer-events: none) so it reads as an image, and it only
 *      mounts once scrolled near the viewport — five eagerly-loaded
 *      iframes would cost more than the rest of the page combined.
 *   3. A typographic plate, for work with no public URL at all
 *      (unreleased apps, client design work).
 *
 * Tier 2 can fail silently: a site that sends X-Frame-Options DENY
 * renders an empty frame. `onLoad` can't distinguish that, so the
 * plate sits behind the frame as a permanent backdrop rather than
 * being swapped out — a blocked frame degrades to tier 3 on its own.
 */
export default function ProjectPreview({ project, fill = false }) {
  const { title, category, image, links, preview } = project;
  // `preview: "plate"` opts a project out of live framing — for a
  // host that's down, refuses embedding, or simply doesn't
  // photograph well above the fold.
  const canFrame = preview !== "plate" && hasLink(links?.live);

  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!canFrame || image || inView) return;
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (old Safari, some in-app browsers):
    // show the preview rather than withholding it.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [canFrame, image, inView]);

  return (
    <div
      ref={ref}
      // `fill` stretches to the parent instead of holding a ratio,
      // for the flagship card where the preview pane has to match
      // the height of the detail pane beside it.
      className={
        "relative w-full overflow-hidden border border-rule bg-raised " +
        (fill ? "h-full min-h-[20rem]" : "aspect-[16/10]")
      }
    >
      {/* Tier 3 — always rendered, acts as the backdrop. */}
      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <div>
          <p className="font-display text-2xl leading-tight text-muted">
            {title}
          </p>
          <p className="label mt-2">{category}</p>
        </div>
      </div>

      {/* Tier 1 */}
      {image && (
        <img
          src={image}
          alt={`${title} — interface preview`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
      )}

      {/* Tier 2 */}
      {!image && canFrame && inView && (
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden bg-white"
        >
          <iframe
            src={links.live}
            title={`${title} — live preview`}
            loading="lazy"
            tabIndex={-1}
            scrolling="no"
            sandbox="allow-scripts allow-same-origin"
            // Rendered at 200% and scaled to 50% so the framed page
            // lays out at a desktop width instead of collapsing into
            // its mobile breakpoint inside a narrow card.
            className="absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0"
            style={{ pointerEvents: "none" }}
          />
        </div>
      )}
    </div>
  );
}
