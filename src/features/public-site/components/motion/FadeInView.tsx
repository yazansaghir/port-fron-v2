import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

import {
  MOTION_DURATION_IN_VIEW_S,
  MOTION_EASE,
} from '@/features/public-site/components/motion/constants';

type FadeInViewProps = {
  children: ReactNode;
  className?: string;
  /** Seconds; capped stagger so grids do not feel sluggish. */
  delay?: number;
};

/**
 * Soft fade + slight upward reveal when the block enters the viewport.
 * Respects prefers-reduced-motion (no off-screen initial state, no translate).
 */
export function FadeInView({ children, className = '', delay = 0 }: FadeInViewProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -48px 0px' }}
      transition={{
        duration: MOTION_DURATION_IN_VIEW_S,
        delay,
        ease: MOTION_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
