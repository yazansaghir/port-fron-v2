import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  buildProjectCreatePayload,
  QUICK_IMPORT_FORCED_STATUS,
} from '@/features/admin/components/projects/githubImportPayload';
import { ProjectsTable } from '@/features/admin/components/projects/ProjectsTable';
import { AdminButton } from '@/features/admin/components/ui/AdminButton';
import { AdminCard } from '@/features/admin/components/ui/AdminCard';
import { AdminEmptyState } from '@/features/admin/components/ui/AdminEmptyState';
import { TableRowSkeleton } from '@/features/admin/components/ui/AdminSkeleton';
import {
  AdminTable,
  AdminTableBody,
  AdminTableHead,
} from '@/features/admin/components/ui/AdminTable';
import { analyzeGithubProject, createProject, patchProjectStatus } from '@/features/projects/api/projects.api';
import { useAdminProjects } from '@/features/projects/hooks/useAdminProjects';
import { projectsKeys } from '@/features/projects/query-keys';
import { getDisplayMessage } from '@/shared/api/mapApiError';

const TABLE_COLUMNS = ['Title', 'Slug', 'Status', 'Order', 'Updated', 'Actions'];

export default function ProjectsListPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isPending, isError, error, refetch } = useAdminProjects({ limit: 100 });
  const analyzeAndCreateDraft = useMutation({
    mutationFn: async () => {
      const trimmedRepoUrl = repoUrl.trim();
      if (!trimmedRepoUrl) {
        throw new Error('Please enter a GitHub repository URL.');
      }

      const analysis = await analyzeGithubProject({ repoUrl: trimmedRepoUrl });
      const draft = analysis.draft ?? {};
      const createPayload = buildProjectCreatePayload(draft, trimmedRepoUrl);

      const created = await createProject(createPayload);
      await patchProjectStatus(created.id, { status: QUICK_IMPORT_FORCED_STATUS });
      await queryClient.invalidateQueries({ queryKey: projectsKeys.adminList() });
      return created.id;
    },
    onMutate: () => {
      setImportError(null);
    },
    onSuccess: (projectId) => {
      navigate(`/admin/projects/${projectId}/edit`);
    },
    onError: (err) => {
      setImportError(getDisplayMessage(err, 'Failed to analyze repository and create draft.'));
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Projects</h2>
          {data && !isPending && (
            <p className="mt-0.5 text-sm text-foreground/50">
              {data.total} project{data.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Link
          to="/admin/projects/new"
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          New project
        </Link>
      </div>

      <AdminCard className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="github-repo-url" className="mb-1 block text-xs font-medium text-foreground/70">
              GitHub repository URL
            </label>
            <input
              id="github-repo-url"
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={analyzeAndCreateDraft.isPending}
              placeholder="https://github.com/owner/repo"
              className="w-full rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
          <AdminButton
            onClick={() => analyzeAndCreateDraft.mutate()}
            disabled={analyzeAndCreateDraft.isPending}
            className="h-10 px-4"
          >
            {analyzeAndCreateDraft.isPending ? 'Analyzing…' : 'Analyze & Create Draft'}
          </AdminButton>
        </div>
        {importError && (
          <p className="mt-3 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-foreground" role="alert">
            {importError}
          </p>
        )}
      </AdminCard>

      {/* Error */}
      {isError && (
        <AdminCard className="p-5">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-foreground/80">
              {getDisplayMessage(error, 'Failed to load projects.')}
            </p>
            <AdminButton variant="soft" onClick={() => void refetch()}>
              Retry
            </AdminButton>
          </div>
        </AdminCard>
      )}

      {/* Table */}
      {!isError && (
        <>
          {isPending ? (
            <AdminTable>
              <AdminTableHead columns={TABLE_COLUMNS} />
              <AdminTableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={6} />
                ))}
              </AdminTableBody>
            </AdminTable>
          ) : data.items.length === 0 ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <AdminEmptyState
                title="No projects yet"
                description="Create your first project to get started."
                action={
                  <Link
                    to="/admin/projects/new"
                    className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    Create project
                  </Link>
                }
              />
            </div>
          ) : (
            <ProjectsTable projects={data.items} />
          )}
        </>
      )}
    </motion.div>
  );
}
