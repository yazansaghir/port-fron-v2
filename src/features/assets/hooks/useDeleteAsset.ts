import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { deleteAsset } from '@/features/assets/api/assets.api';
import { projectsKeys } from '@/features/projects/query-keys';
import type { ApiError } from '@/shared/api/errors';

export type DeleteAssetPayload = {
  assetId: string;
  projectId: string;
};

export function useDeleteAsset(
  options?: Omit<UseMutationOptions<void, ApiError, DeleteAssetPayload>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<void, ApiError, DeleteAssetPayload>({
    mutationFn: ({ assetId }) => deleteAsset(assetId),
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({
        queryKey: projectsKeys.adminDetail(variables.projectId),
      });
      await queryClient.invalidateQueries({ queryKey: projectsKeys.adminList() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
