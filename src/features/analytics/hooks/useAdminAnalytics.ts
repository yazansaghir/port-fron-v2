import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { getAdminAnalyticsStats } from '@/features/analytics/api/analytics.api';
import type { AdminAnalyticsStats } from '@/features/analytics/api/analytics.types';
import { analyticsKeys } from '@/features/analytics/query-keys';

export function useAdminAnalytics(
  options?: Omit<UseQueryOptions<AdminAnalyticsStats>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: analyticsKeys.adminStats(),
    queryFn: getAdminAnalyticsStats,
    ...options,
  });
}
