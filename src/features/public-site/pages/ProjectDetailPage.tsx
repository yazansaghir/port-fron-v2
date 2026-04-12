import { useParams, Link } from 'react-router-dom';

import { PageLoading } from '@/app/router/PageLoading';

import { useProjectBySlug } from '@/features/projects/hooks/useProjectBySlug';
import { isApiError, getDisplayMessage } from '@/shared/api/mapApiError';
import { useTrackProjectVisitWithDwell } from '@/features/analytics/hooks/useTrackProjectVisitWithDwell';
import { ExternalLinks } from '@/features/public-site/components/ExternalLinks';
import { ProjectGallery } from '@/features/public-site/components/ProjectGallery';
import { PublicButton } from '@/features/public-site/components/PublicButton';
import { ProjectCaseStudyProse } from '@/features/public-site/components/ProjectCaseStudyProse';
import { PublicMarketingPageFrame } from '@/features/public-site/components/PublicMarketingPageFrame';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function formatDate(iso: string) {
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return iso;
  }
}

function BreadcrumbDivider() {
  return (
    <span className="text-foreground/25" aria-hidden>
      /
    </span>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError, error } = useProjectBySlug(slug);

  useTrackProjectVisitWithDwell(project?.id);

  if (isLoading) {
    return (
      <PublicMarketingPageFrame>
        <div className="min-h-[50vh] pt-8">
          <PageLoading />
        </div>
      </PublicMarketingPageFrame>
    );
  }

  if (isError) {
    const is404 = isApiError(error) && error.status === 404;
    return (
      <PublicMarketingPageFrame>
        <div className="flex min-h-[50vh] items-center justify-center py-16">
          <div className="relative max-w-lg overflow-hidden rounded-3xl border border-border/50 bg-[color-mix(in_srgb,var(--color-surface)_70%,transparent)] px-10 py-12 text-center shadow-2xl shadow-[0_25px_80px_-24px_color-mix(in_srgb,var(--color-text)_28%,transparent)] backdrop-blur-[20px]">
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 55%)',
              }}
              aria-hidden
            />
            <div className="relative">
              <p className="text-lg font-semibold text-text">
                {is404 ? 'Project not found' : 'Could not load project'}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {is404
                  ? "The project you're looking for doesn't exist or has been unpublished."
                  : getDisplayMessage(error, 'Something went wrong.')}
              </p>
              <div className="mt-8 flex justify-center">
                <PublicButton pill variant="primary" to="/projects" className="px-8">
                  Back to projects
                </PublicButton>
              </div>
            </div>
          </div>
        </div>
      </PublicMarketingPageFrame>
    );
  }

  if (!project) return null;

  const updatedLabel = formatDate(project.updatedAt);
  const createdLabel = formatDate(project.createdAt);

  return (
    <PublicMarketingPageFrame>
      <article className="pb-24 md:pb-32">
        <div className="flex flex-col gap-6 border-b border-border/45 pb-8 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <Link to="/" className="transition hover:text-primary">
              Home
            </Link>
            <BreadcrumbDivider />
            <Link to="/projects" className="transition hover:text-primary">
              Projects
            </Link>
            <BreadcrumbDivider />
            <span className="max-w-[min(100%,28rem)] truncate font-medium text-text/90">{project.title}</span>
          </nav>
          <PublicButton pill variant="secondary" to="/projects" className="shrink-0 self-start sm:self-auto">
            All projects
          </PublicButton>
        </div>

        <header className="relative pt-10 pb-12 sm:pt-12 sm:pb-14 md:pt-14 md:pb-16">
          <div
            className="pointer-events-none absolute -left-2 top-10 bottom-6 w-px sm:-left-1"
            style={{
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 35%, transparent), color-mix(in srgb, var(--color-accent) 12%, transparent), transparent)',
            }}
            aria-hidden
          />
          <div className="relative max-w-5xl pl-5 sm:pl-7">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-primary">Case study</p>
            <h1 className="max-w-5xl text-4xl font-bold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            {project.shortSummary ? (
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl sm:leading-relaxed">
                {project.shortSummary}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/40 pt-8 font-mono text-xs uppercase tracking-[0.16em] text-muted">
              <span>
                <span className="text-foreground/40">Updated </span>
                {updatedLabel}
              </span>
              {createdLabel !== updatedLabel ? (
                <span className="hidden h-3 w-px bg-border/60 sm:block" aria-hidden />
              ) : null}
              {createdLabel !== updatedLabel ? (
                <span>
                  <span className="text-foreground/40">Started </span>
                  {createdLabel}
                </span>
              ) : null}
            </div>

            <ExternalLinks githubUrl={project.githubUrl} liveUrl={project.liveUrl} />
          </div>
        </header>

        {project.content ? <ProjectCaseStudyProse content={project.content} /> : null}

        <div className="mx-auto max-w-public">
          <ProjectGallery assets={project.assets} />
        </div>

        <div className="mx-auto mt-20 max-w-public border-t border-border/45 pt-12 md:mt-24 md:pt-14">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Next</p>
              <p className="mt-2 text-lg font-semibold text-text">Explore more work</p>
              <p className="mt-1 max-w-md text-sm text-muted">Return to the archive for the full project list.</p>
            </div>
            <PublicButton pill variant="secondary" to="/projects" className="px-10 py-4 text-base">
              Back to all projects
            </PublicButton>
          </div>
        </div>
      </article>
    </PublicMarketingPageFrame>
  );
}
