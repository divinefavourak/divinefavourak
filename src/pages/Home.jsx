import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import Container from "../components/layout/Container.jsx";
import Section from "../components/layout/Section.jsx";
import SectionRail from "../components/layout/SectionRail.jsx";
import Reveal from "../components/motion/Reveal.jsx";
import Stagger from "../components/motion/Stagger.jsx";
// Lazy: this pulls in GSAP, and the carousel is below the fold.
// Loading it eagerly put ~70 KB of animation engine in front of
// first paint for a section most visitors haven't scrolled to yet.
const ProjectShowcase = lazy(
  () => import("../components/work/ProjectShowcase.jsx")
);
import RoleCard from "../components/misc/RoleCard.jsx";
import AwardRow from "../components/misc/AwardRow.jsx";
import StackGroup from "../components/misc/StackGroup.jsx";
import PortraitCard from "../components/misc/PortraitCard.jsx";
import TiltWrap from "../components/misc/TiltWrap.jsx";
import HalftoneReveal from "../components/reactbits/HalftoneReveal.jsx";
import TiltedCard from "../components/reactbits/TiltedCard.jsx";

import profile from "../data/profile.js";
import { featuredProjects } from "../data/projects.js";
import roles from "../data/experience.js";
import awards from "../data/awards.js";
import stackGroups from "../data/stack.js";
import timeline from "../data/timeline.js";
import { EASE } from "../components/motion/motion.js";

/** Drives the right-edge rail. Order must match the sections below. */
const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "leadership", label: "Leading" },
  { id: "recognition", label: "Awards" },
  { id: "stack", label: "Stack" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <SectionRail sections={SECTIONS} />
      <Hero />

      <Section
        id="work"
        eyebrow="My work"
        title="Selected work"
        intro="Platforms, mobile apps and the services behind them."
      >
        {/* A depth carousel of the work, paired with a detail panel
            so the metadata survives — the carousel alone can only
            carry an image and its alt text. */}
        {/* The fallback reserves the carousel's height so the
            sections below don't jump when the chunk arrives. */}
        <Suspense fallback={<div className="h-[420px] sm:h-[480px]" />}>
          <ProjectShowcase projects={featuredProjects} />
        </Suspense>

        <Reveal className="mt-12">
          <Link to="/work" className="pill">
            All projects
          </Link>
        </Reveal>
      </Section>

      <Section
        id="leadership"
        eyebrow="Beyond code"
        title="Leadership"
        intro="Faculty representation and youth ministry, alongside the engineering."
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Sticky so the portrait stays with the roles as they
              scroll past, instead of stranding a tall column of
              whitespace beside the last entry. */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <PortraitCard
                src="/lead.jpg"
                alt={`${profile.name} in a leadership capacity`}
                badgeTitle={`${roles.length} roles`}
                badgeSub="FOCI · RCCG"
              />
              <p className="mt-10 text-sm leading-relaxed text-muted">
                Beyond the code, I lead — mentoring teens, building
                communities, and representing my faculty.
              </p>
            </div>
          </div>

          <Stagger as="ul" className="border-t border-rule lg:col-span-8">
            {roles.map((role) => (
              <RoleCard key={role.title} role={role} />
            ))}
          </Stagger>
        </div>
      </Section>

      <Section
        id="recognition"
        eyebrow="Recognition"
        title="Recognition"
        intro="Scholarships and competitions."
      >
        <Stagger as="ul" className="border-t border-rule">
          {awards.map((award) => (
            <AwardRow key={award.title} award={award} />
          ))}
        </Stagger>
      </Section>

      <Section
        id="stack"
        eyebrow="Toolkit"
        title="Stack"
        intro="What I reach for, by layer."
      >
        <Stagger className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {stackGroups.map((group) => (
            <StackGroup key={group.name} group={group} />
          ))}
        </Stagger>
      </Section>

      <Section
        id="timeline"
        eyebrow="My journey"
        title="How I got here"
        intro="From first lines of HTML to shipping production platforms and co-founding one."
        side
      >
        {/* A continuous rail with a node per year. The vertical line
            is a border on the <ol>, so it can't drift out of
            alignment with the dots the way a separate absolutely
            positioned element would. */}
        <Stagger
          as="ol"
          className="ml-1.5 border-l border-rule pl-8 sm:ml-2 sm:pl-12"
        >
          {timeline.map((entry) => (
            <Stagger.Item
              as="li"
              key={entry.date}
              className="relative pb-12 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[2.3125rem] top-1.5 h-2 w-2 rounded-full bg-accent sm:-left-[3.3125rem]"
              />
              <p className="mono-meta !leading-none">{entry.date}</p>
              <h3 className="mt-3 text-xl sm:text-2xl">{entry.title}</h3>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
                {entry.desc}
              </p>
            </Stagger.Item>
          ))}
        </Stagger>
      </Section>

      <ContactCta />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  const reduced = useReducedMotion();

  // The name stacks and the surname sits a tone back. Splitting it
  // lets the display face be genuinely large without the line
  // running the full width of the page.
  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");

  // The hero is the one place that animates on mount rather than on
  // scroll — it is already in view, so a scroll trigger would never
  // fire.
  const rise = (delay) => ({
    initial: reduced ? false : { y: "100%" },
    animate: { y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  const fade = (delay) => ({
    initial: reduced ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <header
      data-halftone-surface
      className="relative overflow-hidden pb-16 pt-32 sm:pt-40"
    >
      {/* Portrait, bleeding off the right edge. Absolutely positioned
          rather than sharing a column split, so the text keeps its
          full measure and the image can run to the page edge.
          Hidden below lg, where there isn't room for it to read as
          atmosphere instead of clutter. */}
      <div
        aria-hidden="true"
        // perspective has to live on the ancestor, not on the tilted
        // element itself, or the rotation renders flat.
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[78%] select-none opacity-70 [perspective:1200px] md:block lg:w-[62%] lg:opacity-100"
      >
        <TiltWrap
          amplitude={7}
          scaleOnHover={1.03}
          surfaceSelector="[data-halftone-surface]"
        >
        {/* HalftoneReveal prints the portrait as a halftone screen
            and opens a sharp loupe under the cursor.

            paperColor is pinned to --color-paper so the unprinted
            ground matches the page exactly; without that the canvas
            reads as a lighter rectangle pasted over the hero. The
            radial mask then dissolves its edges the same way the
            previous treatment did, so it still bleeds off rather
            than ending on a hard line. */}
        <HalftoneReveal
          src={profile.portraitUrl}
          inkColor="#EFE9DE"
          paperColor="#080706"
          mode="mono"
          shape="circle"
          // Density down and contrast up from the defaults: at 110
          // the dots were too fine to read as a pattern at this size,
          // and the portrait dissolved into grey. idleReveal keeps a
          // baseline of sharpness so the face is legible before the
          // cursor ever arrives.
          dotDensity={78}
          dotSize={1.05}
          angle={28}
          contrast={1.9}
          revealRadius={0.3}
          edge={0.7}
          follow={0.3}
          // idleReveal blends the full-colour source everywhere, so
          // pushing it higher for legibility also drags the red of
          // the curtain behind the subject into a warm-neutral page.
          // Legibility comes from contrast instead, and this stays
          // low enough to keep the print monochrome.
          idleReveal={0.16}
          trigger="hover"
          borderRadius="0px"
          className="halftone-mask"
          fallbackClassName="halftone-mask h-full w-full object-cover object-[center_38%]"
          fallbackAlt=""
        />
        </TiltWrap>

        {/* Scrim. Outside the tilt so it stays flush with the page
            edge — tilting the scrim too would peel it away from the
            text it exists to protect. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper via-paper/55 to-transparent lg:via-paper/25 lg:to-transparent" />
      </div>

      {/* The portrait is decorative (alt=""), so the identity it
          carries still has to reach assistive tech somewhere. */}
      <span className="sr-only">
        Portrait of {profile.fullName}, {profile.title}, based in{" "}
        {profile.location}.
      </span>

      <Container className="relative">
        <div className="max-w-2xl">
          {/* Coordinate block — machine-readout voice. */}
          <motion.div {...fade(0)} className="mono-meta">
            <p>{profile.location}</p>
            <p>
              {profile.title}
              {profile.availability.open && (
                <>
                  {" · "}
                  <span className="text-accent">
                    {profile.availability.label}
                  </span>
                </>
              )}
            </p>
          </motion.div>

          <h1 className="mt-8 text-[clamp(3rem,9vw,6.5rem)] leading-[0.92]">
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span className="block" {...rise(0.1)}>
                {firstName}
              </motion.span>
            </span>
            {lastName && (
              <span className="block overflow-hidden pb-[0.04em]">
                <motion.span className="block text-muted" {...rise(0.2)}>
                  {lastName}
                </motion.span>
              </span>
            )}
          </h1>

          <motion.p
            {...fade(0.4)}
            className="mt-8 max-w-xl text-xl leading-snug sm:text-2xl"
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            {...fade(0.5)}
            className="mt-6 max-w-lg text-sm leading-relaxed text-muted"
          >
            {profile.intro[0]}
          </motion.p>

          <motion.div {...fade(0.6)} className="mt-10 flex flex-wrap gap-3">
            <Link to="/work" className="pill pill-filled">
              View work
            </Link>
            <Link to="/contact" className="pill pill-accent">
              Get in touch
            </Link>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill"
            >
              Resume
            </a>
          </motion.div>

          <motion.div {...fade(0.7)} className="mt-16 border-l border-rule pl-5">
            <a
              href="#work"
              className="link-underline text-sm text-muted hover:text-ink"
            >
              View my case studies
            </a>
          </motion.div>
        </div>

        {/* A tilted card floating in the hero. Uses lead.jpg rather
            than the portrait behind it — two treatments of the same
            photograph in one view would read as a mistake. Sits
            below xl, where the hero has no spare width. */}
        <motion.div
          {...fade(0.85)}
          className="pointer-events-none absolute bottom-8 right-8 hidden xl:block"
        >
          <div className="pointer-events-auto">
            <TiltedCard
              imageSrc="/lead.jpg"
              altText={`${profile.name} in a leadership capacity`}
              captionText="Beyond the code"
              containerHeight="260px"
              containerWidth="200px"
              imageHeight="260px"
              imageWidth="200px"
              rotateAmplitude={12}
              scaleOnHover={1.06}
              showMobileWarning={false}
              showTooltip
              displayOverlayContent
              overlayContent={
                <div className="w-[200px] p-4">
                  <p className="mono-meta !text-[0.5625rem] !leading-none !text-white/70">
                    Also
                  </p>
                  <p className="mt-1.5 font-display text-lg leading-tight text-white">
                    Student leader
                  </p>
                </div>
              }
            />
          </div>
        </motion.div>
      </Container>
    </header>
  );
}

function ContactCta() {
  // Only the channels with a real destination. `handle` is what gets
  // shown, so the card reads as an address rather than a button.
  const channels = [
    {
      label: "Email",
      value: profile.email,
      action: "Write to me",
      href: `mailto:${profile.email}`,
    },
    ...profile.socials.map((s) => ({
      label: s.label,
      value: s.handle,
      action: "Connect",
      href: s.url,
    })),
  ];

  return (
    <Section id="contact" bare className="text-center">
      <Reveal>
        <p className="eyebrow">Contact</p>

        <h2 className="mx-auto mt-6 max-w-4xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95]">
          Let's build something that lasts.
        </h2>

        {profile.availability.open && (
          <p className="mx-auto mt-10 inline-flex max-w-full items-center gap-3 rounded-full border border-accent/40 px-6 py-3">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            <span className="mono-meta !text-accent">
              Open to full-stack, mobile and UX roles
            </span>
          </p>
        )}
      </Reveal>

      <Stagger className="mt-14 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((c) => (
          <Stagger.Item
            key={c.label}
            as="a"
            href={c.href}
            {...(c.href.startsWith("mailto:")
              ? {}
              : { target: "_blank", rel: "noopener noreferrer" })}
            className="group rounded-2xl border border-rule p-6 transition-colors hover:border-ink"
          >
            <p className="label">{c.label}</p>
            <p className="mt-3 truncate text-base">{c.value}</p>
            <p className="mt-4 text-sm text-muted transition-colors group-hover:text-accent">
              {c.action} ↗
            </p>
          </Stagger.Item>
        ))}
      </Stagger>

      <Reveal className="mt-14 flex flex-wrap justify-center gap-3">
        <Link to="/contact" className="pill pill-filled">
          Start a conversation
        </Link>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill"
        >
          Download CV
        </a>
      </Reveal>
    </Section>
  );
}
