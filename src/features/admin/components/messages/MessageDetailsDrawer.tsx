import { useEffect, useRef } from 'react';

import type { ContactMessage } from '@/features/messages/api/messages.types';
import { useUpdateMessageReadStatus } from '@/features/messages/hooks/useUpdateMessageReadStatus';
import { getDisplayMessage } from '@/shared/api/mapApiError';
import { formatMessageDateTime } from './messageDate';
import { MessageStatusBadge } from './MessageStatusBadge';

type Props = {
  message: ContactMessage;
  onClose: () => void;
  onReadToggled: (updated: ContactMessage) => void;
};

export function MessageDetailsDrawer({ message, onClose, onReadToggled }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const readMutation = useUpdateMessageReadStatus({
    onSuccess: (data) => {
      onReadToggled(data);
    },
  });

  const mutationErrorMsg = readMutation.isError
    ? getDisplayMessage(readMutation.error, 'Failed to update message.')
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay-scrim"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative flex h-full w-full max-w-lg flex-col border-l border-foreground/10 bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
          <h2
            id="message-drawer-title"
            className="text-base font-semibold text-foreground"
          >
            Message
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close message"
            className="rounded p-1 text-foreground/50 transition hover:bg-foreground/8 hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M2.22 2.22a.75.75 0 0 1 1.06 0L8 6.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L9.06 8l4.72 4.72a.75.75 0 0 1-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* Meta */}
        <div className="border-b border-foreground/10 px-5 py-4 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
                From
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{message.senderName}</p>
              <p className="text-xs text-foreground/60">{message.senderEmail}</p>
            </div>
            <MessageStatusBadge isRead={message.isRead} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
              Received
            </p>
            <p className="mt-0.5 text-sm text-foreground/70">
              {formatMessageDateTime(message.createdAt)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/40">
            Message
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
            {message.content}
          </p>
        </div>

        {/* Footer actions */}
        <div className="border-t border-foreground/10 px-5 py-4 space-y-2">
          {mutationErrorMsg && (
            <p className="rounded-md bg-status-danger/10 px-3 py-2 text-xs text-status-danger">
              {mutationErrorMsg}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                readMutation.mutate({ id: message.id, isRead: !message.isRead })
              }
              disabled={readMutation.isPending}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {readMutation.isPending
                ? 'Updating…'
                : message.isRead
                  ? 'Mark as unread'
                  : 'Mark as read'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-foreground/15 px-3 py-1.5 text-sm font-medium text-foreground/70 transition hover:bg-foreground/5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
