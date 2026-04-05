import type { ReactNode } from 'react';

type HeaderDensity = 'default' | 'compact' | 'large';

type SectionHeaderProps = {
  /** Mono label above title (e.g. Expertise) */
  label?: string;
  /** Plain title when not using gradient split */
  title?: string;
  /** Build title as: {titlePrefix}<span class="text-gradient">{titleGradient}</span>{titleSuffix} */
  titlePrefix?: string;
  titleGradient?: string;
  titleSuffix?: string;
  description?: string;
  id?: string;
  align?: 'left' | 'center';
  density?: HeaderDensity;
};

export function SectionHeader({
  title,
  label,
  description,
  id,
  align = 'center',
  density = 'default',
  titlePrefix,
  titleGradient,
  titleSuffix,
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  const mb = density === 'compact' ? 'mb-12' : density === 'large' ? 'mb-20' : 'mb-16';

  let heading: ReactNode;
  if (titleGradient != null && titleGradient !== '') {
    const headingSize =
      density === 'large'
        ? 'text-4xl font-bold leading-tight text-text md:text-5xl'
        : 'text-3xl font-bold leading-tight text-text md:text-4xl';
    heading = (
      <h2
        className={`${headingSize} ${isCenter ? 'mx-auto max-w-3xl' : ''}`}
      >
        {titlePrefix ?? null}
        <span className="text-gradient">{titleGradient}</span>
        {titleSuffix ?? null}
      </h2>
    );
  } else {
    const headingSize =
      density === 'large'
        ? 'text-4xl font-bold leading-tight text-text md:text-5xl'
        : 'text-3xl font-bold leading-tight text-text md:text-4xl';
    heading = (
      <h2
        className={`${headingSize} ${isCenter ? 'mx-auto max-w-3xl' : ''}`}
      >
        {title ?? ''}
      </h2>
    );
  }

  return (
    <div id={id} className={`${mb} ${isCenter ? 'text-center' : ''}`}>
      {label ? (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary">{label}</p>
      ) : null}
      {heading}
      {description ? (
        <p
          className={`mt-5 leading-relaxed text-muted ${
            density === 'large' ? 'max-w-2xl text-lg' : 'max-w-xl'
          } ${isCenter ? 'mx-auto' : ''}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
