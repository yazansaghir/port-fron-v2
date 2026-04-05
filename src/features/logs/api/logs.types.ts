import type { PaginatedResponse } from '@/shared/api/types';

export type ActivityLogUser = {
  id: string;
  email: string;
};

/** Structured activity log row; nullable fields support legacy rows. */
export type ActivityLogItem = {
  id: string;
  /** Legacy / machine-oriented description; use as fallback when `message` is absent. */
  action: string;
  /** Primary human-readable summary when present (preferred over `action`). */
  message: string | null;
  actionType: string | null;
  entityType: string | null;
  entityId: string | null;
  entityLabel: string | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
  user: ActivityLogUser;
};

export type AdminLogsPage = PaginatedResponse<ActivityLogItem>;

export type AdminLogsQueryParams = {
  page?: number;
  limit?: number;
  userId?: string;
  actionType?: string;
  entityType?: string;
};
