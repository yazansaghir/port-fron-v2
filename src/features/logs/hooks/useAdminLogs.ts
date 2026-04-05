import { keepPreviousData, useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { listAdminLogs } from '@/features/logs/api/logs.api';
import type { AdminLogsPage, AdminLogsQueryParams } from '@/features/logs/api/logs.types';
import { logsKeys } from '@/features/logs/query-keys';

export function useAdminLogs(
  params?: AdminLogsQueryParams,
  options?: Omit<UseQueryOptions<AdminLogsPage>, 'queryKey' | 'queryFn' | 'placeholderData'>,
) {
  return useQuery({
    queryKey: logsKeys.list(params),
    queryFn: () => listAdminLogs(params),
    placeholderData: keepPreviousData,
    ...options,
  });
}

/** Alias matching common naming in dashboards */
export { useAdminLogs as useLogs };
