import type { ReactNode } from 'react';

type Props = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function AdminSection({ title, description, children, className = '' }: Props) {
  return (
    <section className={['space-y-6', className].join(' ')}>
      {(title || description) && (
        <div>
          {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
          {description && (
            <p className="mt-1 text-sm text-white/60">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
