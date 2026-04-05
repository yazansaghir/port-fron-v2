import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type PublicButtonVariant = 'primary' | 'secondary' | 'ghost';

export type PublicButtonProps = {
  variant?: PublicButtonVariant;
  /** Reference-style full pill CTAs (gradient primary / glass secondary). */
  pill?: boolean;
  children: ReactNode;
  className?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
};

const variantClasses: Record<PublicButtonVariant, string> = {
  primary:
    'motion-hover-lift bg-primary text-primary-foreground shadow-[0_0_40px_-8px] shadow-primary/50 ring-1 ring-primary/30 hover:opacity-90',
  secondary:
    'motion-hover-lift border border-foreground/20 bg-foreground/[0.05] text-foreground hover:border-primary/40 hover:bg-foreground/[0.09]',
  ghost:
    'text-foreground/70 transition-[color,opacity,transform] duration-motion-fast ease-motion-out hover:text-foreground motion-safe:active:scale-[0.98]',
};

const base =
  'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-[opacity,transform,box-shadow,border-color,background-color,color] duration-motion ease-motion-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background select-none';

const pillBase = 'rounded-full px-8 py-3';
const cardRadius = 'rounded-2xl';

const pillPrimaryStyle: CSSProperties = {
  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
};

const pillGlassStyle: CSSProperties = {
  color: 'var(--color-text)',
  borderColor: 'var(--color-border)',
};

export function PublicButton({
  variant = 'primary',
  pill = false,
  children,
  className = '',
  to,
  href,
  onClick,
}: PublicButtonProps) {
  let classes = `${base} ${className}`;
  let style: CSSProperties | undefined;

  if (pill) {
    classes = `${base} ${pillBase} ${className}`;
    if (variant === 'primary') {
      classes = `${classes} motion-hover-lift text-white glow-primary hover:opacity-95`;
      style = pillPrimaryStyle;
    } else if (variant === 'secondary') {
      classes = `${classes} motion-hover-lift glass border text-center`;
      style = pillGlassStyle;
    } else {
      classes = `${classes} ${variantClasses[variant]}`;
    }
  } else {
    classes = `${base} ${cardRadius} ${variantClasses[variant]} ${className}`;
  }

  if (to) {
    return (
      <Link to={to} className={classes} style={style}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} style={style}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} style={style}>
      {children}
    </button>
  );
}
