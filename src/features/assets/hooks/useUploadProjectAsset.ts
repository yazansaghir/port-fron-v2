import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { uploadProjectAsset } from '@/features/assets/api/assets.api';
import {
  buildProjectAssetFormData,
  type ProjectAssetAdmin,
} from '@/features/assets/api/assets.types';
import type { ProjectAssetType } from '@/features/projects/api/projects.types';
import { projectsKeys } from '@/features/projects/query-keys';
import type { ApiError } from '@/shared/api/errors';

export type UploadProjectAssetPayload = {
  projectId: string;
  file: File;
  assetType: ProjectAssetType;
  altText?: string | null;
  displayOrder?: number;
};

export function useUploadProjectAsset(
  options?: Omit<
    UseMutationOptions<ProjectAssetAdmin, ApiError, UploadProjectAssetPayload>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<ProjectAssetAdmin, ApiError, UploadProjectAssetPayload>({
    mutationFn: ({ projectId, file, assetType, altText, displayOrder }) => {
      const formData = buildProjectAssetFormData(file, assetType, { altText, displayOrder });
      return uploadProjectAsset(projectId, formData);
    },
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
