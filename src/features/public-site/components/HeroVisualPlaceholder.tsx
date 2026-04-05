export function HeroVisualPlaceholder() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Outer glow bleed */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 72%)',
          filter: 'blur(48px)',
        }}
        aria-hidden
      />

      {/* Main glass frame */}
      <div
        className="relative w-full max-w-[28rem] overflow-hidden rounded-[2rem] border border-white/[0.08] lg:max-w-[32rem]"
        style={{
          background:
            'linear-gradient(160deg, color-mix(in srgb, var(--color-primary) 7%, transparent), color-mix(in srgb, var(--color-surface) 55%, transparent))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow:
            '0 32px 80px -24px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.07)',
        }}
      >
        {/* Inner top highlight */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-primary) 60%, transparent) 40%, color-mix(in srgb, var(--color-secondary) 50%, transparent) 60%, transparent)',
          }}
          aria-hidden
        />

        {/* Simulated screen / media area */}
        <div className="p-3 pb-0">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[1.4rem]"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent) 0%, color-mix(in srgb, var(--color-secondary) 8%, transparent) 50%, rgba(56,189,248,0.04) 100%)',
            }}
          >
            {/* Subtle dot-grid overlay */}
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.06]"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <defs>
                <pattern id="hero-dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-dot-grid)" />
            </svg>

            {/* Central accent mark */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div
                className="h-16 w-16 rounded-2xl border border-white/[0.1]"
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 28%, transparent), color-mix(in srgb, var(--color-secondary) 18%, transparent))',
                  boxShadow: '0 8px 32px -8px color-mix(in srgb, var(--color-primary) 35%, transparent)',
                }}
              />
              <div className="flex gap-2">
                {[0.7, 1, 0.7].map((op, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-16 rounded-full"
                    style={{
                      background: 'var(--color-primary)',
                      opacity: op * 0.22,
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {[1, 0.6, 0.9, 0.6].map((op, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-10 rounded-full"
                    style={{
                      background: 'var(--color-text)',
                      opacity: op * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Corner accent — top right */}
            <div
              className="pointer-events-none absolute right-4 top-4 h-8 w-8 rounded-full"
              style={{
                background: 'color-mix(in srgb, var(--color-secondary) 35%, transparent)',
                filter: 'blur(10px)',
              }}
              aria-hidden
            />
          </div>
        </div>

        {/* Card footer bar */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col gap-1.5">
            <div
              className="h-2 w-24 rounded-full"
              style={{ background: 'var(--color-text)', opacity: 0.15 }}
            />
            <div
              className="h-1.5 w-16 rounded-full"
              style={{ background: 'var(--color-text)', opacity: 0.08 }}
            />
          </div>
          <div
            className="h-8 w-8 rounded-full border border-white/[0.1]"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 30%, transparent), color-mix(in srgb, var(--color-secondary) 20%, transparent))',
            }}
          />
        </div>
      </div>

      {/* Floating accent — bottom left */}
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-secondary) 55%, transparent), transparent 70%)',
          filter: 'blur(28px)',
        }}
        aria-hidden
      />
      {/* Floating accent — top right */}
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-25"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 55%, transparent), transparent 70%)',
          filter: 'blur(24px)',
        }}
        aria-hidden
      />
    </div>
  );
}
