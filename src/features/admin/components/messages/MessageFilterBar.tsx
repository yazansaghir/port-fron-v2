export type MessageFilter = 'all' | 'unread' | 'read';

const FILTERS: { value: MessageFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
];

type Props = {
  value: MessageFilter;
  onChange: (filter: MessageFilter) => void;
};

export function MessageFilterBar({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Filter messages"
      className="inline-flex rounded-md border border-foreground/12 bg-background shadow-sm"
    >
      {FILTERS.map(({ value: fv, label }) => {
        const active = value === fv;
        return (
          <button
            key={fv}
            type="button"
            onClick={() => onChange(fv)}
            aria-pressed={active}
            className={[
              'px-3 py-1.5 text-sm font-medium transition-colors first:rounded-l-md last:rounded-r-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/70 hover:bg-foreground/5',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
