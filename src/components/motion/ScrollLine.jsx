import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * A 1px reading-progress rule pinned to the top of the viewport.
 *
 * Driven by scaleX on a transform, not width, so it never triggers
 * layout — this element updates on every scroll frame, which is
 * exactly where an animated width would cost the most.
 */
export default function ScrollLine() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // A light spring takes the jitter out of trackpad and
  // momentum scrolling without noticeably lagging the input.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-ink"
      style={{ scaleX }}
    />
  );
}
