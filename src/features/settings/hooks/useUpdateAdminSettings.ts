import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { updateAdminSettings } from '@/features/settings/api/settings.api';
import type { SiteSettings, UpdateSettingsRequest } from '@/features/settings/api/settings.types';
import { settingsKeys } from '@/features/settings/query-keys';
import type { ApiError } from '@/shared/api/errors';

type UpdatePayload = { id: string; body: UpdateSettingsRequest };

export function useUpdateAdminSettings(
  options?: Omit<UseMutationOptions<SiteSettings, ApiError, UpdatePayload>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<SiteSettings, ApiError, UpdatePayload>({
    mutationFn: ({ id, body }) => updateAdminSettings(id, body),
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: settingsKeys.admin() });
      await queryClient.invalidateQueries({ queryKey: settingsKeys.published() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
