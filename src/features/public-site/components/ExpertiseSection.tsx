import type { ExpertiseItem } from '@/features/public-site/content/expertise';
import { ExpertiseCardGrid } from '@/features/public-site/components/ExpertiseCardGrid';
import { FadeInView } from '@/features/public-site/components/motion';
import { SectionHeader } from '@/features/public-site/components/SectionHeader';
import { SectionContainer } from '@/features/public-site/components/SectionContainer';
import { PublicButton } from '@/features/public-site/components/PublicButton';

type ExpertiseSectionProps = {
  items: ExpertiseItem[];
};

export function ExpertiseSection({ items }: ExpertiseSectionProps) {
  return (
    <SectionContainer>
      <FadeInView>
        <SectionHeader
          label="Expertise"
          titlePrefix="What I "
          titleGradient="Do"
          description="End-to-end product development—from polished interfaces to reliable systems and smart automation."
          density="large"
        />
      </FadeInView>
      <ExpertiseCardGrid items={items} interactive />

      <FadeInView delay={0.08} className="mt-16 flex flex-col justify-center gap-4 sm:flex-row">
        <PublicButton pill variant="primary" to="/projects" className="px-10 py-4 text-base">
          Browse Projects →
        </PublicButton>
        <PublicButton pill variant="secondary" to="/contact" className="px-10 py-4 text-base">
          Start a Conversation
        </PublicButton>
      </FadeInView>
    </SectionContainer>
  );
}
