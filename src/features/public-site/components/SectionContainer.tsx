import type { ReactNode } from 'react';

type SectionPadding = 'default' | 'compact';

export type SectionRadialWash = 'expertise' | 'services' | 'process' | 'none';

const RADIAL_WASH_STYLES: Record<Exclude<SectionRadialWash, 'none'>, string> = {
  expertise:
    'radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--color-primary) 7%, transparent), transparent)',
  services:
    'radial-gradient(ellipse 60% 50% at 80% 50%, color-mix(in srgb, var(--color-accent) 6%, transparent), transparent)',
  process:
    'radial-gradient(ellipse 70% 60% at 20% 50%, color-mix(in srgb, var(--color-primary) 5%, transparent), transparent)',
};

type SectionContainerProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  padding?: SectionPadding;
  innerClassName?: string;
  /** Background depth per HOME_PAGE_REFERENCE §6.x; default none. */
  radialWash?: SectionRadialWash;
};

export function SectionContainer({
  children,
  id,
  className = '',
  padding = 'default',
  innerClassName = '',
  radialWash = 'none',
}: SectionContainerProps) {
  const py = padding === 'compact' ? 'py-24' : 'py-28';
  const wash =
    radialWash !== 'none' ? RADIAL_WASH_STYLES[radialWash] : undefined;

  return (
    <section id={id} className={`relative overflow-hidden ${py} ${className}`}>
      {wash ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: wash }}
          aria-hidden
        />
      ) : null}
      <div
        className={`relative z-[1] mx-auto w-full max-w-public px-0 ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
