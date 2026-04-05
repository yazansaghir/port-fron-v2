import { siteSettingsScopedStyle } from '@/features/public-site/lib/published-theme';

import type { SettingsEditorValues } from './SettingsEditorForm';

type Props = {
  values: SettingsEditorValues;
};

const SWATCHES: { field: keyof SettingsEditorValues; label: string }[] = [
  { field: 'primaryColor', label: 'Primary' },
  { field: 'secondaryColor', label: 'Secondary' },
  { field: 'bgColor', label: 'BG' },
  { field: 'textPrimary', label: 'Text' },
];

export function SettingsPreviewCard({ values }: Props) {
  const scopedStyle = siteSettingsScopedStyle(values);

  return (
    <div
      style={scopedStyle}
      className="overflow-hidden rounded-xl border border-foreground/10"
    >
      <p className="border-b border-foreground/10 bg-foreground/[0.03] px-4 py-2 text-[11px] leading-snug text-foreground/50">
        Scoped variables only — the public site does not use stored colours on the document root.
      </p>
      {/* Preview header bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}
      >
        <span className="text-sm font-bold">{values.siteName || 'Site Name'}</span>
        <div className="flex gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }} />
        </div>
      </div>

      {/* Preview body */}
      <div
        className="space-y-4 px-4 py-5"
        style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}
      >
        <div>
          <p className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
            {values.siteName || 'Site Name'}
          </p>
          <p className="mt-1 text-xs opacity-70" style={{ color: 'var(--color-text)' }}>
            Sample body text — paragraph styled with the current theme settings.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            Primary action
          </span>
          <span
            className="inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium"
            style={{
              borderColor: 'var(--color-secondary)',
              color: 'var(--color-secondary)',
            }}
          >
            Secondary
          </span>
        </div>

        {/* Colour swatches */}
        <div className="flex flex-wrap gap-2 pt-1">
          {SWATCHES.map(({ field, label }) => (
            <div key={field} className="flex flex-col items-center gap-1">
              <div
                className="h-7 w-7 rounded-md border border-black/10"
                style={{ backgroundColor: values[field] as string }}
                aria-label={`${label} ${values[field] as string}`}
              />
              <span className="text-[10px] opacity-60" style={{ color: 'var(--color-text)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {values.activeFont && (
          <p className="text-[11px] opacity-50" style={{ color: 'var(--color-text)' }}>
            Font: {values.activeFont}
          </p>
        )}
      </div>
    </div>
  );
}
