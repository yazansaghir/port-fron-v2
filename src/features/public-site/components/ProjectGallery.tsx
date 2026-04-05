import type { ProjectAssetPublic } from '@/features/projects/api/projects.types';

type ProjectGalleryProps = {
  assets: ProjectAssetPublic[];
};

const frame =
  'overflow-hidden rounded-3xl border border-white/[0.08] bg-[color-mix(in_srgb,var(--color-surface)_55%,transparent)] shadow-[0_24px_56px_-28px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-[12px]';

function GalleryMedia({
  asset,
  priority,
}: {
  asset: ProjectAssetPublic;
  priority: 'hero' | 'grid';
}) {
  const isVideo = asset.assetType === 'video';
  const innerRadius = priority === 'hero' ? 'rounded-2xl' : 'rounded-xl';

  if (isVideo) {
    return (
      <div className={`${frame} p-3 sm:p-4`}>
        <div
          className={`relative overflow-hidden ${innerRadius} bg-black/40 ring-1 ring-inset ring-white/[0.06]`}
        >
          <video
            src={asset.assetUrl}
            controls
            className="aspect-video min-h-[200px] w-full object-contain sm:min-h-[240px]"
            aria-label={asset.altText ?? 'Project video'}
          />
        </div>
      </div>
    );
  }

  const img = (
    <img
      src={asset.assetUrl}
      alt={asset.altText ?? 'Project image'}
      loading="lazy"
      className={`w-full ${priority === 'hero' ? 'max-h-[min(72vh,820px)] object-contain' : 'aspect-video object-cover'}`}
    />
  );

  if (priority === 'grid') {
    return (
      <a
        href={asset.assetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group block ${frame} p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-3`}
      >
        <div className={`relative overflow-hidden ${innerRadius} bg-foreground/[0.04]`}>{img}</div>
      </a>
    );
  }

  return (
    <div className={`${frame} p-3 sm:p-5`}>
      <div className={`relative overflow-hidden ${innerRadius} bg-foreground/[0.04]`}>{img}</div>
    </div>
  );
}

export function ProjectGallery({ assets }: ProjectGalleryProps) {
  if (assets.length === 0) return null;

  const sorted = [...assets].sort((a, b) => a.displayOrder - b.displayOrder);
  const [first, ...rest] = sorted;

  return (
    <section aria-label="Project gallery" className="mt-16 md:mt-20">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary">Media</p>
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-text md:text-4xl">
          Gallery & assets
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
          Screens, captures, and motion from this build.
        </p>
      </div>

      <div className="space-y-10">
        <GalleryMedia asset={first} priority="hero" />

        {rest.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {rest.map((asset) => (
              <GalleryMedia key={asset.id} asset={asset} priority="grid" />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
