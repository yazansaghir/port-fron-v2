import type { CSSProperties } from 'react';

import type { SiteSettings } from '@/features/settings/api/settings.types';

/** Mirrors defaults in `globals.css` :root (single palette source). */
export const THEME_DEFAULTS = {
  primaryColor: '#7c6cff',
  secondaryColor: '#23c4d8',
  bgColor: '#0a1020',
  textPrimary: '#f4f7ff',
  activeFont: 'ui-sans-serif, system-ui, sans-serif',
} as const;

/**
 * Derive an accessible foreground colour for text on top of `bgHex`.
 * Returns '#ffffff' or '#0f172a' based on relative luminance.
 */
export function contrastForeground(bgHex: string): string {
  const hex = bgHex.replace('#', '');
  if (hex.length !== 6) return '#ffffff';
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const linearise = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
  return L > 0.179 ? '#0f172a' : '#ffffff';
}

/**
 * Live site: colours come from `globals.css` only. Published settings control
 * body font stack via `--font-sans`.
 */
export function applySiteSettingsToDocument(settings: SiteSettings): void {
  const root = document.documentElement;
  const fontValue = settings.activeFont?.trim()
    ? `${settings.activeFont}, ui-sans-serif, system-ui, sans-serif`
    : THEME_DEFAULTS.activeFont;
  root.style.setProperty('--font-sans', fontValue);
}

/** Clear inline overrides so stylesheet tokens apply (e.g. leaving the public layout). */
export function resetThemeToDefaults(): void {
  const root = document.documentElement;
  root.style.removeProperty('--font-sans');
}

type PreviewSettings = Pick<
  SiteSettings,
  'primaryColor' | 'secondaryColor' | 'bgColor' | 'textPrimary' | 'activeFont'
>;

/**
 * Scopes CSS variables onto a single element (admin preview). Not used on the public site.
 */
export function siteSettingsScopedStyle(settings: PreviewSettings): CSSProperties {
  const fontValue = settings.activeFont?.trim()
    ? `${settings.activeFont}, ui-sans-serif, system-ui, sans-serif`
    : THEME_DEFAULTS.activeFont;

  return {
    '--color-primary': settings.primaryColor,
    '--color-secondary': settings.secondaryColor,
    '--color-accent': settings.secondaryColor,
    '--color-bg': settings.bgColor,
    '--color-text': settings.textPrimary,
    '--color-primary-foreground': contrastForeground(settings.primaryColor),
    '--font-sans': fontValue,
  } as CSSProperties;
}
