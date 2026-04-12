/**
 * Wire / parsed shapes for GET /site/appearance.
 * Parsers tolerate extra nesting (e.g. tokens under `theme`) and unknown keys.
 */

export type ParsedSiteAppearance = {
  siteName: string | null;
  activeFont: string | null;
  schemaVersion: number;
  /** Raw token entries before normalization (values may be non-string). */
  tokens: Record<string, unknown> | null;
  publishedThemeId: string | null;
};

function pickString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const t = value.trim();
  return t.length ? t : null;
}

function pickRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/**
 * Extract token bag from common API shapes.
 */
export function extractTokensFromAppearancePayload(data: unknown): Record<string, unknown> | null {
  const root = pickRecord(data);
  if (!root) return null;

  const direct = pickRecord(root.tokens);
  if (direct) return direct;

  const theme = pickRecord(root.theme);
  if (theme) {
    const t = pickRecord(theme.tokens) ?? pickRecord(theme.publishedTokens);
    if (t) return t;
  }

  const published = pickRecord(root.publishedTheme);
  if (published) {
    const t = pickRecord(published.tokens);
    if (t) return t;
  }

  return null;
}

/**
 * Narrow unknown envelope `data` into a stable ParsedSiteAppearance.
 */
export function parseSiteAppearancePayload(data: unknown): ParsedSiteAppearance {
  const root = pickRecord(data) ?? {};

  const siteName =
    pickString(root.siteName) ??
    pickString(root.site_title) ??
    pickString(root.title) ??
    null;

  const activeFont =
    pickString(root.activeFont) ??
    pickString(root.fontSans) ??
    pickString(root.fontFamily) ??
    null;

  const publishedTheme =
    pickRecord(root.publishedTheme) ?? pickRecord(root.publishedThemeSnapshot);
  const themeRef = pickRecord(root.theme);

  const publishedThemeId =
    pickString(root.publishedThemeId) ??
    pickString(root.activeThemeId) ??
    pickString(publishedTheme?.id) ??
    pickString(themeRef?.id) ??
    null;

  const schemaVersionRaw = root.schemaVersion;
  const schemaVersion =
    typeof schemaVersionRaw === 'number' && Number.isFinite(schemaVersionRaw)
      ? schemaVersionRaw
      : typeof schemaVersionRaw === 'string'
        ? Number.parseInt(schemaVersionRaw, 10) || 0
        : 0;

  return {
    siteName,
    activeFont,
    schemaVersion,
    tokens: extractTokensFromAppearancePayload(data),
    publishedThemeId,
  };
}
