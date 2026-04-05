/**
 * Full-page atmospheric background for public marketing routes (Home, About, …).
 * Balanced mesh + mirrored soft glows so color supports the centered content column, not the far edges.
 */
export function PublicPageAtmosphere() {
  const meshBackground = `
    radial-gradient(ellipse 130% 55% at 50% 0%, color-mix(in srgb, var(--color-primary) 6%, transparent) 0%, transparent 52%),
    radial-gradient(ellipse 115% 50% at 50% 100%, color-mix(in srgb, var(--color-secondary) 5.5%, transparent) 0%, transparent 50%),
    radial-gradient(ellipse 70% 60% at 50% 45%, rgba(56, 189, 248, 0.032) 0%, transparent 58%),
    radial-gradient(ellipse 88% 72% at 18% 44%, color-mix(in srgb, var(--color-secondary) 7%, transparent) 0%, transparent 50%),
    radial-gradient(ellipse 88% 72% at 82% 50%, color-mix(in srgb, var(--color-primary) 7%, transparent) 0%, transparent 50%),
    radial-gradient(ellipse 110% 45% at 50% 50%, color-mix(in srgb, var(--color-primary) 2.8%, transparent) 0%, transparent 72%)
  `;

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-[0.97]"
        style={{ background: meshBackground }}
      />

      <div
        className="absolute left-1/2 top-[10%] h-[min(72vw,640px)] w-[min(72vw,640px)] -translate-x-1/2 rounded-full opacity-[0.1]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 38%, transparent), transparent 68%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute left-[10%] top-[40%] h-[min(58vw,520px)] w-[min(58vw,520px)] rounded-full opacity-[0.09]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-secondary) 34%, transparent), transparent 66%)',
          filter: 'blur(95px)',
        }}
      />
      <div
        className="absolute right-[10%] top-[44%] h-[min(58vw,520px)] w-[min(58vw,520px)] rounded-full opacity-[0.09]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 34%, transparent), transparent 66%)',
          filter: 'blur(95px)',
        }}
      />
      <div
        className="absolute bottom-[-6%] left-1/2 h-[min(70vw,560px)] w-[min(70vw,560px)] -translate-x-1/2 rounded-full opacity-[0.08]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 28%, transparent) 0%, rgba(56, 189, 248, 0.05) 45%, transparent 68%)',
          filter: 'blur(100px)',
        }}
      />
    </div>
  );
}
