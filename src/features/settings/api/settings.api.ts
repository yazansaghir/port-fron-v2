import type {
  CloneSettingsRequest,
  SiteSettings,
  SiteSettingsPage,
  UpdateSettingsRequest,
} from '@/features/settings/api/settings.types';
import type { AdminSettingsPaginationParams } from '@/shared/api/pagination';
import { apiRequest } from '@/shared/api/request';

export async function getPublishedSettings(): Promise<SiteSettings> {
  return apiRequest<SiteSettings>({
    method: 'GET',
    url: '/settings',
  });
}

export async function listAdminSettings(
  params?: AdminSettingsPaginationParams,
): Promise<SiteSettingsPage> {
  return apiRequest<SiteSettingsPage>({
    method: 'GET',
    url: '/admin/settings',
    params,
  });
}

export async function updateAdminSettings(
  id: string,
  body: UpdateSettingsRequest,
): Promise<SiteSettings> {
  return apiRequest<SiteSettings>({
    method: 'PUT',
    url: `/admin/settings/${id}`,
    data: body,
  });
}

export async function cloneAdminSettings(body: CloneSettingsRequest): Promise<SiteSettings> {
  return apiRequest<SiteSettings>({
    method: 'POST',
    url: '/admin/settings/clone',
    data: body,
  });
}

export async function publishAdminSettings(id: string): Promise<SiteSettings> {
  return apiRequest<SiteSettings>({
    method: 'PATCH',
    url: `/admin/settings/${id}/publish`,
    data: {},
  });
}
