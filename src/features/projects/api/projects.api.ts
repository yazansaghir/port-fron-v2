import type {
  AdminProject,
  AdminProjectsPage,
  AnalyzeGithubProjectRequest,
  AnalyzeGithubProjectResponse,
  CreateProjectRequest,
  PatchProjectStatusRequest,
  PublishedProjectDetail,
  PublishedProjectsPage,
  ReorderProjectsRequest,
  ReorderProjectsResponse,
  UpdateProjectRequest,
} from '@/features/projects/api/projects.types';
import type { AdminHeavyPaginationParams, ProjectsPaginationParams } from '@/shared/api/pagination';
import { apiRequest, apiRequestNoContent } from '@/shared/api/request';

export async function listAdminProjects(
  params?: AdminHeavyPaginationParams,
): Promise<AdminProjectsPage> {
  return apiRequest<AdminProjectsPage>({
    method: 'GET',
    url: '/admin/projects',
    params,
  });
}

export async function getAdminProjectById(id: string): Promise<AdminProject> {
  return apiRequest<AdminProject>({
    method: 'GET',
    url: `/admin/projects/${id}`,
  });
}

export async function listPublishedProjects(
  params?: ProjectsPaginationParams,
): Promise<PublishedProjectsPage> {
  return apiRequest<PublishedProjectsPage>({
    method: 'GET',
    url: '/projects',
    params,
  });
}

export async function getPublishedProjectBySlug(slug: string): Promise<PublishedProjectDetail> {
  return apiRequest<PublishedProjectDetail>({
    method: 'GET',
    url: `/projects/${encodeURIComponent(slug)}`,
  });
}

export async function createProject(body: CreateProjectRequest): Promise<AdminProject> {
  return apiRequest<AdminProject>({
    method: 'POST',
    url: '/admin/projects',
    data: body,
  });
}

export async function analyzeGithubProject(
  body: AnalyzeGithubProjectRequest,
): Promise<AnalyzeGithubProjectResponse> {
  return apiRequest<AnalyzeGithubProjectResponse>({
    method: 'POST',
    url: '/admin/projects/analyze-github',
    data: body,
  });
}

export async function updateProject(
  id: string,
  body: UpdateProjectRequest,
): Promise<AdminProject> {
  return apiRequest<AdminProject>({
    method: 'PATCH',
    url: `/admin/projects/${id}`,
    data: body,
  });
}

export async function deleteProject(id: string): Promise<void> {
  return apiRequestNoContent({
    method: 'DELETE',
    url: `/admin/projects/${id}`,
  });
}

export async function patchProjectStatus(
  id: string,
  body: PatchProjectStatusRequest,
): Promise<AdminProject> {
  return apiRequest<AdminProject>({
    method: 'PATCH',
    url: `/admin/projects/${id}/status`,
    data: body,
  });
}

export async function reorderProjects(
  body: ReorderProjectsRequest,
): Promise<ReorderProjectsResponse> {
  return apiRequest<ReorderProjectsResponse>({
    method: 'PUT',
    url: '/admin/projects/reorder',
    data: body,
  });
}
