import Stagger from "../motion/Stagger.jsx";

/**
 * One labelled column of the stack section.
 *
 * Grouping by layer (Languages / Frontend / Backend / Mobile /
 * Data & Infra / Design) is what actually communicates full-stack
 * range. The old flat tag cloud listed the same tools but read as
 * "knows some things"; five labelled columns read as "works at
 * every layer".
 */
export default function StackGroup({ group }) {
  return (
    <Stagger.Item as="div" className="border-t border-rule pt-5">
      <h3 className="label">{group.name}</h3>

      <ul className="mt-4 space-y-2.5">
        {group.items.map(({ name, Icon }) => (
          <li key={name} className="flex items-center gap-2.5 text-sm">
            <Icon
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-faint"
            />
            {name}
          </li>
        ))}
      </ul>
    </Stagger.Item>
  );
}
