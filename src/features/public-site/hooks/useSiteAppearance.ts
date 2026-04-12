import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { getSiteAppearance } from '@/features/public-site/api/appearance.api';
import type { ParsedSiteAppearance } from '@/features/public-site/api/appearance.types';
import { appearanceKeys } from '@/features/public-site/query-keys';

export function useSiteAppearance(
  options?: Omit<UseQueryOptions<ParsedSiteAppearance>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: appearanceKeys.published(),
    queryFn: getSiteAppearance,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
