import { Link, Navigate, useParams } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import Reveal from "../components/motion/Reveal.jsx";
import MetaGrid from "../components/work/MetaGrid.jsx";
import { getProject, adjacentCaseStudies, hasLink } from "../data/projects.js";

/**
 * Long-form case study at /work/:slug.
 *
 * A project without authored `caseStudy` content has no page, so
 * the route redirects to the index rather than rendering an empty
 * shell. That means new projects can be added to the data file and
 * gain a page the moment their copy is written.
 */
export default function CaseStudy() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project || !project.caseStudy) {
    return <Navigate to="/work" replace />;
  }

  const { title, year, category, role, stack, metrics, links, caseStudy } =
    project;
  const { prev, next } = adjacentCaseStudies(slug);

  return (
    <Container as="main" className="pt-36 pb-(--spacing-section) sm:pt-44">
      <Reveal>
        <Link to="/work" className="link-underline text-sm text-muted">
          ← Work
        </Link>

        <p className="label mt-10">{category}</p>
        <h1 className="mt-4 text-[clamp(2.5rem,8vw,5.5rem)]">{title}</h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
          {project.summary}
        </p>
      </Reveal>

      <Reveal className="mt-14 border-t border-rule pt-8">
        <MetaGrid
          items={[
            { label: "Year", value: year },
            { label: "Role", value: role },
            { label: "Stack", value: stack.join(" · ") },
            ...(metrics ?? []),
          ]}
        />

        {(hasLink(links.live) || hasLink(links.repo)) && (
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {hasLink(links.live) && (
              <a
                href={links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sm"
              >
                Visit site ↗
              </a>
            )}
            {hasLink(links.repo) && (
              <a
                href={links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sm"
              >
                Source ↗
              </a>
            )}
          </div>
        )}
      </Reveal>

      <div className="mt-20 grid gap-y-16">
        <Block title="Context">{caseStudy.context}</Block>
        <Block title="The problem">{caseStudy.problem}</Block>

        {caseStudy.approach && (
          <Reveal className="grid gap-6 border-t border-rule pt-8 sm:grid-cols-12 sm:gap-8">
            <h2 className="label sm:col-span-3">What I built</h2>
            <ul className="space-y-5 sm:col-span-9">
              {caseStudy.approach.map((point, i) => (
                <li key={point} className="flex gap-4">
                  <span className="numeral label pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="max-w-prose text-base leading-relaxed">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Block title="Architecture">{caseStudy.architecture}</Block>
        <Block title="Outcome">{caseStudy.outcome}</Block>
      </div>

      {(prev || next) && (
        <Reveal className="mt-24 grid gap-6 border-t border-rule pt-8 sm:grid-cols-2">
          {prev && (
            <Link to={`/work/${prev.slug}`} className="group">
              <p className="label">Previous</p>
              <p className="mt-2 text-xl transition-opacity group-hover:opacity-60">
                {prev.title}
              </p>
            </Link>
          )}
          {next && (
            <Link
              to={`/work/${next.slug}`}
              className="group sm:col-start-2 sm:text-right"
            >
              <p className="label">Next</p>
              <p className="mt-2 text-xl transition-opacity group-hover:opacity-60">
                {next.title}
              </p>
            </Link>
          )}
        </Reveal>
      )}
    </Container>
  );
}

/** A titled prose block on the shared 12-column grid. */
function Block({ title, children }) {
  if (!children) return null;
  return (
    <Reveal className="grid gap-6 border-t border-rule pt-8 sm:grid-cols-12 sm:gap-8">
      <h2 className="label sm:col-span-3">{title}</h2>
      <p className="max-w-prose text-base leading-relaxed sm:col-span-9">
        {children}
      </p>
    </Reveal>
  );
}
