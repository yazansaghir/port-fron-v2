import { useEffect } from 'react';

import { usePublishedSettings } from '@/features/settings/hooks/usePublishedSettings';
import {
  applySiteSettingsToDocument,
  resetThemeToDefaults,
} from '@/features/public-site/lib/published-theme';

export function useSyncPublishedTheme(): void {
  const { data: settings, isSuccess } = usePublishedSettings({
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isSuccess && settings) {
      applySiteSettingsToDocument(settings);
    }
  }, [isSuccess, settings]);

  useEffect(() => {
    return () => {
      resetThemeToDefaults();
    };
  }, []);
}
