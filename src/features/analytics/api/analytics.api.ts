import type {
  AdminAnalyticsStats,
  ProjectAnalyticsRow,
  TrackProjectVisitRequest,
} from '@/features/analytics/api/analytics.types';
import { apiRequest } from '@/shared/api/request';

function analyticsTrackUrl(projectId: string): string {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  const path = `/analytics/track/${projectId}`;
  return base ? `${base}${path}` : path;
}

export async function getAdminAnalyticsStats(): Promise<AdminAnalyticsStats> {
  return apiRequest<AdminAnalyticsStats>({
    method: 'GET',
    url: '/admin/analytics/stats',
  });
}

export async function trackProjectVisit(
  projectId: string,
  body: TrackProjectVisitRequest,
): Promise<ProjectAnalyticsRow> {
  return apiRequest<ProjectAnalyticsRow>({
    method: 'POST',
    url: `/analytics/track/${projectId}`,
    data: body,
  });
}

/** Best-effort POST for tab close / refresh; does not parse the response envelope. */
export function trackProjectVisitKeepalive(
  projectId: string,
  body: TrackProjectVisitRequest,
): void {
  void fetch(analyticsTrackUrl(projectId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
    keepalive: true,
  }).catch(() => {});
}
