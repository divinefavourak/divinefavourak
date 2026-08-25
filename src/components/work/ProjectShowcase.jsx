import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import DepthCarousel from '../reactbits/DepthCarousel.jsx';
import Reveal from '../motion/Reveal.jsx';
import { hasLink } from '../../data/projects.js';
import { projectImage } from '../../lib/projectPlate.js';
import { EASE } from '../motion/motion.js';

/**
 * The work section: a depth carousel paired with a detail panel.
 *
 * The carousel on its own can only show an image and alt text,
 * which would drop the role, stack, metrics and links these
 * projects carry — the opposite of what a data-rich portfolio
 * needs. Pairing it with a panel driven by `onChange` keeps the
 * 3D browsing and the substance.
 *
 * The panel is the accessible copy of the information: the
 * carousel's cards are decorative imagery, so the text here is what
 * a screen reader actually gets.
 */
export default function ProjectShowcase({ projects }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  const items = useMemo(
    () =>
      projects.map((p, i) => ({
        image: projectImage(p, i),
        alt: `${p.title} — ${p.category}`
      })),
    [projects]
  );

  // DepthCarousel calls this on mount and on every focus change.
  const handleChange = useCallback(i => setIndex(i), []);

  /**
   * Live previews for every card, mounted on load.
   *
   * DepthCarousel renders plain <img>s, so the generated plate is
   * all the stack would otherwise show. This layers the real
   * deployed site over each card.
   *
   * Rendering all of them up front — rather than only the focused
   * card — costs more on first load, but each iframe then mounts
   * exactly once and persists. Swapping a single iframe as the
   * carousel moved meant a fresh page load against the deployed
   * site on every navigation, which is worse for both the visitor
   * and the hosts.
   *
   * A card whose host is down or refuses framing keeps its plate
   * via the `preview: "plate"` opt-out.
   */
  const renderOverlay = useCallback(
    (_item, i) => {
      const project = projects[i];
      const live = project?.links?.live;

      // A real screenshot wins over the live frame, matching
      // ProjectPreview. Without this check, adding `image` would
      // show the screenshot in the grid but still load the iframe
      // here — paying for a preview nobody sees.
      if (project?.image) return null;
      if (project?.preview === 'plate' || !hasLink(live)) return null;

      return (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden bg-white"
        >
          <iframe
            src={live}
            title={`${project.title} — live preview`}
            loading="lazy"
            tabIndex={-1}
            scrolling="no"
            sandbox="allow-scripts allow-same-origin"
            // 250% then scaled to 40%: the card is only 300px wide,
            // and a site framed at that width would render its
            // mobile layout instead of the desktop one worth showing.
            className="absolute left-0 top-0 h-[250%] w-[250%] origin-top-left scale-[0.4] border-0"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      );
    },
    [projects]
  );

  const active = projects[index] ?? projects[0];
  if (!active) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="h-[420px] sm:h-[480px]">
          <DepthCarousel
            items={items}
            cardWidth={300}
            cardHeight={380}
            radius={18}
            tint="#05060a"
            depth={220}
            spread={90}
            tilt={22}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.2}
            blur={6}
            // Autoplay is off deliberately: each advance mounts a new
            // live iframe, so auto-cycling would hammer the deployed
            // sites with a fresh page load every few seconds.
            loop
            onChange={handleChange}
            renderOverlay={renderOverlay}
          />
        </div>
        <p className="label mt-4 text-center">
          Drag, scroll or use the arrow keys
        </p>
      </div>

      <Reveal className="lg:col-span-5">
        {/* aria-live so the panel is announced when the carousel
            moves — otherwise a keyboard user navigating the stack
            gets no feedback that the content changed. */}
        <div
          className="lg:sticky lg:top-28"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <p className="mono-meta !text-accent">
                {active.category} · {active.year}
              </p>

              <h3 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[0.95]">
                {active.title}
              </h3>

              <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted">
                {active.summary}
              </p>

              {active.parts && (
                <ul className="mt-4 space-y-1.5 border-l border-rule pl-4">
                  {active.parts.map(part => (
                    <li key={part.name} className="text-sm text-muted">
                      <span className="text-ink">{part.name}</span> —{' '}
                      {part.note}
                    </li>
                  ))}
                </ul>
              )}

              {/* Role is a fixed field, but projects may also list it
                  as a metric — filter those out or the row renders
                  twice. */}
              <dl className="mt-6 space-y-3 border-t border-rule pt-5">
                <div className="flex gap-4">
                  <dt className="label w-14 shrink-0 pt-0.5">Role</dt>
                  <dd className="text-sm">{active.role}</dd>
                </div>
                {active.metrics
                  ?.filter(m => m.label.toLowerCase() !== 'role')
                  .map(m => (
                    <div className="flex gap-4" key={m.label}>
                      <dt className="label w-16 shrink-0 pt-0.5">{m.label}</dt>
                      <dd className="text-sm text-muted">{m.value}</dd>
                    </div>
                  ))}
              </dl>

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {active.stack.map(tech => (
                  <li
                    key={tech}
                    className="rounded-full border border-rule px-3 py-1 text-[0.6875rem] text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                {active.caseStudy && (
                  <Link
                    to={`/work/${active.slug}`}
                    className="link-underline text-sm text-accent"
                  >
                    View case study ↗
                  </Link>
                )}
                {hasLink(active.links.live) && (
                  <a
                    href={active.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-muted hover:text-ink"
                  >
                    Visit site ↗
                  </a>
                )}
                {hasLink(active.links.repo) && (
                  <a
                    href={active.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-muted hover:text-ink"
                  >
                    Source ↗
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </div>
  );
}
