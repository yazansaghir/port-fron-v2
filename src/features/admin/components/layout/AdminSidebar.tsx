import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { ADMIN_NAV_ITEMS } from '@/features/admin/config/adminNav';

type Props = {
  mobileOpen: boolean;
  onClose: () => void;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium',
    isActive
      ? 'bg-foreground/10 text-foreground'
      : 'text-muted hover:bg-foreground/5 hover:text-foreground/90',
  ].join(' ');

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <nav className="flex flex-col gap-2" aria-label="Admin navigation">
      {ADMIN_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={navLinkClass}
          onClick={onLinkClick}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function BrandBlock() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Admin</p>
      <div className="mt-3 h-px w-full bg-border/60" aria-hidden />
    </div>
  );
}

export function AdminSidebar({ mobileOpen, onClose }: Props) {
  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, onClose]);

  return (
    <>
      <aside
        className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-border/60 bg-surface md:flex"
        aria-label="Admin navigation"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-6">
          <BrandBlock />
          <NavLinks />
        </div>
      </aside>

      <div
        className={[
          'fixed inset-0 z-20 bg-overlay-scrim transition-opacity duration-200 ease-out md:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex min-h-screen w-64 flex-col border-r border-border/60 bg-surface transition-transform duration-200 ease-out md:hidden',
          mobileOpen ? 'pointer-events-auto translate-x-0' : 'pointer-events-none -translate-x-full',
        ].join(' ')}
        aria-label="Admin navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
      >
        <div className="flex min-h-0 flex-1 flex-col px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Admin</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-muted hover:bg-foreground/5 hover:text-foreground"
              aria-label="Close navigation"
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
          <div className="mt-3 h-px w-full shrink-0 bg-border/60" aria-hidden />
          <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-y-auto">
            <NavLinks onLinkClick={onClose} />
          </div>
        </div>
      </aside>
    </>
  );
}
