import type { ReactNode } from 'react';

type GradientTextProps = {
  children: ReactNode;
  className?: string;
};

/** Reference: 135deg brand gradient clipped to text (see globals .text-gradient). */
export function GradientText({ children, className = '' }: GradientTextProps) {
  return <span className={`text-gradient ${className}`}>{children}</span>;
}
