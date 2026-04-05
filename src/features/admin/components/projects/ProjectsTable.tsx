import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { AdminProject, ProjectStatus } from '@/features/projects/api/projects.types';
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableRow,
} from '@/features/admin/components/ui/AdminTable';
import { useDeleteProject } from '@/features/projects/hooks/useDeleteProject';
import { usePatchProjectStatus } from '@/features/projects/hooks/usePatchProjectStatus';
import { useReorderProjects } from '@/features/projects/hooks/useReorderProjects';
import { getDisplayMessage } from '@/shared/api/mapApiError';
import { ProjectDeleteConfirm } from './ProjectDeleteConfirm';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ProjectStatusSelect } from './ProjectStatusSelect';

const TABLE_COLUMNS = ['Title', 'Slug', 'Status', 'Order', 'Updated', 'Actions'];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function sortedByOrder(projects: AdminProject[]): AdminProject[] {
  return [...projects].sort((a, b) => a.orderIndex - b.orderIndex || a.title.localeCompare(b.title));
}

type Props = {
  projects: AdminProject[];
};

export function ProjectsTable({ projects }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<AdminProject | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const deleteMutation = useDeleteProject({
    onSuccess: () => setDeleteTarget(null),
    onError: (err) => {
      setDeleteTarget(null);
      setMutationError(getDisplayMessage(err, 'Failed to delete project.'));
    },
  });

  const statusMutation = usePatchProjectStatus({
    onError: (err) => setMutationError(getDisplayMessage(err, 'Failed to update status.')),
  });

  const reorderMutation = useReorderProjects({
    onError: (err) => setMutationError(getDisplayMessage(err, 'Failed to reorder projects.')),
  });

  const sorted = sortedByOrder(projects);
  const isReordering = reorderMutation.isPending;

  function handleMoveUp(project: AdminProject) {
    const idx = sorted.findIndex((p) => p.id === project.id);
    if (idx <= 0) return;
    const neighbor = sorted[idx - 1];
    const items = sorted.map((p, i) => {
      if (p.id === project.id) return { id: p.id, orderIndex: neighbor.orderIndex };
      if (i === idx - 1) return { id: p.id, orderIndex: project.orderIndex };
      return { id: p.id, orderIndex: p.orderIndex };
    });
    reorderMutation.mutate({ items });
  }

  function handleMoveDown(project: AdminProject) {
    const idx = sorted.findIndex((p) => p.id === project.id);
    if (idx >= sorted.length - 1) return;
    const neighbor = sorted[idx + 1];
    const items = sorted.map((p, i) => {
      if (p.id === project.id) return { id: p.id, orderIndex: neighbor.orderIndex };
      if (i === idx + 1) return { id: p.id, orderIndex: project.orderIndex };
      return { id: p.id, orderIndex: p.orderIndex };
    });
    reorderMutation.mutate({ items });
  }

  function handleStatusChange(project: AdminProject, status: ProjectStatus) {
    if (status === project.status) return;
    statusMutation.mutate({ id: project.id, status });
  }

  return (
    <>
      {mutationError && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-foreground">
          <span>{mutationError}</span>
          <button
            type="button"
            onClick={() => setMutationError(null)}
            className="ml-4 text-foreground/50 hover:text-foreground"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <AdminTable>
        <AdminTableHead columns={TABLE_COLUMNS} />
        <AdminTableBody>
          {sorted.map((project, idx) => (
            <AdminTableRow key={project.id}>
              {/* Title */}
              <AdminTableCell className="font-medium text-white">
                <Link
                  to={`/admin/projects/${project.id}/edit`}
                  className="hover:text-primary hover:underline"
                >
                  {project.title}
                </Link>
              </AdminTableCell>

              {/* Slug */}
              <AdminTableCell>
                <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs text-white/80">
                  {project.slug}
                </code>
              </AdminTableCell>

              {/* Status */}
              <AdminTableCell>
                <div className="flex items-center gap-2">
                  <ProjectStatusBadge status={project.status} />
                  <ProjectStatusSelect
                    value={project.status}
                    onChange={(status) => handleStatusChange(project, status)}
                    disabled={statusMutation.isPending}
                  />
                </div>
              </AdminTableCell>

              {/* Order */}
              <AdminTableCell className="tabular-nums text-white/80">{project.orderIndex}</AdminTableCell>

              {/* Updated */}
              <AdminTableCell className="text-white/60">{formatDate(project.updatedAt)}</AdminTableCell>

              {/* Actions */}
              <AdminTableCell>
                <div className="flex items-center gap-1">
                  {/* Reorder */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(project)}
                    disabled={idx === 0 || isReordering}
                    title="Move up"
                    aria-label={`Move "${project.title}" up`}
                    className="rounded p-1 text-white/50 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 3.22a.75.75 0 0 1 .53.22l4.25 4.25a.75.75 0 0 1-1.06 1.06L8 4.56 4.28 8.75a.75.75 0 0 1-1.06-1.06l4.25-4.25A.75.75 0 0 1 8 3.22Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(project)}
                    disabled={idx === sorted.length - 1 || isReordering}
                    title="Move down"
                    aria-label={`Move "${project.title}" down`}
                    className="rounded p-1 text-white/50 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 12.78a.75.75 0 0 1-.53-.22L3.22 8.31a.75.75 0 0 1 1.06-1.06L8 11.44l3.72-4.19a.75.75 0 0 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-.53.22Z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Edit */}
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                  >
                    Edit
                  </Link>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(project)}
                    className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>

      {deleteTarget && (
        <ProjectDeleteConfirm
          projectTitle={deleteTarget.title}
          isPending={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
