/**
 * The metadata block: label above value, in columns.
 *
 * This is the workhorse of a data-rich case study — it's what lets
 * a project state its role, stack and outcomes without resorting to
 * prose. Labels use the shared .label voice so every metadata block
 * on the site reads identically.
 */
export default function MetaGrid({ items, className = "" }) {
  // Deduplicate by label, keeping the first. Callers compose these
  // lists from fixed fields plus a project's freeform `metrics`,
  // and a project that also lists "Role" as a metric would
  // otherwise render the column twice.
  const seen = new Set();
  const rows = items.filter((item) => {
    if (!item?.value) return false;
    const key = item.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (!rows.length) return null;

  return (
    <dl
      className={`grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 ${className}`}
    >
      {rows.map(({ label, value }) => (
        <div key={label}>
          <dt className="label">{label}</dt>
          <dd className="mt-1.5 text-sm leading-snug">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
