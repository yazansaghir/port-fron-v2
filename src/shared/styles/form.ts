/**
 * Canonical Tailwind class strings for form controls, shared across admin
 * and public forms. Import these instead of repeating the strings locally.
 */

export const labelClass = 'block text-sm font-medium text-foreground/90';

export const inputClass =
  'mt-1 w-full rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50';

export const textareaClass =
  'mt-1 w-full rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[120px]';

export const fieldErrorClass = 'mt-1 text-xs text-red-600 dark:text-red-400';

export const generalErrorClass =
  'rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-foreground';

export const successClass =
  'rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-foreground';
