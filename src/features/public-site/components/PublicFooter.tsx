import { Link } from 'react-router-dom';

import { usePublishedSettings } from '@/features/settings/hooks/usePublishedSettings';

function footerLinkClass() {
  return 'motion-link-soft text-sm text-foreground/55 hover:text-foreground motion-safe:active:opacity-70';
}

export function PublicFooter() {
  const { data: settings } = usePublishedSettings({ staleTime: 5 * 60 * 1000 });
  const siteName = settings?.siteName ?? 'Portfolio';
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-background pt-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-public px-6 sm:px-10 lg:px-12 pb-10 pt-12 md:pb-12 md:pt-14">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <Link
              to="/"
              className="group inline-flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-lg font-bold tracking-tight text-transparent transition-opacity duration-motion-fast ease-motion-out motion-safe:group-hover:opacity-90">
                {siteName}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/50">
              Full-stack product work—interfaces, systems, and shipping with clarity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16 md:col-span-7 md:grid-cols-2 md:justify-end">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary/90">
                Explore
              </p>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link to="/" className={footerLinkClass()}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className={footerLinkClass()}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className={footerLinkClass()}>
                    Projects
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary/90">
                Connect
              </p>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link to="/contact" className={footerLinkClass()}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.05] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-foreground/45">
            &copy; {year} {siteName}. All rights reserved.
          </p>
          <p className="text-xs text-foreground/35">Crafted for the modern web.</p>
        </div>
      </div>
    </footer>
  );
}
