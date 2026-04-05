import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { listAdminProjects } from '@/features/projects/api/projects.api';
import { projectsKeys } from '@/features/projects/query-keys';
import type { AdminHeavyPaginationParams } from '@/shared/api/pagination';

export function useAdminProjects(params?: AdminHeavyPaginationParams) {
  return useQuery({
    queryKey: projectsKeys.adminList(params),
    queryFn: () => listAdminProjects(params),
    placeholderData: keepPreviousData,
  });
}
