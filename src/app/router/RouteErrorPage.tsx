import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export function RouteErrorPage() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  const heading = is404 ? 'Page not found' : 'Something went wrong';
  const body = is404
    ? "The page you're looking for doesn't exist."
    : 'An unexpected error occurred. Please try again or go back home.';

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-5xl font-bold text-primary" aria-hidden="true">
        {is404 ? '404' : 'Oops'}
      </p>
      <h1 className="mt-4 text-xl font-semibold text-foreground">{heading}</h1>
      <p className="mt-2 max-w-sm text-sm text-foreground/60">{body}</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
