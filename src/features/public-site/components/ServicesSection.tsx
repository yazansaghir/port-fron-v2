import type { CSSProperties, ReactNode } from 'react';

import { FadeInView, MotionCard } from '@/features/public-site/components/motion';

type ServiceId = 'fullstack' | '3dweb' | 'uiux';

type ServiceMeta = {
  id: ServiceId;
  subtitle: string;
  title: string;
  description: string;
  tags: string[];
  gradientFrom: string;
  gradientTo: string;
  iconBorder: string;
  iconColor: string;
  icon: ReactNode;
};

const ICONS: Record<ServiceId, ReactNode> = {
  fullstack: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  '3dweb': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  uiux: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
};

const SERVICE_META: ServiceMeta[] = [
  {
    id: 'fullstack',
    subtitle: 'End-to-end web applications',
    title: 'Full-Stack Development',
    description:
      'From database schema to pixel-perfect UI, I architect and deliver complete products. Clean APIs, reactive frontends, and infrastructure that scales.',
    tags: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    gradientFrom: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
    gradientTo: 'color-mix(in srgb, var(--color-primary) 3%, transparent)',
    iconBorder: 'color-mix(in srgb, var(--color-primary) 40%, transparent)',
    iconColor: 'var(--color-primary)',
    icon: ICONS.fullstack,
  },
  {
    id: '3dweb',
    subtitle: 'Immersive digital experiences',
    title: '3D Web & WebGL',
    description:
      'Interactive 3D scenes and real-time animations that turn websites into experiences. Three.js, React Three Fiber, WebGL shaders, and Spline integration.',
    tags: ['Three.js', 'React Three Fiber', 'WebGL', 'Spline'],
    gradientFrom: 'color-mix(in srgb, var(--color-secondary) 15%, transparent)',
    gradientTo: 'color-mix(in srgb, var(--color-secondary) 3%, transparent)',
    iconBorder: 'color-mix(in srgb, var(--color-secondary) 40%, transparent)',
    iconColor: 'var(--color-secondary)',
    icon: ICONS['3dweb'],
  },
  {
    id: 'uiux',
    subtitle: 'Design systems & user experience',
    title: 'UI / UX Design',
    description:
      'Intuitive interfaces built on solid design systems. Token-based theming, motion design, and accessibility-first component architecture.',
    tags: ['Figma', 'Tailwind CSS', 'Framer Motion', 'A11y'],
    gradientFrom: 'rgba(244, 114, 182, 0.15)',
    gradientTo: 'rgba(244, 114, 182, 0.03)',
    iconBorder: 'rgba(244, 114, 182, 0.4)',
    iconColor: '#f472b6',
    icon: ICONS.uiux,
  },
];

const STAGGER_S = 0.06;
const STAGGER_CAP_S = 0.18;

export function ServicesSection() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-3">
      {SERVICE_META.map((service, index) => (
        <FadeInView
          key={service.id}
          delay={Math.min(index * STAGGER_S, STAGGER_CAP_S)}
          className="min-h-0"
        >
          <MotionCard
            interactive
            className="relative flex cursor-default flex-col gap-5 overflow-hidden rounded-2xl border border-border/50 p-7 shadow-none hover:border-primary/25 hover:shadow-[0_20px_48px_-28px_rgba(0,0,0,0.55)]"
            style={
              {
                background: `linear-gradient(135deg, ${service.gradientFrom}, ${service.gradientTo})`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              } as CSSProperties
            }
          >
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${service.gradientFrom}, ${service.gradientTo})`,
              border: `1px solid ${service.iconBorder}`,
              color: service.iconColor,
            }}
            aria-hidden
          >
            {service.icon}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="mb-1 font-mono text-xs uppercase tracking-widest"
              style={{ color: service.iconColor }}
            >
              {service.subtitle}
            </p>
            <h3 className="mb-3 text-xl font-bold text-text">{service.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{service.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/40 bg-surface-2/80 px-3 py-1 font-mono text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          </MotionCard>
        </FadeInView>
      ))}
    </div>
  );
}
