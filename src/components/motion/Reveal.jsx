import { motion, useReducedMotion } from "framer-motion";
import { DISTANCE, EASE, DURATION, VIEWPORT } from "./motion.js";

/**
 * Fade-and-rise a block as it scrolls into view.
 *
 * Replaces the old FadeIn component, which drove its delays with
 * raw setTimeout and ignored prefers-reduced-motion entirely.
 *
 * @param {number} delay    seconds to offset the reveal
 * @param {string} as       element type to render ("div", "li", …)
 */
export default function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  // Reduced motion: appear immediately, in place. Returning a plain
  // static element rather than a zero-duration animation avoids a
  // frame where the content is invisible.
  if (reduced) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: DISTANCE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
