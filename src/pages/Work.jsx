import Container from "../components/layout/Container.jsx";
import Stagger from "../components/motion/Stagger.jsx";
import Reveal from "../components/motion/Reveal.jsx";
import ProjectCard from "../components/work/ProjectCard.jsx";
import Playground from "../games/Playground.jsx";
import { projects } from "../data/projects.js";

/**
 * The full project index — everything, not just the featured rows
 * the home page carries.
 */
export default function Work() {
  return (
    <Container className="pt-36 pb-(--spacing-section) sm:pt-44">
      <Reveal>
        <p className="label">Index</p>
        <h1 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)]">Work</h1>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-muted">
          {projects.length} projects — web platforms, mobile apps, bots and
          interface work.
        </p>
      </Reveal>

      <Stagger
        as="ul"
        className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </Stagger>

      {/* The canvas games live here rather than on the home page —
          they're work, not an interruption to the pitch. */}
      <section
        id="playground"
        aria-labelledby="playground-heading"
        className="mt-(--spacing-section) scroll-mt-24"
      >
        <Reveal>
          <div className="grid gap-6 border-t border-rule pt-8 sm:grid-cols-12 sm:gap-8">
            <div className="sm:col-span-7">
              <p className="eyebrow">Interactive</p>
              <h2
                id="playground-heading"
                className="mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
              >
                Playground
              </h2>
            </div>
            <p className="max-w-md self-end text-sm leading-relaxed text-muted sm:col-span-5">
              Two canvas games, running natively in this page — not embedded
              from anywhere else.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 sm:mt-16">
          <Playground />
        </div>
      </section>
    </Container>
  );
}
