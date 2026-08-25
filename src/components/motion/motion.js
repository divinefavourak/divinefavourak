/**
 * Shared motion tokens.
 *
 * Motion reads as intentional when everything moves on the same
 * curve at the same speed, and as noise when each component picks
 * its own. These constants are the single source; the matching CSS
 * easing lives in src/styles/index.css as --ease-out-expo.
 */

/** Expo-out: quick departure, long settle. Reads as "considered". */
export const EASE = [0.16, 1, 0.3, 1];

export const DURATION = 0.6;

/** How far elements travel on reveal. Small on purpose. */
export const DISTANCE = 24;

/** Gap between siblings in a staggered group. */
export const STAGGER = 0.06;

/**
 * When to trigger a scroll reveal. The negative bottom margin means
 * an element animates slightly before it reaches the viewport edge,
 * so it is already settled by the time it's comfortably in view.
 */
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" };

export const transition = { duration: DURATION, ease: EASE };

/** Parent variants for a staggered group. */
export const staggerParent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER, delayChildren: 0.04 },
  },
};

/** Child variants to pair with staggerParent. */
export const staggerChild = {
  hidden: { opacity: 0, y: DISTANCE },
  visible: { opacity: 1, y: 0, transition },
};

/**
 * Reduced-motion equivalents. Not "no animation" — opacity still
 * resolves — but nothing travels, which is what vestibular
 * sensitivity actually requires.
 */
export const staticParent = { hidden: {}, visible: {} };
export const staticChild = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};
