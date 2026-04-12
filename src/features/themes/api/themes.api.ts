import type {
  AdminThemeDetail,
  CreateThemeRequest,
  ThemeRevisionSummary,
  ThemeSummary,
  UpdateThemeDraftRequest,
} from '@/features/themes/api/themes.types';
import {
  parseAdminThemeDetailPayload,
  parseRevisionsPayload,
  parseThemeListPayload,
} from '@/features/themes/api/themesWire';
import { apiRequest } from '@/shared/api/request';

export async function listAdminThemes(): Promise<ThemeSummary[]> {
  const data = await apiRequest<unknown>({
    method: 'GET',
    url: '/admin/themes',
  });
  return parseThemeListPayload(data);
}

export async function createAdminTheme(body: CreateThemeRequest): Promise<AdminThemeDetail> {
  const data = await apiRequest<unknown>({
    method: 'POST',
    url: '/admin/themes',
    data: body,
  });
  const parsed = parseAdminThemeDetailPayload(data);
  if (!parsed) {
    throw new Error('Unexpected response when creating theme');
  }
  return parsed;
}

export async function getAdminTheme(themeId: string): Promise<AdminThemeDetail> {
  const data = await apiRequest<unknown>({
    method: 'GET',
    url: `/admin/themes/${themeId}`,
  });
  const parsed = parseAdminThemeDetailPayload(data);
  if (!parsed) {
    throw new Error('Unexpected theme response');
  }
  return parsed;
}

export async function updateAdminThemeDraft(
  themeId: string,
  body: UpdateThemeDraftRequest,
): Promise<AdminThemeDetail> {
  const data = await apiRequest<unknown>({
    method: 'PUT',
    url: `/admin/themes/${themeId}/draft`,
    data: body,
  });
  const parsed = parseAdminThemeDetailPayload(data);
  if (!parsed) {
    throw new Error('Unexpected response when saving theme draft');
  }
  return parsed;
}

export async function publishAdminTheme(themeId: string): Promise<AdminThemeDetail> {
  const data = await apiRequest<unknown>({
    method: 'POST',
    url: `/admin/themes/${themeId}/publish`,
    data: {},
  });
  const parsed = parseAdminThemeDetailPayload(data);
  if (!parsed) {
    throw new Error('Unexpected response when publishing theme');
  }
  return parsed;
}

export async function duplicateAdminTheme(themeId: string, body?: { name?: string }): Promise<AdminThemeDetail> {
  const data = await apiRequest<unknown>({
    method: 'POST',
    url: `/admin/themes/${themeId}/duplicate`,
    data: body ?? {},
  });
  const parsed = parseAdminThemeDetailPayload(data);
  if (!parsed) {
    throw new Error('Unexpected response when duplicating theme');
  }
  return parsed;
}

export async function listAdminThemeRevisions(themeId: string): Promise<ThemeRevisionSummary[]> {
  const data = await apiRequest<unknown>({
    method: 'GET',
    url: `/admin/themes/${themeId}/revisions`,
  });
  return parseRevisionsPayload(data);
}
