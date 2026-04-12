import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { PageLoading } from '@/app/router/PageLoading';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { getDisplayMessage } from '@/shared/api/mapApiError';

const DEFAULT_AUTHENTICATED_REDIRECT = '/admin';

type GuestRouteProps = {
  children: ReactNode;
};

export function GuestRoute({ children }: GuestRouteProps) {
  const { isPending, isError, error, refetch, isAuthenticated } = useAuthSession();

  if (isPending) {
    return <PageLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to={DEFAULT_AUTHENTICATED_REDIRECT} replace />;
  }

  return (
    <>
      {isError ? (
        <div className="mb-4 rounded-lg border border-status-warning/30 bg-status-warning/10 px-3 py-2 text-sm text-foreground">
          <p>{getDisplayMessage(error, 'Could not verify session.')}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            Check session again
          </button>
        </div>
      ) : null}
      {children}
    </>
  );
}
