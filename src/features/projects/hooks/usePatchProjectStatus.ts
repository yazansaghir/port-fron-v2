import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { patchProjectStatus } from '@/features/projects/api/projects.api';
import type { AdminProject, ProjectStatus } from '@/features/projects/api/projects.types';
import { projectsKeys } from '@/features/projects/query-keys';
import type { ApiError } from '@/shared/api/errors';

type StatusPayload = { id: string; status: ProjectStatus };

export function usePatchProjectStatus(
  options?: Omit<UseMutationOptions<AdminProject, ApiError, StatusPayload>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<AdminProject, ApiError, StatusPayload>({
    mutationFn: ({ id, status }) => patchProjectStatus(id, { status }),
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: projectsKeys.adminDetail(variables.id) });
      await queryClient.invalidateQueries({ queryKey: projectsKeys.adminList() });
      await onSuccess?.(data, variables, context, mutation);
    },
  });
}
