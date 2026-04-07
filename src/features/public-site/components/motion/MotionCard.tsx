import type { CSSProperties, ReactNode } from 'react';

type MotionCardProps = {
  as?: keyof HTMLElementTagNameMap;
  /** Lift + shadow on hover; set false for static surfaces. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Consistent card motion: optional hover lift + shared transition timing.
 */
export function MotionCard({
  as: Tag = 'article',
  interactive = true,
  className = '',
  style,
  children,
}: MotionCardProps) {
  const lift = interactive ? 'motion-hover-lift' : '';
  return (
    <Tag className={`${lift} motion-card-surface ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
