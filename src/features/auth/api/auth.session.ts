import { getMe } from '@/features/auth/api/auth.api';
import type { MeResponse } from '@/features/auth/api/auth.types';
import { isApiError } from '@/shared/api/mapApiError';

/** Bootstrap current session from `/auth/me`. `null` means unauthenticated (401). */
export async function fetchAuthSession(): Promise<MeResponse | null> {
  try {
    return await getMe();
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      return null;
    }
    throw error;
  }
}
