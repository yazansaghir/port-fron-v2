import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-foreground/10 bg-background p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
