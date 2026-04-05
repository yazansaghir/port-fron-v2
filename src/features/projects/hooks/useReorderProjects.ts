import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { reorderProjects } from '@/features/projects/api/projects.api';
import type {
  ReorderProjectsRequest,
  ReorderProjectsResponse,
} from '@/features/projects/api/projects.types';
import { projectsKeys } from '@/features/projects/query-keys';
import type { ApiError } from '@/shared/api/errors';

export function useReorderProjects(
  options?: Omit<
    UseMutationOptions<ReorderProjectsResponse, ApiError, ReorderProjectsRequest>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<ReorderProjectsResponse, ApiError, ReorderProjectsRequest>({
    mutationFn: reorderProjects,
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: projectsKeys.adminList() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
