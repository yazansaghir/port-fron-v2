import type { PaginatedResponse } from '@/shared/api/types';

/** Public projects list (max 50 per API) */
export type ProjectsPaginationParams = {
  page?: number;
  limit?: number;
};

/** Admin messages & logs (max 100 per API) */
export type AdminHeavyPaginationParams = {
  page?: number;
  limit?: number;
};

/** Admin settings list (max 50 per API) */
export type AdminSettingsPaginationParams = {
  page?: number;
  limit?: number;
};

export const PROJECTS_MAX_LIMIT = 50;
export const ADMIN_MESSAGES_LOGS_MAX_LIMIT = 100;
export const ADMIN_SETTINGS_MAX_LIMIT = 50;

export function getNextPageParamFromPages<T>(last: PaginatedResponse<T>): number | undefined {
  if (last.page < last.totalPages) {
    return last.page + 1;
  }
  return undefined;
}
