import type { CSSProperties } from 'react';

import type { ThemeDraftTokens } from '@/features/themes/api/themes.types';
import { DEFAULT_THEME_DRAFT_TOKENS } from '@/features/themes/api/themes.types';
import { parseThemeDraftTokens, themeBagLooksSemanticNested } from '@/features/themes/api/themesWire';

const FONT_DEFAULTS = {
  fontSans: 'ui-sans-serif, system-ui, sans-serif',
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

/**
 * Semantic keys after normalization (internal contract).
 * Mapped to `--color-*` / `--font-*` for Tailwind + globals.css alignment.
 */
export type SemanticTokenKey =
  | 'primary'
  | 'primaryForeground'
  | 'secondary'
  | 'accent'
  | 'bg'
  | 'bgElevated'
  | 'text'
  | 'textSecondary'
  | 'textMuted'
  | 'border'
  | 'borderStrong'
  | 'surface'
  | 'surface2'
  | 'surfaceInverse'
  | 'statusSuccess'
  | 'statusWarning'
  | 'statusDanger'
  | 'statusInfo'
  | 'overlayScrim'
  | 'focusRing'
  | 'fontSans'
  | 'fontMono';

export type NormalizedSemanticTokens = Record<SemanticTokenKey, string>;

const CSS_VAR_KEYS = [
  '--color-primary',
  '--color-primary-foreground',
  '--color-secondary',
  '--color-accent',
  '--color-bg',
  '--color-bg-elevated',
  '--color-text',
  '--color-text-secondary',
  '--color-text-muted',
  '--color-border',
  '--color-border-strong',
  '--color-surface',
  '--color-surface-2',
  '--color-surface-inverse',
  '--color-status-success',
  '--color-status-warning',
  '--color-status-danger',
  '--color-status-info',
  '--color-overlay-scrim',
  '--color-focus-ring',
  '--font-sans',
  '--font-mono',
] as const;

type CssVarKey = (typeof CSS_VAR_KEYS)[number];

/**
 * Wire/API key → semantic key (first match wins when iterating entries).
 */
const WIRE_KEY_ALIASES: Record<string, SemanticTokenKey> = {
  primary: 'primary',
  primaryColor: 'primary',
  colorPrimary: 'primary',
  brandPrimary: 'primary',

  primaryForeground: 'primaryForeground',
  primary_foreground: 'primaryForeground',
  onPrimary: 'primaryForeground',

  secondary: 'secondary',
  secondaryColor: 'secondary',
  colorSecondary: 'secondary',

  accent: 'accent',
  tertiary: 'accent',

  bg: 'bg',
  background: 'bg',
  bgColor: 'bg',
  colorBackground: 'bg',

  text: 'text',
  textPrimary: 'text',
  foreground: 'text',
  colorText: 'text',

  textMuted: 'textMuted',
  muted: 'textMuted',
  mutedForeground: 'textMuted',

  border: 'border',
  colorBorder: 'border',

  surface: 'surface',
  colorSurface: 'surface',

  surface2: 'surface2',
  surfaceSecondary: 'surface2',
  colorSurface2: 'surface2',

  fontSans: 'fontSans',
  activeFont: 'fontSans',
  fontFamily: 'fontSans',

  fontMono: 'fontMono',
};

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isLikelyColorToken(key: SemanticTokenKey): boolean {
  return key !== 'fontSans' && key !== 'fontMono';
}

export function contrastForeground(bgHex: string): string {
  const hex = bgHex.replace('#', '');
  if (hex.length !== 6 && hex.length !== 3) return '#ffffff';
  const expand = (h: string) =>
    h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const full = expand(hex);
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const linearise = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
  return L > 0.179 ? '#0f172a' : '#ffffff';
}

function sanitizeColor(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (HEX_RE.test(t)) return t.toLowerCase();
  return null;
}

function sanitizeFontStack(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (t.length > 400) return null;
  return t;
}

function coerceWireKey(key: string): string {
  return key.trim();
}

/**
 * Map backend / draft semantic token tree → CSS variable contract used by Tailwind + preview.
 * Fonts are not part of the draft API; public defaults apply.
 */
export function draftTokensToNormalized(tokens: ThemeDraftTokens): NormalizedSemanticTokens {
  return {
    primary: tokens.brand.primary,
    primaryForeground: contrastForeground(tokens.brand.primary),
    secondary: tokens.brand.secondary,
    accent: tokens.status.info,
    bg: tokens.background.canvas,
    bgElevated: tokens.background.elevated,
    text: tokens.text.primary,
    textSecondary: tokens.text.secondary,
    textMuted: tokens.text.muted,
    border: tokens.border.default,
    borderStrong: tokens.border.strong,
    surface: tokens.surface.default,
    surface2: tokens.surface.muted,
    surfaceInverse: tokens.surface.inverse,
    statusSuccess: tokens.status.success,
    statusWarning: tokens.status.warning,
    statusDanger: tokens.status.danger,
    statusInfo: tokens.status.info,
    overlayScrim: tokens.overlay.scrim,
    focusRing: tokens.focusRing,
    fontSans: FONT_DEFAULTS.fontSans,
    fontMono: FONT_DEFAULTS.fontMono,
  };
}

/** Mirrors defaults in `globals.css` :root — used for merge + reset behaviour. */
export const SEMANTIC_DEFAULTS: NormalizedSemanticTokens = draftTokensToNormalized(
  DEFAULT_THEME_DRAFT_TOKENS,
);

/**
 * Normalize arbitrary API token maps into semantic tokens, merged on top of defaults.
 */
export function normalizeThemeTokens(
  raw: unknown,
  schemaVersion = 0,
): NormalizedSemanticTokens {
  void schemaVersion;
  const bag = typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};

  if (themeBagLooksSemanticNested(bag)) {
    return draftTokensToNormalized(parseThemeDraftTokens(bag));
  }

  const out: NormalizedSemanticTokens = { ...SEMANTIC_DEFAULTS };
  const explicit = new Set<SemanticTokenKey>();

  for (const [wireKey, value] of Object.entries(bag)) {
    const semantic = WIRE_KEY_ALIASES[coerceWireKey(wireKey)];
    if (!semantic) continue;
    if (typeof value !== 'string') continue;

    if (semantic === 'fontSans' || semantic === 'fontMono') {
      const f = sanitizeFontStack(value);
      if (f) {
        out[semantic] = f;
        explicit.add(semantic);
      }
      continue;
    }

    const c = sanitizeColor(value);
    if (c) {
      out[semantic] = c;
      explicit.add(semantic);
    }
  }

  if (!explicit.has('primaryForeground')) {
    out.primaryForeground = contrastForeground(out.primary);
  }

  return out;
}

export function semanticTokensToCssVars(tokens: NormalizedSemanticTokens): Record<CssVarKey, string> {
  const fontSans = tokens.fontSans.trim().length
    ? `${tokens.fontSans}, ui-sans-serif, system-ui, sans-serif`
    : SEMANTIC_DEFAULTS.fontSans;

  const fontMono = tokens.fontMono.trim().length
    ? `${tokens.fontMono}, ui-monospace, monospace`
    : SEMANTIC_DEFAULTS.fontMono;

  return {
    '--color-primary': tokens.primary,
    '--color-primary-foreground': tokens.primaryForeground,
    '--color-secondary': tokens.secondary,
    '--color-accent': tokens.accent,
    '--color-bg': tokens.bg,
    '--color-bg-elevated': tokens.bgElevated,
    '--color-text': tokens.text,
    '--color-text-secondary': tokens.textSecondary,
    '--color-text-muted': tokens.textMuted,
    '--color-border': tokens.border,
    '--color-border-strong': tokens.borderStrong,
    '--color-surface': tokens.surface,
    '--color-surface-2': tokens.surface2,
    '--color-surface-inverse': tokens.surfaceInverse,
    '--color-status-success': tokens.statusSuccess,
    '--color-status-warning': tokens.statusWarning,
    '--color-status-danger': tokens.statusDanger,
    '--color-status-info': tokens.statusInfo,
    '--color-overlay-scrim': tokens.overlayScrim,
    '--color-focus-ring': tokens.focusRing,
    '--font-sans': fontSans,
    '--font-mono': fontMono,
  };
}

export function cssVarsToReactStyle(vars: Record<CssVarKey, string>): CSSProperties {
  return vars as unknown as CSSProperties;
}

export function applyCssVarsToElement(el: HTMLElement, vars: Record<CssVarKey, string>): void {
  for (const [k, v] of Object.entries(vars) as [CssVarKey, string][]) {
    el.style.setProperty(k, v);
  }
}

/** Clears inline theme variables this layer manages (stylesheet defaults apply). */
export function resetManagedThemeVars(el: HTMLElement): void {
  for (const k of CSS_VAR_KEYS) {
    el.style.removeProperty(k);
  }
}

export function appearanceTokensToNormalized(
  tokens: Record<string, unknown> | null,
  schemaVersion: number,
): NormalizedSemanticTokens {
  return normalizeThemeTokens(tokens ?? {}, schemaVersion);
}

/**
 * @deprecated Draft save uses nested `ThemeDraftTokens`; kept for ad-hoc tooling/tests.
 */
export function normalizedTokensToWireRecord(tokens: NormalizedSemanticTokens): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.keys(tokens) as SemanticTokenKey[]) {
    out[k] = tokens[k];
  }
  return out;
}
