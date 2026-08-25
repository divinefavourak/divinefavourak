import { cn } from "../../lib/utils.js";

/**
 * The page's horizontal measure.
 *
 * One component owns the max-width and gutters so every section
 * aligns to the same edges — which is most of what makes a
 * grid-heavy layout read as deliberate rather than approximate.
 */
export default function Container({ children, className, as: Tag = "div" }) {
  return (
    <Tag className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12", className)}>
      {children}
    </Tag>
  );
}
