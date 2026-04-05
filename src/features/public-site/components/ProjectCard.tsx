import { Link } from 'react-router-dom';

import type { PublishedProjectListItem } from '@/features/projects/api/projects.types';

export type ProjectCardVariant = 'default' | 'home' | 'showcase';

type ProjectCardProps = {
  project: PublishedProjectListItem;
  variant?: ProjectCardVariant;
};

function DefaultCard({ project }: { project: PublishedProjectListItem }) {
  return (
    <article className="motion-hover-lift motion-card-surface group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.03] shadow-none hover:border-primary/35 hover:shadow-[0_16px_36px_-20px_rgba(0,0,0,0.45)]">
      <Link
        to={`/projects/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {project.thumbnailUrl ? (
          <div className="aspect-[16/9] overflow-hidden bg-foreground/5">
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-motion-slow ease-motion-out motion-safe:group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] flex items-center justify-center bg-foreground/5">
            <span className="select-none text-3xl font-bold text-foreground/10">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-1.5 p-5">
          <h3 className="font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          {project.shortSummary ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-foreground/60">
              {project.shortSummary}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

/** Large home-page featured variant: taller media, stronger hierarchy, more breathing room. */
function HomeCard({ project }: { project: PublishedProjectListItem }) {
  return (
    <article
      className="motion-hover-lift motion-card-surface group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-b from-foreground/[0.07] to-foreground/[0.02] shadow-[0_32px_72px_-32px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.07)] hover:border-primary/30 hover:shadow-[0_40px_80px_-32px_rgba(0,0,0,0.7),0_0_48px_-16px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]"
      style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* Media area — tall aspect ratio */}
        <div className="p-3 pb-0">
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-inset ring-white/[0.08]">
            <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/[0.1] to-secondary/[0.07]">
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-motion-slow ease-motion-out motion-safe:group-hover:scale-[1.02]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="select-none text-7xl font-black tracking-tight text-foreground/[0.07]">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {/* Overlay gradient */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent"
                aria-hidden
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 px-7 pb-7 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/90">Featured project</p>
          <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
            {project.title}
          </h3>
          {project.shortSummary ? (
            <p className="text-base leading-relaxed text-foreground/60">
              {project.shortSummary}
            </p>
          ) : null}

          <div className="mt-2">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-foreground/[0.06] px-5 py-2.5 text-sm font-semibold tracking-wide text-foreground/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-[border-color,background-color,color,gap] duration-motion-fast ease-motion-out motion-safe:group-hover:gap-3 group-hover:border-primary/40 group-hover:bg-primary/[0.12] group-hover:text-primary">
              View case study
              <svg
                width="15"
                height="15"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
                className="shrink-0 opacity-75 motion-safe:transition-transform motion-safe:duration-motion motion-safe:ease-motion-out motion-safe:group-hover:translate-x-0.5"
              >
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/** Projects listing: same premium surface as home; subtle media zoom on hover. */
function ShowcaseCard({ project }: { project: PublishedProjectListItem }) {
  return (
    <article
      className="motion-hover-lift motion-card-surface group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-b from-foreground/[0.07] to-foreground/[0.02] shadow-[0_32px_72px_-32px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.07)] hover:border-primary/30 hover:shadow-[0_40px_80px_-32px_rgba(0,0,0,0.7),0_0_48px_-16px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]"
      style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="p-3 pb-0">
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-inset ring-white/[0.08]">
            <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/[0.1] to-secondary/[0.07]">
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-motion-slow ease-motion-out motion-safe:group-hover:scale-[1.02]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="select-none text-7xl font-black tracking-tight text-foreground/[0.07]">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent"
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-7 pb-7 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary/90">Case study</p>
          <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
            {project.title}
          </h3>
          {project.shortSummary ? (
            <p className="line-clamp-3 text-base leading-relaxed text-foreground/60">{project.shortSummary}</p>
          ) : null}

          <div className="mt-2">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-foreground/[0.06] px-5 py-2.5 text-sm font-semibold tracking-wide text-foreground/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-[border-color,background-color,color,gap] duration-motion-fast ease-motion-out motion-safe:group-hover:gap-3 group-hover:border-primary/40 group-hover:bg-primary/[0.12] group-hover:text-primary">
              View case study
              <svg
                width="15"
                height="15"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
                className="shrink-0 opacity-75 motion-safe:transition-transform motion-safe:duration-motion motion-safe:ease-motion-out motion-safe:group-hover:translate-x-0.5"
              >
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  if (variant === 'home') {
    return <HomeCard project={project} />;
  }
  if (variant === 'showcase') {
    return <ShowcaseCard project={project} />;
  }
  return <DefaultCard project={project} />;
}
