import { useEffect, useMemo, useState } from 'react';

import { AdminButton } from '@/features/admin/components/ui/AdminButton';
import {
  fieldErrorClass,
  generalErrorClass,
  inputClass,
  labelClass,
} from '@/features/admin/components/settings/settingsFormClasses';
import type { AdminThemeDetail, ThemeDraftTokens, UpdateThemeDraftRequest } from '@/features/themes/api/themes.types';
import { DEFAULT_THEME_DRAFT_TOKENS } from '@/features/themes/api/themes.types';
import { parseThemeDraftTokens } from '@/features/themes/api/themesWire';
import {
  draftTokensToNormalized,
  type NormalizedSemanticTokens,
} from '@/features/public-site/lib/theme-runtime';

function isHexColorString(s: string): boolean {
  return /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(s.trim());
}

function fieldErrorForPath(fieldErrors: Record<string, string>, path: string): string | undefined {
  return (
    fieldErrors[`tokens.${path}`] ??
    fieldErrors[path] ??
    fieldErrors[path.replace(/\./g, '_')]
  );
}

type ColorFieldProps = {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (next: string) => void;
  error?: string;
  /** When false, only a text input (e.g. rgba). */
  allowColorPicker?: boolean;
  fallbackHex?: string;
};

function TokenColorField({
  id,
  label,
  value,
  disabled,
  onChange,
  error,
  allowColorPicker = true,
  fallbackHex = DEFAULT_THEME_DRAFT_TOKENS.brand.primary,
}: ColorFieldProps) {
  const trimmed = value.trim();
  const pickerValue = allowColorPicker && isHexColorString(trimmed) ? trimmed : fallbackHex;

  const textId = `${id}-text`;

  return (
    <div>
      <label htmlFor={textId} className={labelClass}>
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        {allowColorPicker && isHexColorString(trimmed) ? (
          <>
            <input
              aria-label={`${label} color picker`}
              type="color"
              value={pickerValue}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="h-9 w-12 cursor-pointer rounded border border-foreground/15 bg-transparent p-0.5"
            />
            <input
              id={textId}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              spellCheck={false}
              className={`${inputClass} flex-1 font-mono text-sm`}
            />
          </>
        ) : (
          <input
            id={textId}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            spellCheck={false}
            className={`${inputClass} font-mono text-sm`}
            placeholder={allowColorPicker ? undefined : 'rgba(0, 0, 0, 0.55)'}
          />
        )}
      </div>
      {error ? <p className={fieldErrorClass}>{error}</p> : null}
    </div>
  );
}

type SectionProps = { title: string; children: React.ReactNode };

function TokenSection({ title, children }: SectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/55">{title}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

type Props = {
  theme: AdminThemeDetail;
  isSaving: boolean;
  onSave: (body: UpdateThemeDraftRequest) => void;
  fieldErrors: Record<string, string>;
  generalError: string | null;
  /** Live draft preview on the parent (does not touch the document root). */
  onPreviewChange?: (tokens: NormalizedSemanticTokens) => void;
};

export function ThemeDraftEditor({
  theme,
  isSaving,
  onSave,
  fieldErrors,
  generalError,
  onPreviewChange,
}: Props) {
  const [tokens, setTokens] = useState<ThemeDraftTokens>(() =>
    parseThemeDraftTokens(theme.draft?.tokens ?? {}),
  );
  const [versionName, setVersionName] = useState(theme.draft?.versionName ?? '');

  const serverDraftSignature = useMemo(
    () => `${theme.id}:${theme.updatedAt}:${JSON.stringify(theme.draft?.tokens ?? {})}`,
    [theme.id, theme.updatedAt, theme.draft?.tokens],
  );

  useEffect(() => {
    const next = parseThemeDraftTokens(theme.draft?.tokens ?? {});
    setTokens(next);
    setVersionName(theme.draft?.versionName ?? '');
    onPreviewChange?.(draftTokensToNormalized(next));
    // serverDraftSignature already fingerprints `theme.draft?.tokens`.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [serverDraftSignature, theme.draft?.versionName, onPreviewChange]);

  function pushPreview(next: ThemeDraftTokens) {
    onPreviewChange?.(draftTokensToNormalized(next));
  }

  function handleResetToDefaults() {
    const next = structuredClone(DEFAULT_THEME_DRAFT_TOKENS);
    setTokens(next);
    pushPreview(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      tokens,
      ...(versionName.trim() ? { versionName: versionName.trim() } : {}),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {generalError ? <p className={generalErrorClass}>{generalError}</p> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="draft-version" className={labelClass}>
            Draft label <span className="font-normal text-foreground/50">(optional)</span>
          </label>
          <input
            id="draft-version"
            type="text"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            disabled={isSaving}
            maxLength={80}
            placeholder="Spring refresh"
            className={inputClass}
          />
          {fieldErrors['versionName'] ? (
            <p className={fieldErrorClass}>{fieldErrors['versionName']}</p>
          ) : null}
        </div>
      </div>

      <TokenSection title="Background">
        <TokenColorField
          id="tok-bg-canvas"
          label="Canvas"
          value={tokens.background.canvas}
          disabled={isSaving}
          onChange={(canvas) => {
            setTokens((prev) => {
              const next = { ...prev, background: { ...prev.background, canvas } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'background.canvas')}
        />
        <TokenColorField
          id="tok-bg-elevated"
          label="Elevated"
          value={tokens.background.elevated}
          disabled={isSaving}
          onChange={(elevated) => {
            setTokens((prev) => {
              const next = { ...prev, background: { ...prev.background, elevated } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'background.elevated')}
        />
      </TokenSection>

      <TokenSection title="Surface">
        <TokenColorField
          id="tok-surface-default"
          label="Default"
          value={tokens.surface.default}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, surface: { ...prev.surface, default: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'surface.default')}
        />
        <TokenColorField
          id="tok-surface-muted"
          label="Muted"
          value={tokens.surface.muted}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, surface: { ...prev.surface, muted: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'surface.muted')}
        />
        <TokenColorField
          id="tok-surface-inverse"
          label="Inverse"
          value={tokens.surface.inverse}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, surface: { ...prev.surface, inverse: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'surface.inverse')}
        />
      </TokenSection>

      <TokenSection title="Text">
        <TokenColorField
          id="tok-text-primary"
          label="Primary"
          value={tokens.text.primary}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, text: { ...prev.text, primary: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'text.primary')}
        />
        <TokenColorField
          id="tok-text-secondary"
          label="Secondary"
          value={tokens.text.secondary}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, text: { ...prev.text, secondary: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'text.secondary')}
        />
        <TokenColorField
          id="tok-text-muted"
          label="Muted"
          value={tokens.text.muted}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, text: { ...prev.text, muted: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'text.muted')}
        />
        <TokenColorField
          id="tok-text-inverse"
          label="Inverse"
          value={tokens.text.inverse}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, text: { ...prev.text, inverse: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'text.inverse')}
        />
      </TokenSection>

      <TokenSection title="Border">
        <TokenColorField
          id="tok-border-default"
          label="Default"
          value={tokens.border.default}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, border: { ...prev.border, default: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'border.default')}
        />
        <TokenColorField
          id="tok-border-strong"
          label="Strong"
          value={tokens.border.strong}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, border: { ...prev.border, strong: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'border.strong')}
        />
      </TokenSection>

      <TokenSection title="Brand">
        <TokenColorField
          id="tok-brand-primary"
          label="Primary"
          value={tokens.brand.primary}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, brand: { ...prev.brand, primary: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'brand.primary')}
        />
        <TokenColorField
          id="tok-brand-secondary"
          label="Secondary"
          value={tokens.brand.secondary}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, brand: { ...prev.brand, secondary: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'brand.secondary')}
        />
      </TokenSection>

      <TokenSection title="Status">
        <TokenColorField
          id="tok-status-success"
          label="Success"
          value={tokens.status.success}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, status: { ...prev.status, success: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'status.success')}
        />
        <TokenColorField
          id="tok-status-warning"
          label="Warning"
          value={tokens.status.warning}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, status: { ...prev.status, warning: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'status.warning')}
        />
        <TokenColorField
          id="tok-status-danger"
          label="Danger"
          value={tokens.status.danger}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, status: { ...prev.status, danger: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'status.danger')}
        />
        <TokenColorField
          id="tok-status-info"
          label="Info"
          value={tokens.status.info}
          disabled={isSaving}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, status: { ...prev.status, info: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'status.info')}
        />
      </TokenSection>

      <TokenSection title="Overlay & focus">
        <TokenColorField
          id="tok-overlay-scrim"
          label="Scrim"
          value={tokens.overlay.scrim}
          disabled={isSaving}
          allowColorPicker={false}
          onChange={(v) => {
            setTokens((prev) => {
              const next = { ...prev, overlay: { ...prev.overlay, scrim: v } };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'overlay.scrim')}
        />
        <TokenColorField
          id="tok-focus-ring"
          label="Focus ring"
          value={tokens.focusRing}
          disabled={isSaving}
          onChange={(focusRing) => {
            setTokens((prev) => {
              const next = { ...prev, focusRing };
              pushPreview(next);
              return next;
            });
          }}
          error={fieldErrorForPath(fieldErrors, 'focusRing')}
        />
      </TokenSection>

      <div className="flex flex-wrap justify-end gap-2">
        <AdminButton type="button" variant="ghost" disabled={isSaving} onClick={handleResetToDefaults}>
          Reset to defaults
        </AdminButton>
        <AdminButton type="submit" disabled={isSaving} className="px-4 py-2">
          {isSaving ? 'Saving…' : 'Save draft'}
        </AdminButton>
      </div>
    </form>
  );
}
