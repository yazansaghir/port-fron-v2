/**
 * Compat shape for `GET /settings` (metadata fallback). Theme tokens for the live site come from
 * `GET /site/appearance` and are applied as CSS variables by `theme-runtime`.
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
