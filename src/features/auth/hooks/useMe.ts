import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { fetchAuthSession } from '@/features/auth/api/auth.session';
import type { AuthSessionUser } from '@/features/auth/api/auth.types';
import { authKeys } from '@/features/auth/query-keys';
import { isApiError } from '@/shared/api/mapApiError';

function authMeRetry(failureCount: number, error: Error): boolean {
  if (isApiError(error) && error.status >= 400 && error.status < 500) {
    return false;
  }
  return failureCount < 1;
}

export function useMe(
  options?: Omit<UseQueryOptions<AuthSessionUser>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchAuthSession,
    staleTime: Infinity,
    refetchOnWindowFocus: true,
    retry: authMeRetry,
    ...options,
  });
}
