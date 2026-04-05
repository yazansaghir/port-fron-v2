import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { deleteProject } from '@/features/projects/api/projects.api';
import { projectsKeys } from '@/features/projects/query-keys';
import type { ApiError } from '@/shared/api/errors';

export function useDeleteProject(
  options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<void, ApiError, string>({
    mutationFn: deleteProject,
    ...rest,
    onSuccess: async (data, id, context, mutation) => {
      queryClient.removeQueries({ queryKey: projectsKeys.adminDetail(id) });
      await queryClient.invalidateQueries({ queryKey: projectsKeys.adminList() });
      await onSuccess?.(data, id, context, mutation);
    },
  });
}
