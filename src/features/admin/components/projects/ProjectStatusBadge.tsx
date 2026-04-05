import type { ProjectStatus } from '@/features/projects/api/projects.types';

type Props = {
  status: ProjectStatus;
};

const STATUS_CONFIG: Record<ProjectStatus, { label: string; className: string }> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-foreground/8 text-foreground/60',
  },
  PUBLISHED: {
    label: 'Published',
    className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  },
};

export function ProjectStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        config.className,
      ].join(' ')}
    >
      {config.label}
    </span>
  );
}
