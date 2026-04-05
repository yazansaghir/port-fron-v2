export type ProjectAnalyticsBreakdown = {
  project: {
    id: string;
    title: string;
    slug: string;
  };
  totalViews: number;
  avgTimeSpent: number | null;
  lastVisitedAt: string | null;
};

export type AdminAnalyticsStats = {
  totalViews: number;
  overallAvgTimeSpent: number | null;
  projectBreakdown: ProjectAnalyticsBreakdown[];
};

export type TrackProjectVisitRequest = {
  incrementView?: boolean;
  dwellMs?: number;
};

export type ProjectAnalyticsRow = {
  id: string;
  projectId: string;
  totalViews: number;
  avgTimeSpent: number | null;
  lastVisitedAt: string | null;
};
