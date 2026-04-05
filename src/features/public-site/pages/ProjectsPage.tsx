import { usePublishedProjects } from '@/features/projects/hooks/usePublishedProjects';
import { PROJECTS_MAX_LIMIT } from '@/shared/api/pagination';
import { getDisplayMessage } from '@/shared/api/mapApiError';
import { PageLoading } from '@/app/router/PageLoading';
import { GradientText } from '@/features/public-site/components/GradientText';
import { FadeInView } from '@/features/public-site/components/motion';
import { ProjectGrid } from '@/features/public-site/components/ProjectGrid';
import { PublicFetchErrorAlert } from '@/features/public-site/components/PublicFetchErrorAlert';
import { PublicMarketingPageFrame } from '@/features/public-site/components/PublicMarketingPageFrame';
import {
  PROJECTS_HERO_DESCRIPTION,
  PROJECTS_HERO_EYEBROW,
  PROJECTS_HERO_LINE1,
  PROJECTS_HERO_LINE2_GRADIENT,
  PROJECTS_HERO_LINE2_PREFIX,
  PROJECTS_HERO_LINE2_SUFFIX,
} from '@/features/public-site/content/projectsPage';

export default function ProjectsPage() {
  const {
    data: projectsPage,
    isLoading,
    isError,
    error,
  } = usePublishedProjects({ limit: PROJECTS_MAX_LIMIT });

  const projects = projectsPage?.items ?? [];

  return (
    <PublicMarketingPageFrame>
      <header className="relative pt-10 pb-14 sm:pt-14 sm:pb-16 md:pt-16 md:pb-20">
        <div
          className="pointer-events-none absolute -left-2 top-8 bottom-8 w-px sm:-left-1"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 35%, transparent), color-mix(in srgb, var(--color-accent) 12%, transparent), transparent)',
          }}
          aria-hidden
        />
        <FadeInView className="relative max-w-5xl pl-5 sm:pl-7">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-primary">
            {PROJECTS_HERO_EYEBROW}
          </p>
          <h1 className="mb-8 max-w-5xl text-4xl font-bold leading-[1.08] tracking-tight text-text sm:text-6xl lg:text-7xl">
            <span className="block text-text">{PROJECTS_HERO_LINE1}</span>
            <span className="mt-2 block text-text sm:mt-3">
              {PROJECTS_HERO_LINE2_PREFIX}
              <GradientText>{PROJECTS_HERO_LINE2_GRADIENT}</GradientText>
              {PROJECTS_HERO_LINE2_SUFFIX}
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-[1.7] text-muted sm:text-lg md:max-w-3xl md:text-xl md:leading-relaxed">
            {PROJECTS_HERO_DESCRIPTION}
          </p>
        </FadeInView>
      </header>

      <section id="projects-list" aria-label="Project archive" className="pb-20 md:pb-28">
        {isLoading ? (
          <PageLoading />
        ) : isError ? (
          <FadeInView>
            <PublicFetchErrorAlert
              radius="xl"
              message={getDisplayMessage(error, 'Could not load projects.')}
            />
          </FadeInView>
        ) : (
          <ProjectGrid projects={projects} presentation="showcase" />
        )}
      </section>
    </PublicMarketingPageFrame>
  );
}
