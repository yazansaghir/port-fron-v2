import {
  LOG_ACTION_TYPE_FILTER_OPTIONS,
  LOG_ENTITY_TYPE_FILTER_OPTIONS,
} from '@/features/logs/api/logs.constants';

const selectClass =
  'rounded-md border border-foreground/12 bg-background px-2.5 py-1.5 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary/30';

export type LogsFilters = {
  actionType: string;
  entityType: string;
};

type Props = {
  value: LogsFilters;
  onChange: (next: LogsFilters) => void;
};

export function LogsFilterBar({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Filter activity logs"
      className="flex flex-wrap items-center gap-2"
    >
      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground/50">
        Action
        <select
          className={selectClass}
          value={value.actionType}
          onChange={(e) => onChange({ ...value, actionType: e.target.value })}
        >
          <option value="">All types</option>
          {LOG_ACTION_TYPE_FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground/50">
        Entity
        <select
          className={selectClass}
          value={value.entityType}
          onChange={(e) => onChange({ ...value, entityType: e.target.value })}
        >
          <option value="">All entities</option>
          {LOG_ENTITY_TYPE_FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
