import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { PageLoading } from '@/app/router/PageLoading';
import { RouteErrorPage } from '@/app/router/RouteErrorPage';
import { GuestRoute } from '@/features/auth/components/GuestRoute';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

const HomePage = lazy(() => import('@/features/public-site/pages/HomePage'));
const AboutPage = lazy(() => import('@/features/public-site/pages/AboutPage'));
const ProjectsPage = lazy(() => import('@/features/public-site/pages/ProjectsPage'));
const ProjectDetailPage = lazy(
  () => import('@/features/public-site/pages/ProjectDetailPage'),
);
const ContactPage = lazy(
  () => import('@/features/public-site/pages/ContactPage'),
);
const LoginPage = lazy(() => import('@/features/admin/pages/LoginPage'));
const DashboardPage = lazy(
  () => import('@/features/admin/pages/DashboardPage'),
);
const ProjectsListPage = lazy(() => import('@/features/admin/pages/ProjectsListPage'));
const ProjectCreatePage = lazy(() => import('@/features/admin/pages/ProjectCreatePage'));
const ProjectEditPage = lazy(() => import('@/features/admin/pages/ProjectEditPage'));
const MessagesPage = lazy(() => import('@/features/admin/pages/MessagesPage'));
const SettingsPage = lazy(() => import('@/features/admin/pages/SettingsPage'));
const LogsPage = lazy(() => import('@/features/admin/pages/LogsPage'));

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<PageLoading />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'about', element: withSuspense(<AboutPage />) },
      { path: 'projects', element: withSuspense(<ProjectsPage />) },
      {
        path: 'projects/:slug',
        element: withSuspense(<ProjectDetailPage />),
      },
      { path: 'contact', element: withSuspense(<ContactPage />) },
    ],
  },
  {
    path: '/admin/login',
    element: <AuthLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <GuestRoute>{withSuspense(<LoginPage />)}</GuestRoute>,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: 'projects', element: withSuspense(<ProjectsListPage />) },
      { path: 'projects/new', element: withSuspense(<ProjectCreatePage />) },
      { path: 'projects/:id/edit', element: withSuspense(<ProjectEditPage />) },
      { path: 'messages', element: withSuspense(<MessagesPage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
      { path: 'logs', element: withSuspense(<LogsPage />) },
    ],
  },
]);
