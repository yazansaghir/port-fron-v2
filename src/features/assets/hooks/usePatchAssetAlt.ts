import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { patchAssetAlt } from '@/features/assets/api/assets.api';
import type { ProjectAssetAdmin } from '@/features/assets/api/assets.types';
import { projectsKeys } from '@/features/projects/query-keys';
import type { ApiError } from '@/shared/api/errors';

export type PatchAssetAltPayload = {
  assetId: string;
  projectId: string;
  altText: string | null;
};

export function usePatchAssetAlt(
  options?: Omit<UseMutationOptions<ProjectAssetAdmin, ApiError, PatchAssetAltPayload>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<ProjectAssetAdmin, ApiError, PatchAssetAltPayload>({
    mutationFn: ({ assetId, altText }) => patchAssetAlt(assetId, { altText }),
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({
        queryKey: projectsKeys.adminDetail(variables.projectId),
      });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
