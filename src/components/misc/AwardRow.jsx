import Stagger from "../motion/Stagger.jsx";

/**
 * A scholarship or competition, as a compact three-column row.
 *
 * `year` and `result` fall back to an em-dash while the details are
 * still outstanding — a visible gap is honest, an invented year is
 * not.
 */
export default function AwardRow({ award }) {
  return (
    <Stagger.Item as="li" className="border-b border-rule py-6">
      <div className="grid gap-y-2 sm:grid-cols-12 sm:items-baseline sm:gap-x-8">
        <p className="numeral label sm:col-span-2">{award.year ?? "—"}</p>

        <div className="sm:col-span-6">
          <h3 className="text-lg leading-snug">{award.title}</h3>
          <p className="mt-1 text-sm text-muted">{award.org}</p>
        </div>

        <div className="sm:col-span-4 sm:text-right">
          <p className="label">{award.kind}</p>
          <p className="mt-1 text-sm text-muted">{award.result ?? "—"}</p>
        </div>
      </div>
    </Stagger.Item>
  );
}
