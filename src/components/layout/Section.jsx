import Container from "./Container.jsx";
import Reveal from "../motion/Reveal.jsx";
import { cn } from "../../lib/utils.js";

/**
 * A titled page section.
 *
 * The bracketed mono eyebrow above a large serif heading is the
 * device that carries the layout: it gives every section the same
 * anchor and makes a long scroll read as a document with chapters
 * rather than an undifferentiated stack of blocks.
 *
 * `side` moves the heading into a sticky left column with the
 * content beside it. Worth it for sections that are a long vertical
 * list — the title stays on screen while you read down, so you never
 * lose track of what you're looking at.
 */
export default function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  side = false,
  bare = false,
}) {
  const headingId = title ? `${id}-heading` : undefined;

  const heading = title && (
    <>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2
        id={headingId}
        className={cn(
          "mt-4 leading-[0.95]",
          side
            ? "text-[clamp(2rem,4.5vw,3.25rem)]"
            : "text-[clamp(2rem,5vw,3.5rem)]"
        )}
      >
        {title}
      </h2>
    </>
  );

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("scroll-mt-24 py-(--spacing-section)", className)}
    >
      <Container>
        {side ? (
          <div className="grid gap-10 border-t border-rule pt-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <Reveal className="lg:sticky lg:top-28">
                {heading}
                {intro && (
                  <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
                    {intro}
                  </p>
                )}
              </Reveal>
            </div>

            <div className="lg:col-span-8">{children}</div>
          </div>
        ) : (
          <>
            {title && (
              <Reveal className="mb-12 sm:mb-16">
                <div className="grid gap-6 border-t border-rule pt-8 sm:grid-cols-12 sm:gap-8">
                  <div className="sm:col-span-7">{heading}</div>
                  {intro && (
                    <p className="max-w-md self-end text-sm leading-relaxed text-muted sm:col-span-5">
                      {intro}
                    </p>
                  )}
                </div>
              </Reveal>
            )}

            {bare ? children : <div>{children}</div>}
          </>
        )}
      </Container>
    </section>
  );
}
