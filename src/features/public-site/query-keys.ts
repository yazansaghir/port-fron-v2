export const appearanceKeys = {
  all: ['siteAppearance'] as const,
  published: () => [...appearanceKeys.all, 'published'] as const,
};
