import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { listAdminThemeRevisions } from '@/features/themes/api/themes.api';
import type { ThemeRevisionSummary } from '@/features/themes/api/themes.types';
import { themesKeys } from '@/features/themes/query-keys';

export function useAdminThemeRevisions(
  themeId: string | null,
  options?: Omit<UseQueryOptions<ThemeRevisionSummary[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: themesKeys.revisions(themeId ?? '__none__'),
    queryFn: () => listAdminThemeRevisions(themeId!),
    enabled: Boolean(themeId),
    staleTime: 60 * 1000,
    ...options,
  });
}
