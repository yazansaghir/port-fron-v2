import type { ProjectAssetType } from '@/features/projects/api/projects.types';

export type ProjectAssetAdmin = {
  id: string;
  projectId: string;
  assetUrl: string;
  assetType: ProjectAssetType;
  displayOrder: number;
  altText: string | null;
};

export type PatchAssetOrderRequest = {
  displayOrder: number;
};

export type PatchAssetAltRequest = {
  altText: string | null;
};

/** Build multipart body for POST /admin/projects/:id/assets */
export function buildProjectAssetFormData(
  file: File,
  assetType: ProjectAssetType,
  options?: { displayOrder?: number; altText?: string | null },
): FormData {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('assetType', assetType);
  if (options?.displayOrder !== undefined) {
    formData.append('displayOrder', String(options.displayOrder));
  }
  if (options?.altText !== undefined && options.altText !== null) {
    formData.append('altText', options.altText);
  }
  return formData;
}
