import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { patchAssetOrder } from '@/features/assets/api/assets.api';
import type { ProjectAssetAdmin } from '@/features/assets/api/assets.types';
import { projectsKeys } from '@/features/projects/query-keys';
import type { ApiError } from '@/shared/api/errors';

export type PatchAssetOrderPayload = {
  assetId: string;
  projectId: string;
  displayOrder: number;
};

export function usePatchAssetOrder(
  options?: Omit<
    UseMutationOptions<ProjectAssetAdmin, ApiError, PatchAssetOrderPayload>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<ProjectAssetAdmin, ApiError, PatchAssetOrderPayload>({
    mutationFn: ({ assetId, displayOrder }) => patchAssetOrder(assetId, { displayOrder }),
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({
        queryKey: projectsKeys.adminDetail(variables.projectId),
      });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
