import { formatMessageDateTime } from '@/features/admin/components/messages/messageDate';
import type { SiteSettings } from '@/features/settings/api/settings.types';

type Props = {
  item: SiteSettings;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

const SWATCH_FIELDS: { key: keyof SiteSettings; label: string }[] = [
  { key: 'primaryColor', label: 'Primary' },
  { key: 'secondaryColor', label: 'Secondary' },
  { key: 'bgColor', label: 'BG' },
  { key: 'textPrimary', label: 'Text' },
];

export function SettingsVersionRow({ item, isSelected, onSelect }: Props) {
  const displayName = item.versionName ?? 'Unnamed version';

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={[
        'w-full rounded-lg border px-4 py-3 text-left transition',
        isSelected
          ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20'
          : 'border-foreground/10 bg-background hover:border-foreground/20 hover:bg-foreground/[0.03]',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        {/* Left: names + font */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">{displayName}</span>
            {item.isPublished && (
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Published
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-foreground/55">
            {item.siteName}
            {item.activeFont ? ` · ${item.activeFont}` : ''}
          </p>
        </div>

        {/* Right: stored swatches + date */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex gap-1" title="Database values; not applied on the live site">
            {SWATCH_FIELDS.map(({ key, label }) => (
              <span
                key={key}
                title={`Stored ${label}: ${String(item[key])}`}
                className="h-4 w-4 rounded-sm border border-black/10"
                style={{ backgroundColor: String(item[key]) }}
                aria-label={`Stored ${label} colour ${String(item[key])}`}
              />
            ))}
          </div>
          <span className="text-xs text-foreground/40">{formatMessageDateTime(item.updatedAt)}</span>
        </div>
      </div>
    </button>
  );
}
