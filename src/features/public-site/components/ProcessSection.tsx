import type { CSSProperties, ReactNode } from 'react';

import { FadeInView } from '@/features/public-site/components/motion';

type ProcessStep = {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
};

const STEP_ICONS: ReactNode[] = [
  (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22 11 13 2 9l20-7z" />
    </svg>
  ),
];

const STEPS: ProcessStep[] = [
  {
    number: '01',
    icon: STEP_ICONS[0]!,
    title: 'Discovery',
    description:
      'Deep-dive into goals, users, and constraints. Competitive research, architecture planning, and scope definition — before writing a single line of code.',
  },
  {
    number: '02',
    icon: STEP_ICONS[1]!,
    title: 'Design',
    description:
      'Wireframes, component libraries, and design tokens. Establishing the visual language and interaction patterns before the build phase begins.',
  },
  {
    number: '03',
    icon: STEP_ICONS[2]!,
    title: 'Build',
    description:
      'Full-stack development with clean, maintainable code. Iterative delivery with continuous feedback, code reviews, and integration testing throughout.',
  },
  {
    number: '04',
    icon: STEP_ICONS[3]!,
    title: 'Deploy',
    description:
      'CI/CD pipelines, monitoring, and a smooth launch. Post-deployment performance tuning, observability setup, and ongoing support as the product grows.',
  },
];

export function ProcessSection() {
  const spineStyle: CSSProperties = {
    background: `linear-gradient(90deg, color-mix(in srgb, var(--color-primary) 40%, transparent), color-mix(in srgb, var(--color-secondary) 40%, transparent))`,
  };

  const mobileSpineStyle: CSSProperties = {
    background: `linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 40%, transparent), color-mix(in srgb, var(--color-secondary) 30%, transparent))`,
  };

  const staggerS = 0.06;
  const staggerCap = 0.18;

  return (
    <div className="relative w-full">
      <div
        className="pointer-events-none absolute left-[calc(12.5%+1.75rem)] right-[calc(12.5%+1.75rem)] top-[2.8rem] z-0 hidden h-px md:block"
        style={spineStyle}
        aria-hidden
      />

      <div className="relative grid gap-8 md:grid-cols-4">
        {STEPS.map((step, i) => {
          const isPrimary = i < 2;
          const borderColor = isPrimary
            ? 'color-mix(in srgb, var(--color-primary) 50%, transparent)'
            : 'color-mix(in srgb, var(--color-secondary) 50%, transparent)';
          const circleBg = isPrimary
            ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 15%, transparent), color-mix(in srgb, var(--color-primary) 5%, transparent))'
            : 'linear-gradient(135deg, color-mix(in srgb, var(--color-secondary) 15%, transparent), color-mix(in srgb, var(--color-secondary) 5%, transparent))';
          const fg = isPrimary ? 'var(--color-primary)' : 'var(--color-secondary)';

          return (
            <FadeInView
              key={step.number}
              delay={Math.min(i * staggerS, staggerCap)}
              className="flex flex-col items-center text-center"
            >
              {i > 0 ? (
                <div
                  className="mb-6 h-8 w-px shrink-0 md:hidden"
                  style={mobileSpineStyle}
                  aria-hidden
                />
              ) : null}

              <div className="relative z-[1] mb-6">
                <div
                  className="glass flex h-14 w-14 items-center justify-center rounded-full border motion-safe:transition-shadow motion-safe:duration-motion motion-safe:ease-motion-out motion-safe:hover:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.45)]"
                  style={
                    {
                      borderColor,
                      background: circleBg,
                      color: fg,
                    } as CSSProperties
                  }
                  aria-hidden
                >
                  {step.icon}
                </div>
              </div>

              <p
                className="mb-2 font-mono text-xs uppercase tracking-[0.2em]"
                style={{ color: fg }}
              >
                STEP {step.number}
              </p>
              <h3 className="mb-3 text-lg font-bold text-text">{step.title}</h3>
              <p className="max-w-[220px] text-sm leading-relaxed text-muted md:max-w-none">
                {step.description}
              </p>
            </FadeInView>
          );
        })}
      </div>
    </div>
  );
}
