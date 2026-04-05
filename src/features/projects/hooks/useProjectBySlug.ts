import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { getPublishedProjectBySlug } from '@/features/projects/api/projects.api';
import type { PublishedProjectDetail } from '@/features/projects/api/projects.types';
import { projectsKeys } from '@/features/projects/query-keys';

export function useProjectBySlug(
  slug: string | undefined,
  options?: Omit<UseQueryOptions<PublishedProjectDetail>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: projectsKeys.publishedDetail(slug ?? ''),
    queryFn: () => getPublishedProjectBySlug(slug as string),
    enabled: Boolean(slug),
    ...options,
  });
}
