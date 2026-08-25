import Container from "../components/layout/Container.jsx";
import Reveal from "../components/motion/Reveal.jsx";
import Stagger from "../components/motion/Stagger.jsx";
import StackGroup from "../components/misc/StackGroup.jsx";
import RoleCard from "../components/misc/RoleCard.jsx";
import PortraitCard from "../components/misc/PortraitCard.jsx";
import profile from "../data/profile.js";
import stackGroups from "../data/stack.js";
import roles from "../data/experience.js";

export default function About() {
  return (
    <Container className="pt-36 pb-(--spacing-section) sm:pt-44">
      <Reveal>
        <p className="label">About</p>
        <h1 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)]">
          {profile.fullName}
        </h1>
      </Reveal>

      <Reveal className="mt-14 grid gap-10 border-t border-rule pt-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          {profile.intro.map((para) => (
            <p
              key={para}
              className="mb-6 max-w-prose text-base leading-relaxed last:mb-0"
            >
              {para}
            </p>
          ))}

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-rule pt-8">
            <div>
              <dt className="label">Studying</dt>
              <dd className="mt-1.5 text-sm">
                {profile.education.programme}
                <br />
                <span className="text-muted">{profile.education.school}</span>
              </dd>
            </div>
            <div>
              <dt className="label">Based in</dt>
              <dd className="mt-1.5 text-sm">
                {profile.location}
                <br />
                <span className="text-muted">{profile.timezone}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-5">
          <PortraitCard
            src={profile.portraitUrl}
            alt={`${profile.fullName} — ${profile.title}`}
            badgeTitle={profile.location.split(",")[0]}
            badgeSub={profile.location.split(",")[1]?.trim()}
          />
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-12 inline-block text-sm"
          >
            Download CV ↓
          </a>
        </div>
      </Reveal>

      <section aria-labelledby="about-stack" className="mt-24">
        <Reveal>
          <h2 id="about-stack" className="label border-t border-rule pt-6">
            Stack
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {stackGroups.map((group) => (
            <StackGroup key={group.name} group={group} />
          ))}
        </Stagger>
      </section>

      <section aria-labelledby="about-roles" className="mt-24">
        <Reveal>
          <h2 id="about-roles" className="label border-t border-rule pt-6">
            Leadership
          </h2>
        </Reveal>
        <Stagger as="ul" className="mt-10 border-t border-rule">
          {roles.map((role) => (
            <RoleCard key={role.title} role={role} />
          ))}
        </Stagger>
      </section>
    </Container>
  );
}
