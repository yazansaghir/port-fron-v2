import { motion, useReducedMotion } from 'framer-motion';

import { GradientText } from '@/features/public-site/components/GradientText';
import { HeroRobotModel } from '@/features/public-site/components/HeroRobotModel';
import {
  MOTION_DURATION_HERO_CHILD_S,
  MOTION_EASE,
} from '@/features/public-site/components/motion/constants';
import { PublicButton } from '@/features/public-site/components/PublicButton';

export type HeroTitlePart = {
  text: string;
  gradient?: boolean;
};

export type HeroTitleLine = {
  parts: HeroTitlePart[];
};

export type HeroCta = {
  label: string;
  to: string;
};

type HeroSectionProps = {
  eyebrow: string;
  lines: HeroTitleLine[];
  tagline?: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
};

function renderLine(line: HeroTitleLine, lineIndex: number) {
  return (
    <span key={lineIndex} className="block text-text">
      {line.parts.map((part, i) =>
        part.gradient ? (
          <GradientText key={i}>{part.text}</GradientText>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </span>
  );
}

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.06, when: 'beforeChildren' },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_DURATION_HERO_CHILD_S, ease: MOTION_EASE },
  },
};

export function HeroSection({
  eyebrow,
  lines,
  tagline,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  const containerVariants = reduceMotion
    ? undefined
    : heroContainer;

  const itemVariants = reduceMotion
    ? undefined
    : heroItem;

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative w-full overflow-hidden"
    >
      <div className="grid min-h-dvh w-full grid-cols-1 items-center md:grid-cols-12 md:gap-x-10 lg:gap-x-16 xl:gap-x-20">
        {/* Copy column */}
        <motion.div
          className="relative z-10 flex flex-col justify-center py-16 md:col-span-7 md:py-24 lg:col-span-6 xl:col-span-6 pl-5"
          variants={containerVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate={reduceMotion ? false : 'visible'}
        >
          <motion.p
            className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-primary"
            variants={itemVariants}
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            className="mb-7 text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
            variants={itemVariants}
          >
            {lines.map((line, idx) => renderLine(line, idx))}
          </motion.h1>

          {tagline ? (
            <motion.p
              className="mb-12 max-w-lg text-lg leading-relaxed text-muted md:text-xl"
              variants={itemVariants}
            >
              {tagline}
            </motion.p>
          ) : null}

          <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
            <PublicButton pill variant="primary" to={primaryCta.to} className="px-10 py-4 text-base">
              {primaryCta.label}
            </PublicButton>
            <PublicButton pill variant="secondary" to={secondaryCta.to} className="px-10 py-4 text-base">
              {secondaryCta.label}
            </PublicButton>
          </motion.div>
        </motion.div>

        {/* Visual column */}
        <motion.div
          className="relative z-[1] flex w-full items-center justify-center py-8 md:col-span-5 md:min-h-[min(100dvh,56rem)] md:pb-0 lg:col-span-6 lg:justify-end xl:col-span-6"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: reduceMotion ? 0 : 0.18,
            ease: MOTION_EASE,
          }}
        >
          <HeroRobotModel />
        </motion.div>
      </div>
    </section>
  );
}
