import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createProject } from '@/features/projects/api/projects.api';
import type { AdminProject, CreateProjectRequest } from '@/features/projects/api/projects.types';
import { projectsKeys } from '@/features/projects/query-keys';
import type { ApiError } from '@/shared/api/errors';

export function useCreateProject(
  options?: Omit<UseMutationOptions<AdminProject, ApiError, CreateProjectRequest>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<AdminProject, ApiError, CreateProjectRequest>({
    mutationFn: createProject,
    ...rest,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: projectsKeys.adminList() });
      await onSuccess?.(data, variables, context, mutation);
      navigate(`/admin/projects/${data.id}/edit`);
    },
  });
}
