import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { listPublishedProjects } from '@/features/projects/api/projects.api';
import type { PublishedProjectsPage } from '@/features/projects/api/projects.types';
import { projectsKeys } from '@/features/projects/query-keys';
import type { ProjectsPaginationParams } from '@/shared/api/pagination';

export function usePublishedProjects(
  params?: ProjectsPaginationParams,
  options?: Omit<UseQueryOptions<PublishedProjectsPage>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: projectsKeys.publishedList(params),
    queryFn: () => listPublishedProjects(params),
    ...options,
  });
}
