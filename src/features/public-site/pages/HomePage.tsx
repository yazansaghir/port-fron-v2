import { usePublishedSettings } from '@/features/settings/hooks/usePublishedSettings';
import { usePublishedProjects } from '@/features/projects/hooks/usePublishedProjects';
import { getDisplayMessage } from '@/shared/api/mapApiError';
import { PageLoading } from '@/app/router/PageLoading';
import { HeroSection } from '@/features/public-site/components/HeroSection';
import { SectionHeader } from '@/features/public-site/components/SectionHeader';
import { ProjectGrid } from '@/features/public-site/components/ProjectGrid';
import { ExpertiseSection } from '@/features/public-site/components/ExpertiseSection';
import { HomeClosingCta } from '@/features/public-site/components/HomeClosingCta';
import { PublicButton } from '@/features/public-site/components/PublicButton';
import { PublicMarketingPageFrame } from '@/features/public-site/components/PublicMarketingPageFrame';
import { SectionContainer } from '@/features/public-site/components/SectionContainer';
import { FadeInView } from '@/features/public-site/components/motion';
import { PublicFetchErrorAlert } from '@/features/public-site/components/PublicFetchErrorAlert';
import {
  getHomeHeroLines,
  HOME_HERO_EYEBROW,
  HOME_HERO_PRIMARY_CTA,
  HOME_HERO_SECONDARY_CTA,
  HOME_HERO_TAGLINE,
} from '@/features/public-site/content/homeHero';
import { expertiseItems } from '@/features/public-site/content/expertise';
import { FEATURED_PROJECTS_COUNT } from '@/features/public-site/constants';

export default function HomePage() {
  const { data: settings } = usePublishedSettings({ staleTime: 5 * 60 * 1000 });
  const {
    data: projectsPage,
    isLoading,
    isError,
    error,
  } = usePublishedProjects({ limit: FEATURED_PROJECTS_COUNT });

  const siteName = settings?.siteName ?? 'My Portfolio';
  const items = projectsPage?.items ?? [];
  const featuredProjects = items.slice(0, FEATURED_PROJECTS_COUNT);
  const totalPublished = projectsPage?.total ?? 0;
  const showViewAllProjects =
    !isLoading && !isError && totalPublished > FEATURED_PROJECTS_COUNT;

  return (
    <PublicMarketingPageFrame>
      <HeroSection
        eyebrow={HOME_HERO_EYEBROW}
        lines={getHomeHeroLines(siteName)}
        tagline={HOME_HERO_TAGLINE}
        primaryCta={HOME_HERO_PRIMARY_CTA}
        secondaryCta={HOME_HERO_SECONDARY_CTA}
      />

      <ExpertiseSection items={expertiseItems} />

      <SectionContainer id="featured" padding="compact">
        <FadeInView>
          <SectionHeader
            label="Portfolio"
            titlePrefix="Featured "
            titleGradient="Projects"
            description="A curated selection of recent work—the full archive lives on the Projects page."
          />
        </FadeInView>

        {isLoading ? (
          <PageLoading />
        ) : isError ? (
          <FadeInView>
            <PublicFetchErrorAlert
              radius="2xl"
              message={getDisplayMessage(error, 'Could not load projects.')}
            />
          </FadeInView>
        ) : (
          <>
            <ProjectGrid projects={featuredProjects} presentation="home" />
            {showViewAllProjects ? (
              <FadeInView delay={0.06} className="mt-14 flex justify-center">
                <PublicButton pill variant="secondary" to="/projects" className="px-10">
                  View all projects
                </PublicButton>
              </FadeInView>
            ) : null}
          </>
        )}
      </SectionContainer>

      <div className="py-20 md:py-28">
        <HomeClosingCta />
      </div>
    </PublicMarketingPageFrame>
  );
}
