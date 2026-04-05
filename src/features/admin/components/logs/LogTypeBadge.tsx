import { formatLogKindLabel } from './logDisplay';

type Props = {
  actionType: string | null;
};

export function LogTypeBadge({ actionType }: Props) {
  if (!actionType?.trim()) return <span className="text-foreground/35">—</span>;
  const label = formatLogKindLabel(actionType.trim());
  return (
    <span className="inline-flex max-w-[9rem] truncate rounded-full bg-primary/12 px-2 py-0.5 text-xs font-medium text-primary dark:text-primary">
      {label}
    </span>
  );
}
