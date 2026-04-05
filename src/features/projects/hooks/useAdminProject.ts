import { useQuery } from '@tanstack/react-query';

import { getAdminProjectById } from '@/features/projects/api/projects.api';
import { projectsKeys } from '@/features/projects/query-keys';

export function useAdminProject(id: string) {
  return useQuery({
    queryKey: projectsKeys.adminDetail(id),
    queryFn: () => getAdminProjectById(id),
    enabled: Boolean(id),
  });
}
