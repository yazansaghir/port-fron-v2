import { formatLogKindLabel } from './logDisplay';

type Props = {
  entityType: string | null;
};

export function EntityTypeBadge({ entityType }: Props) {
  if (!entityType?.trim()) return <span className="text-foreground/35">—</span>;
  const label = formatLogKindLabel(entityType.trim());
  return (
    <span className="inline-flex max-w-[9rem] truncate rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/70">
      {label}
    </span>
  );
}
