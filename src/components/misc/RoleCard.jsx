import Stagger from "../motion/Stagger.jsx";

/**
 * A leadership role, as a bordered row.
 *
 * `period` is null until the user supplies tenure dates, so the
 * date column renders an em-dash rather than inventing one.
 */
export default function RoleCard({ role }) {
  return (
    <Stagger.Item as="li" className="border-b border-rule py-8">
      <div className="grid gap-y-4 sm:grid-cols-12 sm:gap-x-8">
        <div className="sm:col-span-3">
          <p className="label">{role.kind}</p>
          <p className="numeral mt-1.5 text-sm text-muted">
            {role.period ?? "—"}
          </p>
        </div>

        <div className="sm:col-span-9">
          <div className="flex flex-wrap items-center gap-3">
            {role.logo && (
              <img
                src={role.logo}
                alt={role.logoAlt ?? ""}
                loading="lazy"
                className="h-7 w-auto object-contain"
              />
            )}
            <h3 className="text-xl sm:text-2xl">{role.title}</h3>
            {role.current && (
              <span className="label border border-rule px-2 py-0.5">
                Current
              </span>
            )}
          </div>

          <p className="mt-1.5 text-sm text-muted">{role.org}</p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
            {role.description}
          </p>

          {role.link && (
            <a
              href={role.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-4 inline-block text-sm"
            >
              {role.orgShort} ↗
            </a>
          )}
        </div>
      </div>
    </Stagger.Item>
  );
}
