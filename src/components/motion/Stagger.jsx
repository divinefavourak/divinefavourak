import { motion, useReducedMotion } from "framer-motion";
import {
  VIEWPORT,
  staggerParent,
  staggerChild,
  staticParent,
  staticChild,
} from "./motion.js";

/**
 * Reveals children in sequence rather than all at once.
 *
 * Used for the work rows and stack groups, where the cascade reads
 * as a list being enumerated. Framer propagates variants to any
 * descendant that declares matching variant names, so children use
 * <Stagger.Item> and don't need their own timing.
 */
export default function Stagger({ children, as = "div", className, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      className={className}
      variants={reduced ? staticParent : staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** A child of Stagger. Inherits its timing from the parent. */
function Item({ children, as = "div", className, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      className={className}
      variants={reduced ? staticChild : staggerChild}
      {...rest}
    >
      {children}
    </Tag>
  );
}

Stagger.Item = Item;
