import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { duplicateAdminTheme } from '@/features/themes/api/themes.api';
import type { AdminThemeDetail } from '@/features/themes/api/themes.types';
import { themesKeys } from '@/features/themes/query-keys';
import type { ApiError } from '@/shared/api/errors';

type Payload = { themeId: string; name?: string };

export function useDuplicateAdminTheme(
  options?: Omit<UseMutationOptions<AdminThemeDetail, ApiError, Payload>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<AdminThemeDetail, ApiError, Payload>({
    mutationFn: ({ themeId, name }) => duplicateAdminTheme(themeId, name ? { name } : undefined),
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: themesKeys.list() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
