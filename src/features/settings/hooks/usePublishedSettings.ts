import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { getPublishedSettings } from '@/features/settings/api/settings.api';
import type { SiteSettings } from '@/features/settings/api/settings.types';
import { settingsKeys } from '@/features/settings/query-keys';

export function usePublishedSettings(
  options?: Omit<UseQueryOptions<SiteSettings>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: settingsKeys.published(),
    queryFn: getPublishedSettings,
    ...options,
  });
}
