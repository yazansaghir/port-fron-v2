import { FadeInView } from '@/features/public-site/components/motion';
import { ProcessSection } from '@/features/public-site/components/ProcessSection';
import { PublicMarketingPageFrame } from '@/features/public-site/components/PublicMarketingPageFrame';
import { SectionContainer } from '@/features/public-site/components/SectionContainer';
import { SectionHeader } from '@/features/public-site/components/SectionHeader';
import { ServicesSection } from '@/features/public-site/components/ServicesSection';
import {
  ABOUT_SUMMARY_PARAGRAPHS,
  ABOUT_SUMMARY_SECTION,
} from '@/features/public-site/content/aboutContent';

const SERVICES_HEADER = {
  label: 'Services',
  titlePrefix: 'What I ',
  titleGradient: 'Offer',
  description:
    'Three core service pillars, each backed by years of hands-on production experience and a relentless focus on quality.',
} as const;

const PROCESS_HEADER = {
  label: 'Workflow',
  titlePrefix: 'How I ',
  titleGradient: 'Work',
  description:
    'A structured, transparent process from first conversation to production launch — and everything in between.',
} as const;

export default function AboutPage() {
  return (
    <PublicMarketingPageFrame>
      <SectionContainer
        id="summary"
        padding="compact"
        className="!pt-12 !pb-28 sm:!pt-16 sm:!pb-28 md:!pt-20 md:!pb-32"
        radialWash="expertise"
      >
        <FadeInView>
          <SectionHeader
            align="left"
            label={ABOUT_SUMMARY_SECTION.label}
            title={ABOUT_SUMMARY_SECTION.title}
            description={ABOUT_SUMMARY_SECTION.description}
            density="compact"
          />
          <div className="relative max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[color-mix(in_srgb,var(--color-surface)_72%,transparent)] p-10 shadow-2xl shadow-black/25 backdrop-blur-[20px] md:p-12">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 55%)',
              }}
              aria-hidden
            />
            <div className="relative space-y-6 text-base leading-relaxed md:text-lg">
              {ABOUT_SUMMARY_PARAGRAPHS.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? 'font-medium text-foreground/95 text-pretty'
                      : 'text-muted text-pretty'
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </FadeInView>
      </SectionContainer>

      <SectionContainer
        id="services"
        padding="compact"
        className="!py-28 md:!py-32"
        radialWash="services"
      >
        <FadeInView>
          <SectionHeader
            align="center"
            label={SERVICES_HEADER.label}
            titlePrefix={SERVICES_HEADER.titlePrefix}
            titleGradient={SERVICES_HEADER.titleGradient}
            description={SERVICES_HEADER.description}
            density="default"
          />
        </FadeInView>
        <ServicesSection />
      </SectionContainer>

      <SectionContainer
        id="process"
        padding="compact"
        className="!py-28 md:!pb-32 md:!pt-28"
        radialWash="process"
      >
        <FadeInView>
          <SectionHeader
            align="center"
            label={PROCESS_HEADER.label}
            titlePrefix={PROCESS_HEADER.titlePrefix}
            titleGradient={PROCESS_HEADER.titleGradient}
            description={PROCESS_HEADER.description}
            density="default"
          />
        </FadeInView>
        <ProcessSection />
      </SectionContainer>
    </PublicMarketingPageFrame>
  );
}
