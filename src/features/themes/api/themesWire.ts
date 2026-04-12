import type {
  AdminThemeDetail,
  ThemeDraftTokens,
  ThemeDraftWire,
  ThemeRevisionSummary,
  ThemeSummary,
} from '@/features/themes/api/themes.types';
import { DEFAULT_THEME_DRAFT_TOKENS } from '@/features/themes/api/themes.types';

function pickRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function parseThemeSummary(raw: unknown): ThemeSummary | null {
  const o = pickRecord(raw);
  if (!o) return null;
  const id =
    typeof o.id === 'string' && o.id.trim()
      ? o.id.trim()
      : typeof o.themeId === 'string' && o.themeId.trim()
        ? o.themeId.trim()
        : typeof o.theme_id === 'string' && o.theme_id.trim()
          ? o.theme_id.trim()
          : null;
  if (!id) return null;
  const name =
    typeof o.name === 'string'
      ? o.name
      : typeof o.title === 'string'
        ? o.title
        : typeof o.slug === 'string'
          ? o.slug
          : 'Untitled';
  const isPublished = Boolean(o.isPublished ?? o.published ?? o.isActive);
  const updatedAt =
    typeof o.updatedAt === 'string'
      ? o.updatedAt
      : typeof o.updated_at === 'string'
        ? o.updated_at
        : new Date().toISOString();
  return { id, name, isPublished, updatedAt };
}

export function parseThemeListPayload(data: unknown): ThemeSummary[] {
  if (Array.isArray(data)) {
    return data.map(parseThemeSummary).filter((x): x is ThemeSummary => x !== null);
  }
  const root = pickRecord(data);
  if (!root) return [];
  if (Array.isArray(root.items)) {
    return root.items.map(parseThemeSummary).filter((x): x is ThemeSummary => x !== null);
  }
  if (Array.isArray(root.themes)) {
    return root.themes.map(parseThemeSummary).filter((x): x is ThemeSummary => x !== null);
  }
  return [];
}

function trimTokenString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const t = value.trim();
  return t.length ? t : null;
}

/**
 * Deep-merge API / persisted token JSON into the canonical draft shape.
 */
export function parseThemeDraftTokens(raw: unknown): ThemeDraftTokens {
  const out: ThemeDraftTokens = structuredClone(DEFAULT_THEME_DRAFT_TOKENS);
  const bag = pickRecord(raw);
  if (!bag) return out;

  const bg = pickRecord(bag.background);
  if (bg) {
    const canvas = trimTokenString(bg.canvas);
    const elevated = trimTokenString(bg.elevated);
    if (canvas) out.background.canvas = canvas;
    if (elevated) out.background.elevated = elevated;
  }

  const surface = pickRecord(bag.surface);
  if (surface) {
    const def = trimTokenString(surface.default);
    const muted = trimTokenString(surface.muted);
    const inverse = trimTokenString(surface.inverse);
    if (def) out.surface.default = def;
    if (muted) out.surface.muted = muted;
    if (inverse) out.surface.inverse = inverse;
  }

  const text = pickRecord(bag.text);
  if (text) {
    const primary = trimTokenString(text.primary);
    const secondary = trimTokenString(text.secondary);
    const muted = trimTokenString(text.muted);
    const inverse = trimTokenString(text.inverse);
    if (primary) out.text.primary = primary;
    if (secondary) out.text.secondary = secondary;
    if (muted) out.text.muted = muted;
    if (inverse) out.text.inverse = inverse;
  }

  const border = pickRecord(bag.border);
  if (border) {
    const def = trimTokenString(border.default);
    const strong = trimTokenString(border.strong);
    if (def) out.border.default = def;
    if (strong) out.border.strong = strong;
  }

  const brand = pickRecord(bag.brand);
  if (brand) {
    const primary = trimTokenString(brand.primary);
    const secondary = trimTokenString(brand.secondary);
    if (primary) out.brand.primary = primary;
    if (secondary) out.brand.secondary = secondary;
  }

  const status = pickRecord(bag.status);
  if (status) {
    const success = trimTokenString(status.success);
    const warning = trimTokenString(status.warning);
    const danger = trimTokenString(status.danger);
    const info = trimTokenString(status.info);
    if (success) out.status.success = success;
    if (warning) out.status.warning = warning;
    if (danger) out.status.danger = danger;
    if (info) out.status.info = info;
  }

  const overlay = pickRecord(bag.overlay);
  if (overlay) {
    const scrim = trimTokenString(overlay.scrim);
    if (scrim) out.overlay.scrim = scrim;
  }

  const focusRing = trimTokenString(bag.focusRing);
  if (focusRing) out.focusRing = focusRing;

  return out;
}

const SEMANTIC_TOKEN_GROUP_KEYS = [
  'background',
  'surface',
  'text',
  'border',
  'brand',
  'status',
  'overlay',
] as const;

/** True when `bag` uses nested semantic groups (vs legacy flat keys). */
export function themeBagLooksSemanticNested(bag: Record<string, unknown>): boolean {
  for (const k of SEMANTIC_TOKEN_GROUP_KEYS) {
    if (pickRecord(bag[k])) return true;
  }
  return 'focusRing' in bag;
}

function parseDraftWire(raw: unknown): ThemeDraftWire | null {
  const o = pickRecord(raw);
  if (!o) return null;
  const tokensRecord =
    pickRecord(o.tokens) ??
    pickRecord(o.semanticTokens) ??
    (typeof o.tokens === 'object' && o.tokens !== null && !Array.isArray(o.tokens)
      ? (o.tokens as Record<string, unknown>)
      : null);
  const tokens = tokensRecord ? parseThemeDraftTokens(tokensRecord) : undefined;
  return {
    id: typeof o.id === 'string' ? o.id : undefined,
    versionName: typeof o.versionName === 'string' ? o.versionName : null,
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : undefined,
    tokens,
  };
}

export function parseAdminThemeDetailPayload(data: unknown): AdminThemeDetail | null {
  const base = parseThemeSummary(data);
  if (!base) return null;
  const o = pickRecord(data);
  if (!o) return { ...base, draft: null };

  const draftRaw =
    o.draft ??
    o.themeDraft ??
    o.currentDraft ??
    (pickRecord(o.draftTheme) ? (o.draftTheme as Record<string, unknown>) : null);

  const draft =
    draftRaw && typeof draftRaw === 'object'
      ? parseDraftWire(draftRaw)
      : pickRecord(o.tokens)
        ? parseDraftWire({ tokens: o.tokens })
        : pickRecord(o.themeDraftTokens)
          ? parseDraftWire({ tokens: o.themeDraftTokens })
          : null;

  return { ...base, draft };
}

export function parseRevisionSummary(raw: unknown): ThemeRevisionSummary | null {
  const o = pickRecord(raw);
  if (!o) return null;
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return null;
  const versionName =
    typeof o.versionName === 'string' ? o.versionName : typeof o.label === 'string' ? o.label : null;
  const createdAt =
    typeof o.createdAt === 'string'
      ? o.createdAt
      : typeof o.publishedAt === 'string'
        ? o.publishedAt
        : new Date().toISOString();
  return { id, versionName, createdAt };
}

export function parseRevisionsPayload(data: unknown): ThemeRevisionSummary[] {
  if (Array.isArray(data)) {
    return data.map(parseRevisionSummary).filter((x): x is ThemeRevisionSummary => x !== null);
  }
  const root = pickRecord(data);
  if (!root) return [];
  if (Array.isArray(root.items)) {
    return root.items.map(parseRevisionSummary).filter((x): x is ThemeRevisionSummary => x !== null);
  }
  if (Array.isArray(root.revisions)) {
    return root.revisions.map(parseRevisionSummary).filter((x): x is ThemeRevisionSummary => x !== null);
  }
  return [];
}
