import { AdminSection } from '@/features/admin/components/ui/AdminSection';
import type { ProjectAssetPublic } from '@/features/projects/api/projects.types';

import { AssetList } from './AssetList';
import { AssetUploader } from './AssetUploader';

type Props = {
  projectId: string;
  assets: ProjectAssetPublic[];
};

export function ProjectAssetsSection({ projectId, assets }: Props) {
  return (
    <AdminSection
      title="Assets"
      description="Images and videos attached to this project, shown in display order."
    >
      <AssetUploader projectId={projectId} />
      <AssetList assets={assets} projectId={projectId} />
    </AdminSection>
  );
}
