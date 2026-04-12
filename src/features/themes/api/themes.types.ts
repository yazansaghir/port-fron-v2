/** Admin theme list row — fields optional where API may omit. */
export type ThemeSummary = {
  id: string;
  name: string;
  isPublished: boolean;
  updatedAt: string;
};

/**
 * Semantic token groups for PUT /admin/themes/:themeId/draft (matches backend contract).
 * All leaves are string color values (hex, rgb(), etc.) as accepted by the API.
 */
export type ThemeDraftTokens = {
  background: {
    canvas: string;
    elevated: string;
  };
  surface: {
    default: string;
    muted: string;
    inverse: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  border: {
    default: string;
    strong: string;
  };
  brand: {
    primary: string;
    secondary: string;
  };
  status: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  overlay: {
    scrim: string;
  };
  focusRing: string;
};

/** Default draft palette — aligned with `globals.css` fallbacks where applicable. */
export const DEFAULT_THEME_DRAFT_TOKENS: ThemeDraftTokens = {
  background: {
    canvas: '#0a1020',
    elevated: '#121a30',
  },
  surface: {
    default: '#1e293b',
    muted: '#334155',
    inverse: '#f4f7ff',
  },
  text: {
    primary: '#f4f7ff',
    secondary: '#cbd5e1',
    muted: '#94a3b8',
    inverse: '#0f172a',
  },
  border: {
    default: '#334155',
    strong: '#475569',
  },
  brand: {
    primary: '#7c6cff',
    secondary: '#23c4d8',
  },
  status: {
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    info: '#38bdf8',
  },
  overlay: {
    scrim: 'rgba(0, 0, 0, 0.55)',
  },
  focusRing: '#7c6cff',
};

export type ThemeDraftWire = {
  id?: string;
  versionName?: string | null;
  updatedAt?: string;
  tokens?: ThemeDraftTokens | null;
};

export type ThemeRevisionSummary = {
  id: string;
  versionName: string | null;
  createdAt: string;
};

export type AdminThemeDetail = ThemeSummary & {
  draft: ThemeDraftWire | null;
};

export type CreateThemeRequest = {
  name: string;
};

export type UpdateThemeDraftRequest = {
  tokens: ThemeDraftTokens;
  versionName?: string | null;
};

export type PatchSiteSettingsRequest = {
  siteName?: string;
  /** When backend supports selecting the live theme. */
  publishedThemeId?: string;
};
