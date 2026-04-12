import type { ProjectStatus } from '@/features/projects/api/projects.types';

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

type Props = {
  value: ProjectStatus;
  onChange: (status: ProjectStatus) => void;
  disabled?: boolean;
};

export function ProjectStatusSelect({ value, onChange, disabled = false }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ProjectStatus)}
      disabled={disabled}
      className="rounded-md border border-foreground/15 bg-background px-2 py-1 text-xs font-medium text-foreground outline-none transition focus:border-border-strong focus:ring-1 focus:ring-focus-ring/35 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Project status"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
