import { useMe } from '@/features/auth/hooks/useMe';
import type { MeResponse } from '@/features/auth/api/auth.types';

export function useAuthSession() {
  const query = useMe();

  const user: MeResponse | undefined =
    query.data === null ? undefined : query.data ?? undefined;
  const isAuthenticated = query.data != null;

  return {
    ...query,
    user,
    isAuthenticated,
  };
}
