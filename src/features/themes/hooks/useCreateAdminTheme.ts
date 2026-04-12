import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { createAdminTheme } from '@/features/themes/api/themes.api';
import type { AdminThemeDetail, CreateThemeRequest } from '@/features/themes/api/themes.types';
import { themesKeys } from '@/features/themes/query-keys';
import type { ApiError } from '@/shared/api/errors';

export function useCreateAdminTheme(
  options?: Omit<UseMutationOptions<AdminThemeDetail, ApiError, CreateThemeRequest>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<AdminThemeDetail, ApiError, CreateThemeRequest>({
    mutationFn: createAdminTheme,
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: themesKeys.list() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
