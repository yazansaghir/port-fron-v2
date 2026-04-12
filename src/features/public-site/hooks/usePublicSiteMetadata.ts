import { useSiteAppearance } from '@/features/public-site/hooks/useSiteAppearance';
import { usePublishedSettings } from '@/features/settings/hooks/usePublishedSettings';

type Options = {
  staleTime?: number;
};

/**
 * Prefer `/site/appearance` for site name and font; fall back to `GET /settings` when
 * appearance omits metadata or the request fails.
 */
export function usePublicSiteMetadata(options?: Options) {
  const staleTime = options?.staleTime ?? 5 * 60 * 1000;
  const appearance = useSiteAppearance({ staleTime });

  const needFallback =
    appearance.isError ||
    (appearance.isSuccess &&
      (!appearance.data.siteName || appearance.data.siteName.trim().length === 0));

  const publishedFallback = usePublishedSettings({
    staleTime,
    enabled: needFallback,
  });

  const isLoading = appearance.isPending || (needFallback && publishedFallback.isPending);

  const siteName =
    appearance.data?.siteName?.trim() ||
    publishedFallback.data?.siteName?.trim() ||
    undefined;

  const activeFont =
    appearance.data?.activeFont?.trim() ||
    publishedFallback.data?.activeFont?.trim() ||
    undefined;

  return {
    siteName,
    activeFont,
    isLoading,
    /** True when both appearance and compat settings fail (rare). */
    isError: appearance.isError && publishedFallback.isError,
  };
}
