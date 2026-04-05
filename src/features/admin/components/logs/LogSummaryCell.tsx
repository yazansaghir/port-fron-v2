import type { ActivityLogItem } from '@/features/logs/api/logs.types';
import { getLogPrimaryText, getLogSummaryTitle } from './logDisplay';

type Props = {
  item: ActivityLogItem;
};

export function LogSummaryCell({ item }: Props) {
  const primary = getLogPrimaryText(item);
  const title = getLogSummaryTitle(item);
  const subtitle = item.entityLabel?.trim();

  return (
    <div className="max-w-md" title={title}>
      <span className="block truncate font-medium text-foreground">{primary}</span>
      {subtitle ? (
        <span className="mt-0.5 block truncate text-xs text-foreground/50">
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}
