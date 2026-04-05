import { AdminEmptyState } from '@/features/admin/components/ui/AdminEmptyState';
import type { ProjectAssetPublic } from '@/features/projects/api/projects.types';

import { AssetRow } from './AssetRow';

type Props = {
  assets: ProjectAssetPublic[];
  projectId: string;
};

export function AssetList({ assets, projectId }: Props) {
  if (assets.length === 0) {
    return (
      <AdminEmptyState
        title="No assets yet"
        description="Upload an image or video to attach it to this project."
      />
    );
  }

  const sorted = [...assets].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="space-y-3">
      {sorted.map((asset) => (
        <AssetRow key={asset.id} asset={asset} projectId={projectId} />
      ))}
    </div>
  );
}
