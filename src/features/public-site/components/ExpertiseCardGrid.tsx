import type { ExpertiseItem } from '@/features/public-site/content/expertise';
import { EXPERTISE_ICONS } from '@/features/public-site/components/expertiseIcons';
import { FadeInView, MotionCard } from '@/features/public-site/components/motion';

type ExpertiseCardGridProps = {
  items: ExpertiseItem[];
  /** When false, omit hover border transition (static grid). */
  interactive?: boolean;
};

const STAGGER_S = 0.05;
const STAGGER_CAP_S = 0.2;

export function ExpertiseCardGrid({ items, interactive = true }: ExpertiseCardGridProps) {
  const cardClass = interactive
    ? 'glass group flex flex-col gap-4 rounded-2xl border border-border/40 p-6 shadow-none hover:border-primary/30 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)]'
    : 'glass flex flex-col gap-4 rounded-2xl border border-border/40 p-6';

  const iconWrapClass = 'flex h-12 w-12 items-center justify-center rounded-xl text-primary';

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <FadeInView
          key={item.title}
          delay={interactive ? Math.min(index * STAGGER_S, STAGGER_CAP_S) : 0}
          className="min-h-0"
        >
          <MotionCard interactive={interactive} className={cardClass}>
            <div
              className={iconWrapClass}
              style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
              aria-hidden
            >
              {EXPERTISE_ICONS[item.iconIndex] ?? EXPERTISE_ICONS[0]}
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-text motion-safe:transition-colors motion-safe:duration-motion-fast motion-safe:ease-motion-out motion-safe:group-hover:text-primary/95">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          </MotionCard>
        </FadeInView>
      ))}
    </div>
  );
}
