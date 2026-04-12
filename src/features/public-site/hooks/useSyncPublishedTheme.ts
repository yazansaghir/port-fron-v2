import { useEffect } from 'react';

import { useSiteAppearance } from '@/features/public-site/hooks/useSiteAppearance';
import {
  appearanceTokensToNormalized,
  applyCssVarsToElement,
  resetManagedThemeVars,
  semanticTokensToCssVars,
} from '@/features/public-site/lib/theme-runtime';

export function useSyncPublishedTheme(): void {
  const { data, isSuccess, isError } = useSiteAppearance({
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isSuccess && data) {
      const normalized = appearanceTokensToNormalized(data.tokens, data.schemaVersion);
      applyCssVarsToElement(root, semanticTokensToCssVars(normalized));
    } else if (isError) {
      const normalized = appearanceTokensToNormalized(null, 0);
      applyCssVarsToElement(root, semanticTokensToCssVars(normalized));
    }
  }, [isSuccess, isError, data]);

  useEffect(() => {
    return () => {
      resetManagedThemeVars(document.documentElement);
    };
  }, []);
}
