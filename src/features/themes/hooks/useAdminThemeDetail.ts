import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { getAdminTheme } from '@/features/themes/api/themes.api';
import type { AdminThemeDetail } from '@/features/themes/api/themes.types';
import { themesKeys } from '@/features/themes/query-keys';

export function useAdminThemeDetail(
  themeId: string | null,
  options?: Omit<UseQueryOptions<AdminThemeDetail>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: themesKeys.detail(themeId ?? '__none__'),
    queryFn: () => getAdminTheme(themeId!),
    enabled: Boolean(themeId),
    staleTime: 15 * 1000,
    ...options,
  });
}
