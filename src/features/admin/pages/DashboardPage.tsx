import { AdminButton } from '@/features/admin/components/ui/AdminButton';
import { AdminEmptyState } from '@/features/admin/components/ui/AdminEmptyState';
import { AdminSection } from '@/features/admin/components/ui/AdminSection';
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableRow,
} from '@/features/admin/components/ui/AdminTable';
import { StatCard } from '@/features/admin/components/ui/StatCard';
import { StatCardSkeleton, TableRowSkeleton } from '@/features/admin/components/ui/AdminSkeleton';
import { formatDwellTime } from '@/features/admin/utils/formatDwellTime';
import { useAdminAnalytics } from '@/features/analytics/hooks/useAdminAnalytics';
import { getDisplayMessage } from '@/shared/api/mapApiError';

const TABLE_COLUMNS = ['Project', 'Views', 'Avg Time', 'Last Visited'];

const TABLE_COLUMN_ALIGN: Array<'left' | 'right'> = ['left', 'right', 'right', 'right'];

const dashboardPanelClass =
  'rounded-2xl border border-border/60 bg-surface/35 p-8 lg:p-10';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function DashboardPage() {
  const { data, isPending, isError, error, refetch } = useAdminAnalytics();

  return (
    <div className="flex flex-col gap-8">
      <div className={dashboardPanelClass}>
        <AdminSection title="Overview">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {isPending ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : isError ? null : (
              <>
                <StatCard
                  title="Total Views"
                  value={data.totalViews.toLocaleString()}
                />
                <StatCard
                  title="Avg Time on Site"
                  value={formatDwellTime(data.overallAvgTimeSpent)}
                  footnote="Across all projects"
                />
              </>
            )}
          </div>
        </AdminSection>
      </div>

      {isError && (
        <div className={dashboardPanelClass}>
          <div className="flex flex-col items-start gap-6">
            <p className="text-sm text-text-secondary">
              {getDisplayMessage(error, 'Failed to load analytics.')}
            </p>
            <AdminButton variant="soft" onClick={() => void refetch()}>
              Retry
            </AdminButton>
          </div>
        </div>
      )}

      {!isError && (
        <div className={dashboardPanelClass}>
          <AdminSection
            title="Project Breakdown"
            description="Individual view and engagement stats per project."
          >
            {isPending ? (
              <AdminTable framed={false}>
                <AdminTableHead columns={TABLE_COLUMNS} columnAlign={TABLE_COLUMN_ALIGN} />
                <AdminTableBody>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={4} />
                  ))}
                </AdminTableBody>
              </AdminTable>
            ) : data.projectBreakdown.length === 0 ? (
              <div className="rounded-xl bg-surface/40 px-4 py-10">
                <AdminEmptyState
                  title="No project data yet"
                  description="Once visitors view your projects, stats will appear here."
                />
              </div>
            ) : (
              <AdminTable framed={false}>
                <AdminTableHead columns={TABLE_COLUMNS} columnAlign={TABLE_COLUMN_ALIGN} />
                <AdminTableBody>
                  {data.projectBreakdown.map((row) => (
                    <AdminTableRow key={row.project.id}>
                      <AdminTableCell className="font-medium text-foreground">
                        {row.project.title}
                      </AdminTableCell>
                      <AdminTableCell className="text-right tabular-nums text-text-secondary">
                        {row.totalViews.toLocaleString()}
                      </AdminTableCell>
                      <AdminTableCell className="text-right tabular-nums text-text-secondary">
                        {formatDwellTime(row.avgTimeSpent)}
                      </AdminTableCell>
                      <AdminTableCell className="text-right text-muted">
                        {formatDate(row.lastVisitedAt)}
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            )}
          </AdminSection>
        </div>
      )}
    </div>
  );
}
