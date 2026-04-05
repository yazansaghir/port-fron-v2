import type { PublishedProjectListItem } from '@/features/projects/api/projects.types';
import { FadeInView } from '@/features/public-site/components/motion';
import { ProjectCard, type ProjectCardVariant } from './ProjectCard';

const STAGGER_S = 0.05;
const STAGGER_CAP_S = 0.2;

export type ProjectGridPresentation = 'default' | 'home' | 'showcase';

type ProjectGridProps = {
  projects: PublishedProjectListItem[];
  presentation?: ProjectGridPresentation;
};

export function ProjectGrid({ projects, presentation = 'default' }: ProjectGridProps) {
  const variant: ProjectCardVariant =
    presentation === 'home' ? 'home' : presentation === 'showcase' ? 'showcase' : 'default';

  const gridClass =
    presentation === 'home' || presentation === 'showcase'
      ? 'grid gap-10 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  if (projects.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[color-mix(in_srgb,var(--color-surface)_65%,transparent)] px-10 py-16 text-center shadow-xl shadow-black/20 backdrop-blur-[18px] md:px-14 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--color-primary) 6%, transparent), transparent 55%)',
          }}
          aria-hidden
        />
        <p className="relative text-base font-medium text-muted md:text-lg">
          No projects published yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {projects.map((project, index) => (
        <FadeInView
          key={project.id}
          delay={Math.min(index * STAGGER_S, STAGGER_CAP_S)}
          className="min-h-0"
        >
          <ProjectCard project={project} variant={variant} />
        </FadeInView>
      ))}
    </div>
  );
}
