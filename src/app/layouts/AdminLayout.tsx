import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { AdminHeader } from '@/features/admin/components/layout/AdminHeader';
import { AdminSidebar } from '@/features/admin/components/layout/AdminSidebar';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    function onViewportChange() {
      if (mq.matches) setMobileNavOpen(false);
    }
    mq.addEventListener('change', onViewportChange);
    return () => mq.removeEventListener('change', onViewportChange);
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  const logout = useLogout({
    onSuccess: () => {
      navigate('/admin/login', { replace: true });
    },
  });

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <div className="relative flex min-w-0 flex-1 flex-col bg-background md:pl-64">
        <AdminHeader
          userEmail={user?.email}
          onLogout={() => logout.mutate()}
          logoutPending={logout.isPending}
          onOpenMenu={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
