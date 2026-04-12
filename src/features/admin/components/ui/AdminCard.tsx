import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function AdminCard({ children, className = '' }: Props) {
  return (
    <div
      className={[
        'rounded-2xl border border-border/60 bg-surface/35',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
