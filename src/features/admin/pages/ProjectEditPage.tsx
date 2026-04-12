import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ProjectAssetsSection } from '@/features/admin/components/projects/assets/ProjectAssetsSection';
import { ProjectForm, type ProjectFormValues } from '@/features/admin/components/projects/ProjectForm';
import { toCreateRequest } from '@/features/admin/components/projects/projectFormUtils';
import { ProjectStatusBadge } from '@/features/admin/components/projects/ProjectStatusBadge';
import { ProjectStatusSelect } from '@/features/admin/components/projects/ProjectStatusSelect';
import { AdminButton } from '@/features/admin/components/ui/AdminButton';
import { AdminCard } from '@/features/admin/components/ui/AdminCard';
import { AdminSkeleton } from '@/features/admin/components/ui/AdminSkeleton';
import type { AdminProject, ProjectStatus } from '@/features/projects/api/projects.types';
import { useAdminProject } from '@/features/projects/hooks/useAdminProject';
import { usePatchProjectStatus } from '@/features/projects/hooks/usePatchProjectStatus';
import { useUpdateProject } from '@/features/projects/hooks/useUpdateProject';
import { getDisplayMessage, getFieldErrorsRecord, isApiError } from '@/shared/api/mapApiError';

function projectToFormValues(project: AdminProject): ProjectFormValues {
  return {
    title: project.title,
    slug: project.slug,
    shortSummary: project.shortSummary ?? '',
    content: project.content ?? '',
    thumbnailUrl: project.thumbnailUrl ?? '',
    githubUrl: project.githubUrl ?? '',
    liveUrl: project.liveUrl ?? '',
    metaTitle: project.metaTitle ?? '',
    metaDescription: project.metaDescription ?? '',
    orderIndex: String(project.orderIndex),
  };
}

export default function ProjectEditPage() {
  const { id = '' } = useParams<{ id: string }>();

  const { data: project, isPending, isError, error, refetch } = useAdminProject(id);

  const [values, setValues] = useState<ProjectFormValues | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (project) {
      setValues(projectToFormValues(project));
    }
  }, [project]);

  const updateProject = useUpdateProject({
    onSuccess: () => setSaveSuccess(true),
  });

  const statusMutation = usePatchProjectStatus();

  const fieldErrors = updateProject.error ? getFieldErrorsRecord(updateProject.error) : {};
  const generalError =
    updateProject.error && Object.keys(fieldErrors).length === 0
      ? getDisplayMessage(updateProject.error)
      : null;

  function handleChange(field: keyof ProjectFormValues, value: string) {
    setSaveSuccess(false);
    setValues((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!values) return;
    setSaveSuccess(false);
    updateProject.mutate({ id, body: toCreateRequest(values) });
  }

  function handleStatusChange(status: ProjectStatus) {
    statusMutation.mutate({ id, status });
  }

  // Not found
  const isNotFound = isError && isApiError(error) && error.status === 404;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/projects"
          className="rounded-md border border-foreground/15 px-2.5 py-1 text-xs font-medium text-foreground/70 transition hover:bg-foreground/5 hover:text-foreground"
        >
          ← Back
        </Link>
        <h2 className="text-lg font-semibold text-foreground">
          {isPending ? 'Loading…' : isNotFound ? 'Project not found' : (project?.title ?? 'Edit project')}
        </h2>
        {project && (
          <div className="ml-auto flex items-center gap-2">
            <ProjectStatusBadge status={project.status} />
            <ProjectStatusSelect
              value={project.status}
              onChange={handleStatusChange}
              disabled={statusMutation.isPending}
            />
          </div>
        )}
      </div>

      {/* Status mutation error */}
      {statusMutation.isError && (
        <p className="rounded-lg border border-status-danger/25 bg-status-danger/10 px-3 py-2 text-sm text-foreground" role="alert">
          {getDisplayMessage(statusMutation.error, 'Failed to update status.')}
        </p>
      )}

      {/* Save success */}
      {saveSuccess && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-lg border border-status-success/25 bg-status-success/10 px-3 py-2 text-sm text-foreground"
        >
          Changes saved successfully.
        </p>
      )}

      {/* Loading skeleton */}
      {isPending && (
        <AdminCard className="p-6 space-y-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <AdminSkeleton className="h-3 w-24 mb-2" />
              <AdminSkeleton className="h-9 w-full" />
            </div>
          ))}
        </AdminCard>
      )}

      {/* Not found */}
      {isNotFound && (
        <AdminCard className="p-6 text-center">
          <p className="text-sm text-foreground/70">This project does not exist or was deleted.</p>
          <Link
            to="/admin/projects"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to projects
          </Link>
        </AdminCard>
      )}

      {/* General fetch error (non-404) */}
      {isError && !isNotFound && (
        <AdminCard className="p-5">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-foreground/80">
              {getDisplayMessage(error, 'Failed to load project.')}
            </p>
            <AdminButton variant="soft" onClick={() => void refetch()}>
              Retry
            </AdminButton>
          </div>
        </AdminCard>
      )}

      {/* Form */}
      {!isPending && !isError && values && (
        <AdminCard className="p-6">
          <ProjectForm
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            disabled={updateProject.isPending}
            fieldErrors={fieldErrors}
            generalError={generalError}
            submitLabel="Save changes"
          />
        </AdminCard>
      )}

      {/* Assets */}
      {!isPending && !isError && project && (
        <AdminCard className="p-6">
          <ProjectAssetsSection
            projectId={project.id}
            assets={project.assets ?? []}
          />
        </AdminCard>
      )}
    </motion.div>
  );
}
