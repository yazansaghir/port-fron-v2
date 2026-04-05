import type { PaginatedResponse } from '@/shared/api/types';

/**
 * Published / admin settings from the API. `siteName` and `activeFont` drive the public site;
 * colour fields are persisted but the live UI reads brand tokens from `globals.css` instead
 * (`--color-primary`, `--color-secondary`, `--color-accent`, `--color-bg`, `--color-text`, plus
 * semantic tokens `--color-surface`, `--color-border`, `--color-text-muted`, etc.). If the API
 * later adds remote control for those tokens, extend this type and `UpdateSettingsRequest`
 * deliberately rather than overloading the legacy hex fields.
 */
export type SiteSettings = {
  id: string;
  siteName: string;
  activeFont: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textPrimary: string;
  versionName: string | null;
  isPublished: boolean;
  updatedAt: string;
};

export type SiteSettingsPage = PaginatedResponse<SiteSettings>;

export type UpdateSettingsRequest = {
  siteName?: string;
  activeFont?: string;
  primaryColor?: string;
  secondaryColor?: string;
  bgColor?: string;
  textPrimary?: string;
  versionName?: string;
};

export type CloneSettingsRequest = {
  sourceId: string;
  versionName?: string;
};
