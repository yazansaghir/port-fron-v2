/**
 * Framer Motion uses seconds; keep in sync with globals.css motion tokens
 * (--motion-duration ~280ms, --motion-ease-out).
 */
export const MOTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Scroll-in section blocks (~ --motion-duration) */
export const MOTION_DURATION_IN_VIEW_S = 0.28;

/** Hero line reveals — slightly longer for first paint */
export const MOTION_DURATION_HERO_CHILD_S = 0.38;
