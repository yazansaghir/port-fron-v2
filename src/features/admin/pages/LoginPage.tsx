import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';

import { useLogin } from '@/features/auth/hooks/useLogin';
import { getDisplayMessage, getFieldErrorsRecord } from '@/shared/api/mapApiError';
import { inputClass, labelClass } from '@/shared/styles/form';

type LoginLocationState = {
  from?: Location;
};

function getSafeReturnHref(from: Location | undefined): string {
  if (!from?.pathname) {
    return '/admin';
  }
  if (!from.pathname.startsWith('/admin')) {
    return '/admin';
  }
  if (from.pathname === '/admin/login') {
    return '/admin';
  }
  return `${from.pathname}${from.search}${from.hash}`;
}


export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useLogin({
    onSuccess: () => {
      const state = location.state as LoginLocationState | null;
      navigate(getSafeReturnHref(state?.from), { replace: true });
    },
  });

  const fieldErrors = login.error ? getFieldErrorsRecord(login.error) : {};
  const generalMessage =
    login.error && !Object.keys(fieldErrors).length ? getDisplayMessage(login.error) : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate({ email: email.trim(), password });
  }

  const submitting = login.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h1 className="text-xl font-bold text-foreground">Sign in</h1>
      <p className="mt-1 text-sm text-foreground/65">Admin access for Portfolio CMS</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {generalMessage ? (
          <p
            className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-foreground"
            role="alert"
          >
            {generalMessage}
          </p>
        ) : null}

        <div>
          <label htmlFor="admin-email" className={labelClass}>
            Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className={inputClass}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'admin-email-error' : undefined}
          />
          {fieldErrors.email ? (
            <p id="admin-email-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="admin-password" className={labelClass}>
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className={inputClass}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'admin-password-error' : undefined}
          />
          {fieldErrors.password ? (
            <p id="admin-password-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </motion.div>
  );
}
