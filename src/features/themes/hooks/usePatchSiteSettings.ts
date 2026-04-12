import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { patchSiteSettings } from '@/features/themes/api/site-settings.api';
import type { PatchSiteSettingsRequest } from '@/features/themes/api/themes.types';
import { appearanceKeys } from '@/features/public-site/query-keys';
import { themesKeys } from '@/features/themes/query-keys';
import { settingsKeys } from '@/features/settings/query-keys';
import type { ApiError } from '@/shared/api/errors';

export function usePatchSiteSettings(
  options?: Omit<UseMutationOptions<unknown, ApiError, PatchSiteSettingsRequest>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<unknown, ApiError, PatchSiteSettingsRequest>({
    mutationFn: patchSiteSettings,
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: appearanceKeys.published() });
      await queryClient.invalidateQueries({ queryKey: themesKeys.list() });
      await queryClient.invalidateQueries({ queryKey: settingsKeys.published() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
