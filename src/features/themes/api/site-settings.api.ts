import type { PatchSiteSettingsRequest } from '@/features/themes/api/themes.types';
import { apiRequest } from '@/shared/api/request';

export async function patchSiteSettings(body: PatchSiteSettingsRequest): Promise<unknown> {
  return apiRequest<unknown>({
    method: 'PATCH',
    url: '/admin/site-settings',
    data: body,
  });
}
