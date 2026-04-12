import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { listAdminThemes } from '@/features/themes/api/themes.api';
import type { ThemeSummary } from '@/features/themes/api/themes.types';
import { themesKeys } from '@/features/themes/query-keys';

export function useAdminThemesList(
  options?: Omit<UseQueryOptions<ThemeSummary[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: themesKeys.list(),
    queryFn: listAdminThemes,
    staleTime: 30 * 1000,
    ...options,
  });
}
