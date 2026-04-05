import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
import { useAdminProjects } from '@/features/projects/hooks/useAdminProjects';
import { getDisplayMessage } from '@/shared/api/mapApiError';

const TABLE_COLUMNS = ['Title', 'Slug', 'Status', 'Order', 'Updated', 'Actions'];

export default function ProjectsListPage() {
  const { data, isPending, isError, error, refetch } = useAdminProjects({ limit: 100 });

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
