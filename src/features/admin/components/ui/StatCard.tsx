type Props = {
  title: string;
  value: string | number;
  footnote?: string;
};

export function StatCard({ title, value, footnote }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface/40 p-8">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.1] via-transparent to-secondary/[0.05]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-6 top-6 h-2 w-2 rounded-full bg-primary/80 shadow-[0_0_14px_color-mix(in_srgb,var(--color-primary)_40%,transparent)]"
        aria-hidden
      />

      <div className="relative flex flex-col items-start gap-6 text-left">
        <p className="text-sm font-medium text-muted">{title}</p>
        <p className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">{value}</p>
        {footnote ? <p className="text-sm leading-snug text-muted">{footnote}</p> : null}
      </div>
    </div>
  );
}
