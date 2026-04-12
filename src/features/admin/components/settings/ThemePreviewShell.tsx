import {
  cssVarsToReactStyle,
  semanticTokensToCssVars,
  type NormalizedSemanticTokens,
} from '@/features/public-site/lib/theme-runtime';

type Props = {
  tokens: NormalizedSemanticTokens;
  siteName: string;
};

/**
 * Scoped preview of a token set: applies the same CSS variables as the live site,
 * but only on this subtree (no `documentElement` mutation).
 */
export function ThemePreviewShell({ tokens, siteName }: Props) {
  const scopedStyle = cssVarsToReactStyle(semanticTokensToCssVars(tokens));

  return (
    <div
      style={scopedStyle}
      className="isolate min-h-[260px] overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-sm"
    >
      <div className="border-b border-border bg-surface/60 px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-sm font-semibold tracking-tight">{siteName || 'Site name'}</span>
          <div className="flex shrink-0 gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
              aria-hidden
            />
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: 'var(--color-secondary)' }}
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-5">
        <div>
          <p className="text-base font-semibold text-foreground">Preview heading</p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">
            Body copy uses muted token. Surfaces and borders below mirror common portfolio sections.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            Primary
          </span>
          <span className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground">
            Ghost
          </span>
          <span
            className="inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium"
            style={{
              borderColor: 'var(--color-secondary)',
              color: 'var(--color-secondary)',
            }}
          >
            Accent outline
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Surface card</p>
            <p className="mt-2 text-sm text-foreground">Nested content on surface token.</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-2/80 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Surface 2</p>
            <p className="mt-2 text-sm text-foreground">Secondary panel tone.</p>
          </div>
        </div>

        <p className="text-[11px] text-muted">Draft preview — does not change the live public theme.</p>
      </div>
    </div>
  );
}
