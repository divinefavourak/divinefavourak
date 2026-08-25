import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Applies TiltedCard's 3D tilt to arbitrary children.
 *
 * TiltedCard itself takes an `imageSrc` and renders its own <img>,
 * so it can't host the hero's WebGL canvas. This wrapper reuses the
 * same spring model but tilts whatever it's given.
 *
 * Pointer tracking is delegated to an ancestor via `surfaceSelector`
 * because the hero portrait is `pointer-events: none` — it must not
 * intercept clicks meant for the copy sitting over it, so it can
 * never receive its own hover events.
 */
export default function TiltWrap({
  children,
  amplitude = 8,
  scaleOnHover = 1.02,
  surfaceSelector,
  className = '',
  style
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const springValues = { damping: 30, stiffness: 100, mass: 2 };
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const surface = surfaceSelector
      ? (el.closest(surfaceSelector) ?? el.parentElement)
      : el;
    if (!surface) return;

    const onMove = e => {
      // Rotation is measured against the SURFACE, not the wrapper.
      // Using the wrapper would make the tilt flip hard as the
      // pointer crossed its edge, since the offset would jump sign
      // right at the boundary.
      const rect = surface.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      rotateX.set((offsetY / (rect.height / 2)) * -amplitude);
      rotateY.set((offsetX / (rect.width / 2)) * amplitude);
      scale.set(scaleOnHover);
    };

    const onLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
      scale.set(1);
    };

    surface.addEventListener('pointermove', onMove, { passive: true });
    surface.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      surface.removeEventListener('pointermove', onMove);
      surface.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, amplitude, scaleOnHover, surfaceSelector, rotateX, rotateY, scale]);

  return (
    // No `transform-style: preserve-3d` here. The wrapper only needs
    // to rotate within its parent's perspective and has no children
    // that need depth of their own, so promoting the subtree — which
    // includes a WebGL canvas — to a 3D compositing layer would buy
    // nothing and risk paint differences across GPUs.
    <motion.div
      ref={ref}
      className={`h-full w-full ${className}`.trim()}
      style={{ rotateX, rotateY, scale, ...style }}
    >
      {children}
    </motion.div>
  );
}
