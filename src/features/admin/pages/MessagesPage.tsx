import { useState } from 'react';
import { motion } from 'framer-motion';

import type { ContactMessage } from '@/features/messages/api/messages.types';
import { useAdminMessages } from '@/features/messages/hooks/useAdminMessages';
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
  MessageFilterBar,
  type MessageFilter,
} from '@/features/admin/components/messages/MessageFilterBar';
import { MessageDetailsDrawer } from '@/features/admin/components/messages/MessageDetailsDrawer';
import { MessagesTable } from '@/features/admin/components/messages/MessagesTable';
import { MessagesPagination } from '@/features/admin/components/messages/MessagesPagination';

const PAGE_LIMIT = 20;
const TABLE_COLUMNS = ['From', 'Email', 'Preview', 'Status', 'Date', 'Actions'];

function filterToIsRead(filter: MessageFilter): boolean | undefined {
  if (filter === 'unread') return false;
  if (filter === 'read') return true;
  return undefined;
}

function emptyStateForFilter(filter: MessageFilter) {
  if (filter === 'unread') return { title: 'No unread messages', description: 'All caught up!' };
  if (filter === 'read') return { title: 'No read messages', description: 'Nothing has been marked as read yet.' };
  return { title: 'No messages yet', description: 'Messages from the contact form will appear here.' };
}

export default function MessagesPage() {
  const [filter, setFilter] = useState<MessageFilter>('all');
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const queryParams = {
    page,
    limit: PAGE_LIMIT,
    isRead: filterToIsRead(filter),
  };

  const { data, isPending, isError, error, refetch, isFetching } = useAdminMessages(queryParams);

  function handleFilterChange(newFilter: MessageFilter) {
    setFilter(newFilter);
    setPage(1);
  }

  function handleSelectMessage(msg: ContactMessage) {
    setSelectedMessage(msg);
  }

  function handleDrawerClose() {
    setSelectedMessage(null);
  }

  function handleReadToggled(updated: ContactMessage) {
    // Sync the open drawer immediately without waiting for refetch
    if (selectedMessage?.id === updated.id) {
      setSelectedMessage(updated);
    }
  }

  const empty = emptyStateForFilter(filter);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-5"
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Messages</h2>
            {data && !isPending && (
              <p className="mt-0.5 text-sm text-foreground/50">
                {data.total} message{data.total !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <MessageFilterBar value={filter} onChange={handleFilterChange} />
        </div>

        {/* Error */}
        {isError && (
          <AdminCard className="p-5">
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-foreground/80">
                {getDisplayMessage(error, 'Failed to load messages.')}
              </p>
            <AdminButton variant="soft" onClick={() => void refetch()}>
              Retry
            </AdminButton>
            </div>
          </AdminCard>
        )}

        {/* Table */}
        {!isError && (
          <div className={isFetching && !isPending ? 'opacity-70' : ''}>
            {isPending ? (
              <AdminTable>
                <AdminTableHead columns={TABLE_COLUMNS} />
                <AdminTableBody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={6} />
                  ))}
                </AdminTableBody>
              </AdminTable>
            ) : data.items.length === 0 ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                <AdminEmptyState title={empty.title} description={empty.description} />
              </div>
            ) : (
              <>
                <MessagesTable
                  messages={data.items}
                  selectedId={selectedMessage?.id ?? null}
                  onSelectMessage={handleSelectMessage}
                  onReadToggled={handleReadToggled}
                />
                <MessagesPagination
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

      {/* Message detail drawer — rendered outside flow for stacking context */}
      {selectedMessage && (
        <MessageDetailsDrawer
          message={selectedMessage}
          onClose={handleDrawerClose}
          onReadToggled={handleReadToggled}
        />
      )}
    </>
  );
}
