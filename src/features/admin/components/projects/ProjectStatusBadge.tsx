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
    className: 'bg-status-success/15 text-status-success',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-status-warning/15 text-status-warning',
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
