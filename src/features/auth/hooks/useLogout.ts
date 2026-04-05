import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import { logout } from '@/features/auth/api/auth.api';
import type { LogoutResponse } from '@/features/auth/api/auth.types';
import { authKeys } from '@/features/auth/query-keys';
import { analyticsKeys } from '@/features/analytics/query-keys';
import { logsKeys } from '@/features/logs/query-keys';
import { messagesKeys } from '@/features/messages/query-keys';

function clearAdminSessionCaches(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.removeQueries({ queryKey: authKeys.all });
  queryClient.removeQueries({ queryKey: messagesKeys.all });
  queryClient.removeQueries({ queryKey: logsKeys.all });
  queryClient.removeQueries({ queryKey: analyticsKeys.all });
}

export function useLogout(
  options?: Omit<UseMutationOptions<LogoutResponse, Error, void>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: () => logout(),
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      clearAdminSessionCaches(queryClient);
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
