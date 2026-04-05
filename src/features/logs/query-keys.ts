import type { AdminLogsQueryParams } from '@/features/logs/api/logs.types';

export const logsKeys = {
  all: ['logs'] as const,
  admin: () => [...logsKeys.all, 'admin'] as const,
  list: (params?: AdminLogsQueryParams) => [...logsKeys.admin(), 'list', params ?? {}] as const,
};
