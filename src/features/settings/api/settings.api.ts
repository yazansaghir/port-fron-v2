import type { SiteSettings } from '@/features/settings/api/settings.types';
import { apiRequest } from '@/shared/api/request';

/** Compat published configuration (metadata). Prefer `/site/appearance` for theme tokens. */
export async function getPublishedSettings(): Promise<SiteSettings> {
  return apiRequest<SiteSettings>({
    method: 'GET',
    url: '/settings',
  });
}
