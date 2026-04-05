import { Outlet, useLocation } from 'react-router-dom';

import { useSyncPublishedTheme } from '@/features/public-site/hooks/useSyncPublishedTheme';
import { PublicHeader } from '@/features/public-site/components/PublicHeader';
import { PublicFooter } from '@/features/public-site/components/PublicFooter';

export function PublicLayout() {
  useSyncPublishedTheme();
  const { pathname } = useLocation();
  /** Marketing pages render full-width atmosphere inside the page; content max-width is applied there. */
  const isFullWidthPublicPage =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/projects' ||
    pathname.startsWith('/projects/');

  return (
    <div className="flex min-h-dvh min-w-0 flex-col bg-background text-foreground">
      <PublicHeader />
      <main className="min-w-0 flex-1 w-full pt-10 sm:pt-14 md:pt-16">
        {isFullWidthPublicPage ? (
          <Outlet />
        ) : (
          <div className="mx-auto w-full max-w-public px-6 sm:px-10 lg:px-12">
            <Outlet />
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
