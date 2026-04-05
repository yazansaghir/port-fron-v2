type ExternalLinksProps = {
  githubUrl?: string | null;
  liveUrl?: string | null;
};

function ExternalIcon({ type }: { type: 'github' | 'live' }) {
  if (type === 'github') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.304 3.492.997.108-.775.42-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.553 3.296-1.23 3.296-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.302 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const linkBase =
  'inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-[border-color,background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function ExternalLinks({ githubUrl, liveUrl }: ExternalLinksProps) {
  if (!githubUrl && !liveUrl) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {githubUrl ? (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkBase} border-white/[0.12] bg-foreground/[0.06] text-foreground/85 backdrop-blur-md hover:border-primary/40 hover:bg-primary/[0.1] hover:text-primary`}
        >
          <ExternalIcon type="github" />
          GitHub
        </a>
      ) : null}
      {liveUrl ? (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkBase} border-primary/35 bg-gradient-to-br from-primary to-secondary text-white shadow-[0_0_36px_-10px_color-mix(in_srgb,var(--color-primary)_55%,transparent),inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:opacity-95`}
        >
          <ExternalIcon type="live" />
          Live demo
        </a>
      ) : null}
    </div>
  );
}
