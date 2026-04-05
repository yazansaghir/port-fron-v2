import type { AdminLogsPage, AdminLogsQueryParams } from '@/features/logs/api/logs.types';
import { apiRequest } from '@/shared/api/request';

export async function listAdminLogs(params?: AdminLogsQueryParams): Promise<AdminLogsPage> {
  return apiRequest<AdminLogsPage>({
    method: 'GET',
    url: '/admin/logs',
    params,
  });
}
