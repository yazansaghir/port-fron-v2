import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function AdminCard({ children, className = '' }: Props) {
  return (
    <div
      className={[
        'rounded-2xl border border-white/10 bg-white/[0.02]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
