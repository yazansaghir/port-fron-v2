export function PageLoading() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <span
        className="block h-6 w-6 rounded-full border-2 border-foreground/10 border-t-primary animate-spin"
        aria-hidden="true"
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
