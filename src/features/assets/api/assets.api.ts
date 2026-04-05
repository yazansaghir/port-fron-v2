import type {
  PatchAssetAltRequest,
  PatchAssetOrderRequest,
  ProjectAssetAdmin,
} from '@/features/assets/api/assets.types';
import { apiPostMultipart, apiRequest, apiRequestNoContent } from '@/shared/api/request';

export async function uploadProjectAsset(
  projectId: string,
  formData: FormData,
): Promise<ProjectAssetAdmin> {
  return apiPostMultipart<ProjectAssetAdmin>(`/admin/projects/${projectId}/assets`, formData);
}

export async function deleteAsset(assetId: string): Promise<void> {
  return apiRequestNoContent({
    method: 'DELETE',
    url: `/admin/assets/${assetId}`,
  });
}

export async function patchAssetOrder(
  assetId: string,
  body: PatchAssetOrderRequest,
): Promise<ProjectAssetAdmin> {
  return apiRequest<ProjectAssetAdmin>({
    method: 'PATCH',
    url: `/admin/assets/${assetId}/order`,
    data: body,
  });
}

export async function patchAssetAlt(
  assetId: string,
  body: PatchAssetAltRequest,
): Promise<ProjectAssetAdmin> {
  return apiRequest<ProjectAssetAdmin>({
    method: 'PATCH',
    url: `/admin/assets/${assetId}/alt`,
    data: body,
  });
}
