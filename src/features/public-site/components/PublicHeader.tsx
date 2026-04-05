import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';

import { usePublishedSettings } from '@/features/settings/hooks/usePublishedSettings';
import { PublicButton } from '@/features/public-site/components/PublicButton';

const MOBILE_NAV_ID = 'public-mobile-nav';

function desktopNavClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-full px-3.5 py-2 text-sm font-medium transition-[color,background-color,box-shadow,transform] duration-motion-fast ease-motion-out motion-safe:active:scale-[0.98]',
    isActive
      ? 'bg-foreground/[0.09] text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]'
      : 'text-foreground/55 hover:bg-foreground/[0.05] hover:text-foreground/90 motion-safe:hover:-translate-y-px',
  ].join(' ');
}

function sheetNavClass({ isActive }: { isActive: boolean }) {
  return [
    'block rounded-xl px-4 py-3.5 text-base font-medium transition-[color,background-color] duration-motion-fast ease-motion-out',
    isActive
      ? 'bg-foreground/[0.1] text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
      : 'text-foreground/65 hover:bg-foreground/[0.06] hover:text-foreground',
  ].join(' ');
}

export function PublicHeader() {
  const { pathname } = useLocation();
  const { data: settings } = usePublishedSettings({ staleTime: 5 * 60 * 1000 });
  const siteName = settings?.siteName ?? 'Portfolio';
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    function onViewportChange() {
      if (mq.matches) setMenuOpen(false);
    }
    mq.addEventListener('change', onViewportChange);
    return () => mq.removeEventListener('change', onViewportChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  const mobileOverlay =
    menuOpen &&
    createPortal(
      <div
        className="fixed inset-0 z-50 flex sm:hidden"
        role="presentation"
      >
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-200 ease-out"
          aria-hidden="true"
          onClick={closeMenu}
        />
        <div
          id={MOBILE_NAV_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-white/[0.08] bg-background/95 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-200 ease-out translate-x-0"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Menu</p>
            <button
              type="button"
              onClick={closeMenu}
              className="rounded-lg p-2 text-foreground/60 transition-[color,background-color] duration-motion-fast hover:bg-foreground/[0.06] hover:text-foreground"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-5" aria-label="Mobile pages">
            <NavLink to="/" end className={sheetNavClass} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/about" className={sheetNavClass} onClick={closeMenu}>
              About
            </NavLink>
            <NavLink to="/projects" className={sheetNavClass} onClick={closeMenu}>
              Projects
            </NavLink>
            <NavLink to="/contact" className={sheetNavClass} onClick={closeMenu}>
              Contact
            </NavLink>
          </nav>
          <div className="border-t border-white/[0.06] p-5" onClick={closeMenu}>
            <PublicButton pill variant="primary" to="/contact" className="w-full !py-3.5 !text-sm">
              Let&apos;s talk
            </PublicButton>
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <header className="sticky top-0 z-30 bg-background/75 backdrop-blur-xl shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex max-w-public items-center justify-between gap-6 px-6 sm:px-10 lg:px-12 py-4 md:py-5">
        <Link
          to="/"
          className="group flex min-w-0 flex-col gap-0.5 transition-[opacity,transform] duration-motion-fast ease-motion-out motion-safe:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={closeMenu}
        >
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-base font-bold tracking-tight text-transparent transition-opacity duration-motion-fast ease-motion-out group-hover:opacity-85 md:text-lg">
            {siteName}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Portfolio
          </span>
        </Link>

        <nav
          aria-label="Site navigation"
          className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-foreground/[0.03] px-1.5 py-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:flex"
        >
          <NavLink to="/" end className={desktopNavClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={desktopNavClass}>
            About
          </NavLink>
          <NavLink to="/projects" className={desktopNavClass}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={desktopNavClass}>
            Contact
          </NavLink>
        </nav>

        <PublicButton
          pill
          variant="primary"
          to="/contact"
          className="hidden !px-6 !py-2.5 !text-sm sm:inline-flex"
        >
          Let&apos;s talk
        </PublicButton>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="rounded-lg p-2 text-foreground/70 transition-[color,background-color] duration-motion-fast ease-motion-out hover:bg-foreground/[0.06] hover:text-foreground sm:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? MOBILE_NAV_ID : undefined}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {mobileOverlay}
    </header>
  );
}
