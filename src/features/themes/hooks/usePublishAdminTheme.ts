import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { publishAdminTheme } from '@/features/themes/api/themes.api';
import type { AdminThemeDetail } from '@/features/themes/api/themes.types';
import { appearanceKeys } from '@/features/public-site/query-keys';
import { themesKeys } from '@/features/themes/query-keys';
import type { ApiError } from '@/shared/api/errors';

export function usePublishAdminTheme(
  options?: Omit<UseMutationOptions<AdminThemeDetail, ApiError, string>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<AdminThemeDetail, ApiError, string>({
    mutationFn: publishAdminTheme,
    ...rest,
    onSuccess: async (data, themeId, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: themesKeys.all });
      await queryClient.invalidateQueries({ queryKey: appearanceKeys.published() });
      await queryClient.invalidateQueries({ queryKey: ['settings'] });
      await onSuccess?.(data, themeId, context, mutation);
    },
  });
}
