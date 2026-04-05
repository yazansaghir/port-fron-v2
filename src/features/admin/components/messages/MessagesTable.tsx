import { useState } from 'react';

import type { ContactMessage } from '@/features/messages/api/messages.types';
import { useUpdateMessageReadStatus } from '@/features/messages/hooks/useUpdateMessageReadStatus';
import { getDisplayMessage } from '@/shared/api/mapApiError';
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableRow,
} from '@/features/admin/components/ui/AdminTable';
import { formatMessageDate } from './messageDate';
import { MessageStatusBadge } from './MessageStatusBadge';
import { truncateContent } from './messagePreview';

const TABLE_COLUMNS = ['From', 'Email', 'Preview', 'Status', 'Date', 'Actions'];

type Props = {
  messages: ContactMessage[];
  selectedId: string | null;
  onSelectMessage: (message: ContactMessage) => void;
  onReadToggled: (updated: ContactMessage) => void;
};

export function MessagesTable({ messages, selectedId, onSelectMessage, onReadToggled }: Props) {
  const [mutationError, setMutationError] = useState<string | null>(null);

  const readMutation = useUpdateMessageReadStatus({
    onSuccess: (data) => {
      onReadToggled(data);
    },
    onError: (err) => {
      setMutationError(getDisplayMessage(err, 'Failed to update message.'));
    },
  });

  function handleToggleRead(message: ContactMessage, e: React.MouseEvent) {
    e.stopPropagation();
    readMutation.mutate({ id: message.id, isRead: !message.isRead });
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
          {messages.map((msg) => {
            const isSelected = msg.id === selectedId;
            const isMutating =
              readMutation.isPending && readMutation.variables?.id === msg.id;

            return (
              <AdminTableRow
                key={msg.id}
                className={[
                  'cursor-pointer',
                  isSelected ? 'bg-primary/10 hover:!bg-primary/[0.16]' : '',
                  !msg.isRead ? 'font-medium' : '',
                ].join(' ')}
              >
                {/* From */}
                <AdminTableCell
                  className="font-medium text-white"
                  onClick={() => onSelectMessage(msg)}
                >
                  <span className="flex items-center gap-1.5">
                    {!msg.isRead && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {msg.senderName}
                  </span>
                </AdminTableCell>

                {/* Email */}
                <AdminTableCell
                  className="text-white/70"
                  onClick={() => onSelectMessage(msg)}
                >
                  <a
                    href={`mailto:${encodeURIComponent(msg.senderEmail)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    {msg.senderEmail}
                  </a>
                </AdminTableCell>

                {/* Preview */}
                <AdminTableCell
                  className="max-w-xs text-white/60"
                  onClick={() => onSelectMessage(msg)}
                >
                  <span className="block truncate">{truncateContent(msg.content, 70)}</span>
                </AdminTableCell>

                {/* Status */}
                <AdminTableCell onClick={() => onSelectMessage(msg)}>
                  <MessageStatusBadge isRead={msg.isRead} />
                </AdminTableCell>

                {/* Date */}
                <AdminTableCell
                  className="whitespace-nowrap text-white/60"
                  onClick={() => onSelectMessage(msg)}
                >
                  {formatMessageDate(msg.createdAt)}
                </AdminTableCell>

                {/* Actions */}
                <AdminTableCell>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectMessage(msg)}
                      className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleToggleRead(msg, e)}
                      disabled={isMutating}
                      className="rounded px-2 py-1 text-xs font-medium text-white/60 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {isMutating ? '…' : msg.isRead ? 'Unread' : 'Read'}
                    </button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            );
          })}
        </AdminTableBody>
      </AdminTable>
    </>
  );
}
