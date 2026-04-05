import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { PageLoading } from '@/app/router/PageLoading';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { getDisplayMessage } from '@/shared/api/mapApiError';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isPending, isError, error, refetch, data } = useAuthSession();

  if (isPending) {
    return <PageLoading />;
  }

  if (isError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-center text-sm text-foreground/80">{getDisplayMessage(error)}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Try again
        </button>
      </div>
    );
  }

  if (data === null) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
