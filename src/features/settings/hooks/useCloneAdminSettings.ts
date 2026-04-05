import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { cloneAdminSettings } from '@/features/settings/api/settings.api';
import type { CloneSettingsRequest, SiteSettings } from '@/features/settings/api/settings.types';
import { settingsKeys } from '@/features/settings/query-keys';
import type { ApiError } from '@/shared/api/errors';

export function useCloneAdminSettings(
  options?: Omit<UseMutationOptions<SiteSettings, ApiError, CloneSettingsRequest>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<SiteSettings, ApiError, CloneSettingsRequest>({
    mutationFn: cloneAdminSettings,
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: settingsKeys.admin() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
