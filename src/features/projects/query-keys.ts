import type { AdminHeavyPaginationParams, ProjectsPaginationParams } from '@/shared/api/pagination';

export const projectsKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsKeys.all, 'list'] as const,
  publishedList: (params?: ProjectsPaginationParams) =>
    [...projectsKeys.lists(), 'published', params ?? {}] as const,
  adminList: (params?: AdminHeavyPaginationParams) =>
    [...projectsKeys.lists(), 'admin', params ?? {}] as const,
  details: () => [...projectsKeys.all, 'detail'] as const,
  publishedDetail: (slug: string) => [...projectsKeys.details(), 'published', slug] as const,
  adminDetail: (id: string) => [...projectsKeys.details(), 'admin', id] as const,
};
