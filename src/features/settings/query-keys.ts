import type { AdminSettingsPaginationParams } from '@/shared/api/pagination';

export const settingsKeys = {
  all: ['settings'] as const,
  published: () => [...settingsKeys.all, 'published'] as const,
  admin: () => [...settingsKeys.all, 'admin'] as const,
  adminList: (params?: AdminSettingsPaginationParams) =>
    [...settingsKeys.admin(), 'list', params] as const,
};
