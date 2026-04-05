import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { useAdminLogs } from '@/features/logs/hooks/useAdminLogs';
import { getDisplayMessage } from '@/shared/api/mapApiError';
import { AdminButton } from '@/features/admin/components/ui/AdminButton';
import { AdminCard } from '@/features/admin/components/ui/AdminCard';
import { AdminEmptyState } from '@/features/admin/components/ui/AdminEmptyState';
import { TableRowSkeleton } from '@/features/admin/components/ui/AdminSkeleton';
import {
  AdminTable,
  AdminTableHead,
  AdminTableBody,
} from '@/features/admin/components/ui/AdminTable';
import {
  LogsFilterBar,
  type LogsFilters,
} from '@/features/admin/components/logs/LogsFilterBar';
import { LogsTable } from '@/features/admin/components/logs/LogsTable';
import { LogsPagination } from '@/features/admin/components/logs/LogsPagination';

const PAGE_LIMIT = 20;
const TABLE_COLUMNS = ['Event', 'Action', 'Entity', 'User', 'When'];

const defaultFilters: LogsFilters = { actionType: '', entityType: '' };

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LogsFilters>(defaultFilters);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(filters.actionType ? { actionType: filters.actionType } : {}),
      ...(filters.entityType ? { entityType: filters.entityType } : {}),
    }),
    [page, filters.actionType, filters.entityType],
  );

  const { data, isPending, isError, error, refetch, isFetching } =
    useAdminLogs(queryParams);

  function handleFiltersChange(next: LogsFilters) {
    setFilters(next);
    setPage(1);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Activity Logs</h2>
          {data && !isPending && (
            <p className="mt-0.5 text-sm text-foreground/50">
              {data.total} event{data.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <LogsFilterBar value={filters} onChange={handleFiltersChange} />
      </div>

      {isError && (
        <AdminCard className="p-5">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-foreground/80">
              {getDisplayMessage(error, 'Failed to load activity logs.')}
            </p>
        <AdminButton variant="soft" onClick={() => void refetch()}>
          Retry
        </AdminButton>
          </div>
        </AdminCard>
      )}

      {!isError && (
        <div className={isFetching && !isPending ? 'opacity-70' : ''}>
          {isPending ? (
            <AdminTable>
              <AdminTableHead columns={TABLE_COLUMNS} />
              <AdminTableBody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
                ))}
              </AdminTableBody>
            </AdminTable>
          ) : data.items.length === 0 ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <AdminEmptyState
                title="No matching activity"
                description="Try clearing filters or check back after new admin actions are recorded."
              />
            </div>
          ) : (
            <>
              <LogsTable items={data.items} />
              <LogsPagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                limit={data.limit}
                onPageChange={setPage}
                isPending={isPending || isFetching}
              />
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
