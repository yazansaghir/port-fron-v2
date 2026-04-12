export const settingsKeys = {
  all: ['settings'] as const,
  published: () => [...settingsKeys.all, 'published'] as const,
};
