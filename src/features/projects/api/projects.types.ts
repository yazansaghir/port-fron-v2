import type { PaginatedResponse } from '@/shared/api/types';

export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type ProjectAssetType = 'image' | 'video';

export type PublishedProjectListItem = {
  id: string;
  title: string;
  slug: string;
  shortSummary: string;
  thumbnailUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectAssetPublic = {
  id: string;
  assetUrl: string;
  assetType: ProjectAssetType;
  displayOrder: number;
  altText: string | null;
};

export type PublishedProjectDetail = PublishedProjectListItem & {
  content: string;
  assets: ProjectAssetPublic[];
};

export type PublishedProjectsPage = PaginatedResponse<PublishedProjectListItem>;
export type AdminProjectsPage = PaginatedResponse<AdminProject>;

export type AdminProject = {
  id: string;
  title: string;
  slug: string;
  shortSummary: string | null;
  content: string | null;
  thumbnailUrl: string | null;
  status: ProjectStatus;
  githubUrl: string | null;
  liveUrl: string | null;
  orderIndex: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  assets: ProjectAssetPublic[];
};

export type CreateProjectRequest = {
  title: string;
  slug: string;
  shortSummary?: string;
  content?: string;
  thumbnailUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  orderIndex?: number;
};

export type UpdateProjectRequest = Partial<CreateProjectRequest>;

export type ReorderProjectsRequest = {
  items: Array<{ id: string; orderIndex: number }>;
};

export type ReorderProjectsResponse = {
  updated: number;
};

export type PatchProjectStatusRequest = {
  status: ProjectStatus;
};
