import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { updateProject } from '@/features/projects/api/projects.api';
import type { AdminProject, UpdateProjectRequest } from '@/features/projects/api/projects.types';
import { projectsKeys } from '@/features/projects/query-keys';
import type { ApiError } from '@/shared/api/errors';

type UpdatePayload = { id: string; body: UpdateProjectRequest };

export function useUpdateProject(
  options?: Omit<UseMutationOptions<AdminProject, ApiError, UpdatePayload>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<AdminProject, ApiError, UpdatePayload>({
    mutationFn: ({ id, body }) => updateProject(id, body),
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: projectsKeys.adminDetail(variables.id) });
      await queryClient.invalidateQueries({ queryKey: projectsKeys.adminList() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
