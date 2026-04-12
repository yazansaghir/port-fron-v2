import { FadeInView } from '@/features/public-site/components/motion';
import { PublicButton } from '@/features/public-site/components/PublicButton';

export type HomeClosingCtaVariant = 'default' | 'elevated';

type HomeClosingCtaProps = {
  /** `elevated`: stronger frame and type scale for About; default matches Home. */
  variant?: HomeClosingCtaVariant;
};

export function HomeClosingCta({ variant = 'default' }: HomeClosingCtaProps) {
  const isElevated = variant === 'elevated';

  const shellClass = isElevated
    ? 'relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-primary/25 p-12 text-center shadow-2xl shadow-[0_28px_80px_-28px_color-mix(in_srgb,var(--color-text)_32%,transparent)] ring-1 ring-inset ring-border/45 md:p-24 motion-safe:transition-[border-color,box-shadow] motion-safe:duration-motion motion-safe:ease-motion-out motion-safe:hover:border-primary/40 motion-safe:hover:shadow-[0_28px_72px_-36px_color-mix(in_srgb,var(--color-text)_38%,transparent)]'
    : 'relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border/40 p-12 text-center md:p-20 motion-safe:transition-[border-color,box-shadow] motion-safe:duration-motion motion-safe:ease-motion-out motion-safe:hover:border-primary/35 motion-safe:hover:shadow-[0_24px_64px_-36px_color-mix(in_srgb,var(--color-text)_32%,transparent)]';

  return (
    <div className={shellClass}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 50%, color-mix(in srgb, var(--color-secondary) 8%, transparent))',
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        aria-hidden
      />

      <FadeInView className="relative">
        <p
          className={`font-mono text-xs uppercase tracking-[0.25em] text-primary ${isElevated ? 'mb-5' : 'mb-4'}`}
        >
          Open to new projects
        </p>
        <h2
          className={`font-bold tracking-tight text-text ${isElevated ? 'text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-tight' : 'text-3xl sm:text-4xl md:text-5xl'}`}
        >
          Want to work together?
        </h2>
        <p
          className={`mx-auto max-w-lg leading-relaxed text-muted ${isElevated ? 'mt-8 text-lg md:text-xl' : 'mt-6 text-lg'}`}
        >
          I'm available for freelance, contract, and long-term collaborations. Let's build something great.
        </p>

        <div
          className={`flex flex-col items-center justify-center gap-4 sm:flex-row ${isElevated ? 'mt-12' : 'mt-10'}`}
        >
          <PublicButton pill variant="primary" to="/contact" className="px-10 py-4 text-base">
            Get in touch
          </PublicButton>
          <PublicButton pill variant="secondary" to="/projects" className="px-10 py-4 text-base">
            View projects
          </PublicButton>
        </div>
      </FadeInView>
    </div>
  );
}
