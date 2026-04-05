import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { publishAdminSettings } from '@/features/settings/api/settings.api';
import type { SiteSettings } from '@/features/settings/api/settings.types';
import { settingsKeys } from '@/features/settings/query-keys';
import type { ApiError } from '@/shared/api/errors';

export function usePublishAdminSettings(
  options?: Omit<UseMutationOptions<SiteSettings, ApiError, string>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<SiteSettings, ApiError, string>({
    mutationFn: publishAdminSettings,
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: settingsKeys.admin() });
      await queryClient.invalidateQueries({ queryKey: settingsKeys.published() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
