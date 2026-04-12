import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'soft' | 'success';
type Size = 'sm' | 'md';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60',
  secondary:
    'border border-foreground/15 text-foreground/80 hover:bg-foreground/5 disabled:opacity-50',
  ghost: 'bg-foreground/8 text-foreground hover:bg-foreground/12 disabled:opacity-60',
  destructive: 'bg-status-danger text-primary-foreground hover:opacity-90 disabled:opacity-70',
  success: 'bg-status-success text-primary-foreground hover:opacity-90 disabled:opacity-60',
  soft: 'bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export function AdminButton({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center rounded-md font-medium transition',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
