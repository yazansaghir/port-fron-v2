type SkeletonProps = {
  className?: string;
};

export function AdminSkeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={['animate-pulse rounded bg-foreground/10', className].join(' ')}
      aria-hidden="true"
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface/40 p-8">
      <div
        className="pointer-events-none absolute right-6 top-6 h-2 w-2 rounded-full bg-foreground/15"
        aria-hidden
      />
      <div className="flex flex-col items-start gap-6">
        <AdminSkeleton className="h-4 w-28" />
        <AdminSkeleton className="h-10 w-36 max-w-full" />
        <AdminSkeleton className="h-4 w-44 max-w-full" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-5">
          <AdminSkeleton className="h-3.5 w-full max-w-[140px]" />
        </td>
      ))}
    </tr>
  );
}
