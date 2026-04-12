import { useLocation } from 'react-router-dom';

import { ADMIN_NAV_ITEMS } from '@/features/admin/config/adminNav';

type Props = {
  userEmail: string | undefined;
  onLogout: () => void;
  logoutPending: boolean;
  onOpenMenu: () => void;
};

function resolvePageTitle(pathname: string): string {
  const exact = ADMIN_NAV_ITEMS.find((item) => item.end && item.to === pathname);
  if (exact) return exact.label;
  const match = ADMIN_NAV_ITEMS.filter((item) => !item.end).find((item) =>
    pathname.startsWith(item.to),
  );
  return match?.label ?? 'Admin';
}

export function AdminHeader({ userEmail, onLogout, logoutPending, onOpenMenu }: Props) {
  const { pathname } = useLocation();
  const title = resolvePageTitle(pathname);

  return (
    <header className="shrink-0 border-b border-border/60 bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-6 lg:h-16 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="rounded-lg p-2 text-muted hover:bg-foreground/5 hover:text-foreground md:hidden"
            aria-label="Open navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Breadcrumb: "Admin / <page title>" */}
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted">
            <span className="hidden font-medium md:inline">Admin</span>
            <span className="hidden text-muted/50 md:inline">/</span>
            <h1 className="truncate text-xl font-semibold text-foreground">{title}</h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {userEmail && (
            <span
              className="hidden max-w-[200px] truncate text-sm text-muted sm:inline"
              title={userEmail}
            >
              {userEmail}
            </span>
          )}
          <button
            type="button"
            onClick={onLogout}
            disabled={logoutPending}
            className="rounded-lg border border-border/60 px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {logoutPending ? 'Signing out…' : 'Log out'}
          </button>
        </div>
      </div>
    </header>
  );
}
