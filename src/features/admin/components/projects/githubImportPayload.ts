import type {
  CreateProjectRequest,
  GithubGeneratedProjectDraft,
  ProjectStatus,
} from '@/features/projects/api/projects.types';

export const QUICK_IMPORT_FORCED_STATUS: ProjectStatus = 'DRAFT';

function normalizeOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function isValidHttpUrl(value: string | undefined): boolean {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeOptionalHttpUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || !isValidHttpUrl(trimmed)) return undefined;
  return new URL(trimmed).toString();
}

export function buildProjectCreatePayload(
  draft: GithubGeneratedProjectDraft,
  repoUrl: string,
): CreateProjectRequest {
  const title = draft.title?.trim() ?? '';
  const slug = draft.slug?.trim() ?? '';

  if (!title || !slug) {
    throw new Error('AI draft is missing required fields: title and slug.');
  }

  const payload: CreateProjectRequest = {
    title,
    slug,
    shortSummary: normalizeOptionalText(draft.shortSummary),
    content: normalizeOptionalText(draft.content),
    githubUrl: normalizeOptionalHttpUrl(draft.githubUrl) ?? normalizeOptionalHttpUrl(repoUrl),
    metaTitle: normalizeOptionalText(draft.metaTitle),
    metaDescription: normalizeOptionalText(draft.metaDescription),
    orderIndex: 0,
  };

  const liveUrl = normalizeOptionalHttpUrl(draft.liveUrl);
  if (liveUrl) {
    payload.liveUrl = liveUrl;
  }

  const thumbnailUrl = normalizeOptionalHttpUrl(draft.thumbnailUrl);
  if (thumbnailUrl) {
    payload.thumbnailUrl = thumbnailUrl;
  }

  return payload;
}
