import { Link } from "react-router-dom";
import Stagger from "../motion/Stagger.jsx";
import ProjectPreview from "./ProjectPreview.jsx";
import { hasLink } from "../../data/projects.js";

/**
 * A project in the grid beneath the flagship card.
 *
 * Image-led and compact: the preview does the work, the text is
 * reduced to what you need to decide whether to click. Anything
 * longer belongs on the case study, not here.
 */
export default function ProjectCard({ project, index }) {
  const { slug, title, year, category, summary, stack, links, caseStudy } =
    project;

  const number = String(index + 1).padStart(2, "0");
  const hasPage = Boolean(caseStudy);

  const Wrapper = hasPage ? Link : "div";
  const wrapperProps = hasPage
    ? { to: `/work/${slug}`, "aria-label": `${title} — read the case study` }
    : {};

  return (
    // h-full on both the item and the wrapper: grid rows stretch by
    // default, but only the direct child gets that height, so it has
    // to be passed down or cards with less text end up short.
    <Stagger.Item as="li" className="group h-full">
      <Wrapper
        {...wrapperProps}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-raised transition-colors hover:border-muted"
      >
        <div className="relative">
          <span
            aria-hidden="true"
            className="numeral absolute right-4 top-4 z-10 text-xs tracking-[0.2em] text-muted"
          >
            {number}
          </span>
          {/* The card owns the border and radius, so the preview's
              own frame is stripped here. */}
          <div className="[&>div]:rounded-none [&>div]:border-0 [&>div]:border-b [&>div]:border-rule">
            <ProjectPreview project={project} />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="mono-meta !leading-none">
            {category} · {year}
          </p>

          <h3 className="mt-3 flex items-center gap-2 text-xl sm:text-2xl">
            <span className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1">
              {title}
            </span>
            {hasPage && (
              <span
                aria-hidden="true"
                className="text-sm text-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              >
                →
              </span>
            )}
          </h3>

          <p className="mt-2.5 text-sm leading-relaxed text-muted">{summary}</p>

          {/* mt-auto pins the tags and links to the bottom of the
              card, so they line up across a row regardless of how
              long each summary runs. */}
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {stack.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-rule px-3 py-1 text-[0.6875rem] text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          {!hasPage && (hasLink(links.live) || hasLink(links.repo)) && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {hasLink(links.live) && (
                <ExternalLink href={links.live}>Visit</ExternalLink>
              )}
              {hasLink(links.repo) && (
                <ExternalLink href={links.repo}>Source</ExternalLink>
              )}
            </div>
          )}
        </div>
      </Wrapper>
    </Stagger.Item>
  );
}

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="link-underline text-sm text-accent"
    >
      {children} ↗
    </a>
  );
}
