import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import type { LoginRequest, LoginResponse } from '@/features/auth/api/auth.types';
import { login } from '@/features/auth/api/auth.api';
import { authKeys } from '@/features/auth/query-keys';

export function useLogin(
  options?: Omit<
    UseMutationOptions<LoginResponse, Error, LoginRequest>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: login,
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
      await queryClient.refetchQueries({ queryKey: authKeys.me() });
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
