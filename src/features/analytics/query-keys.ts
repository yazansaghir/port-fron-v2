export const analyticsKeys = {
  all: ['analytics'] as const,
  adminStats: () => [...analyticsKeys.all, 'admin', 'stats'] as const,
};
