import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { updateAdminThemeDraft } from '@/features/themes/api/themes.api';
import type { AdminThemeDetail, UpdateThemeDraftRequest } from '@/features/themes/api/themes.types';
import { appearanceKeys } from '@/features/public-site/query-keys';
import { themesKeys } from '@/features/themes/query-keys';
import type { ApiError } from '@/shared/api/errors';

type Payload = { themeId: string; body: UpdateThemeDraftRequest };

export function useUpdateAdminThemeDraft(
  options?: Omit<UseMutationOptions<AdminThemeDetail, ApiError, Payload>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<AdminThemeDetail, ApiError, Payload>({
    mutationFn: ({ themeId, body }) => updateAdminThemeDraft(themeId, body),
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: themesKeys.list() });
      await queryClient.invalidateQueries({ queryKey: themesKeys.detail(variables.themeId) });
      await queryClient.invalidateQueries({ queryKey: appearanceKeys.published() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
