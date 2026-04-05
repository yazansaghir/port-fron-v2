import { keepPreviousData, useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { listAdminMessages } from '@/features/messages/api/messages.api';
import type { AdminMessagesPage, AdminMessagesQueryParams } from '@/features/messages/api/messages.types';
import { messagesKeys } from '@/features/messages/query-keys';

export function useAdminMessages(
  params?: AdminMessagesQueryParams,
  options?: Omit<UseQueryOptions<AdminMessagesPage>, 'queryKey' | 'queryFn' | 'placeholderData'>,
) {
  return useQuery({
    queryKey: messagesKeys.adminList(params),
    queryFn: () => listAdminMessages(params),
    placeholderData: keepPreviousData,
    ...options,
  });
}
