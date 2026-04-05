import { keepPreviousData, useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { listAdminSettings } from '@/features/settings/api/settings.api';
import type { SiteSettingsPage } from '@/features/settings/api/settings.types';
import { settingsKeys } from '@/features/settings/query-keys';
import type { AdminSettingsPaginationParams } from '@/shared/api/pagination';

export function useAdminSettingsList(
  params?: AdminSettingsPaginationParams,
  options?: Omit<UseQueryOptions<SiteSettingsPage>, 'queryKey' | 'queryFn' | 'placeholderData'>,
) {
  return useQuery({
    queryKey: settingsKeys.adminList(params),
    queryFn: () => listAdminSettings(params),
    placeholderData: keepPreviousData,
    ...options,
  });
}
