export const themesKeys = {
  all: ['themes'] as const,
  list: () => [...themesKeys.all, 'list'] as const,
  detail: (themeId: string) => [...themesKeys.all, 'detail', themeId] as const,
  revisions: (themeId: string) => [...themesKeys.all, 'revisions', themeId] as const,
};
