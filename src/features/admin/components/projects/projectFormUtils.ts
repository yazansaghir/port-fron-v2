import type { CreateProjectRequest } from '@/features/projects/api/projects.types';
import type { ProjectFormValues } from './ProjectForm';

export const EMPTY_PROJECT_FORM: ProjectFormValues = {
  title: '',
  slug: '',
  shortSummary: '',
  content: '',
  thumbnailUrl: '',
  githubUrl: '',
  liveUrl: '',
  metaTitle: '',
  metaDescription: '',
  orderIndex: '0',
};

export function toCreateRequest(values: ProjectFormValues): CreateProjectRequest {
  const trimmed = (v: string) => v.trim() || undefined;
  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    ...(trimmed(values.shortSummary) && { shortSummary: values.shortSummary.trim() }),
    ...(trimmed(values.content) && { content: values.content.trim() }),
    ...(trimmed(values.thumbnailUrl) && { thumbnailUrl: values.thumbnailUrl.trim() }),
    ...(trimmed(values.githubUrl) && { githubUrl: values.githubUrl.trim() }),
    ...(trimmed(values.liveUrl) && { liveUrl: values.liveUrl.trim() }),
    ...(trimmed(values.metaTitle) && { metaTitle: values.metaTitle.trim() }),
    ...(trimmed(values.metaDescription) && { metaDescription: values.metaDescription.trim() }),
    orderIndex: parseInt(values.orderIndex, 10) || 0,
  };
}
