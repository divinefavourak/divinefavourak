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

/**
 * How far elements travel on reveal.
 *
 * Raised from 24px: on a phone the viewport is short and content is
 * single-column, so a 24px rise was over almost before it read as
 * movement. 40px is still restrained on a desktop screen but is
 * actually perceptible on a handset.
 */
export const DISTANCE = 40;

/** Gap between siblings in a staggered group. */
export const STAGGER = 0.06;

/**
 * When to trigger a scroll reveal.
 *
 * The negative bottom margin holds the trigger back until an element
 * is properly into the viewport. At -12% things were firing almost
 * as they appeared, which on a short screen meant the animation had
 * finished before it was worth looking at. -20% lets the reader
 * arrive and then see it move.
 */
export const VIEWPORT = { once: true, margin: "0px 0px -20% 0px" };

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
