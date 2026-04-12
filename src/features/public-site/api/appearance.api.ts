import { apiRequest } from '@/shared/api/request';

import { parseSiteAppearancePayload, type ParsedSiteAppearance } from '@/features/public-site/api/appearance.types';

export async function getSiteAppearance(): Promise<ParsedSiteAppearance> {
  const data = await apiRequest<unknown>({
    method: 'GET',
    url: '/site/appearance',
  });
  return parseSiteAppearancePayload(data);
}
