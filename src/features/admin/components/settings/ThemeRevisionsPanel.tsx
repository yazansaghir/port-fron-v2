import { useState } from 'react';

import { AdminButton } from '@/features/admin/components/ui/AdminButton';
import { AdminCard } from '@/features/admin/components/ui/AdminCard';
import { formatMessageDateTime } from '@/features/admin/components/messages/messageDate';
import { useAdminThemeRevisions } from '@/features/themes/hooks/useAdminThemeRevisions';

type Props = {
  themeId: string | null;
};

export function ThemeRevisionsPanel({ themeId }: Props) {
  const [open, setOpen] = useState(false);
  const { data, isPending, isError, refetch } = useAdminThemeRevisions(open ? themeId : null);

  if (!themeId) return null;

  return (
    <AdminCard className="divide-y divide-foreground/8">
      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <p className="text-sm font-medium text-foreground">Published revisions</p>
          <p className="mt-0.5 text-xs text-foreground/50">
            Read-only history for this theme. Expand to load from the server.
          </p>
        </div>
        <AdminButton type="button" variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide' : 'Show'}
        </AdminButton>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          {isError && (
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-foreground/80">Failed to load revisions.</p>
              <AdminButton type="button" variant="soft" size="sm" onClick={() => void refetch()}>
                Retry
              </AdminButton>
            </div>
          )}
          {isPending && !isError && (
            <p className="text-xs text-foreground/50">Loading…</p>
          )}
          {!isPending && !isError && data && data.length === 0 && (
            <p className="text-xs text-foreground/50">No revisions yet.</p>
          )}
          {!isPending && !isError && data && data.length > 0 && (
            <ul className="max-h-56 space-y-2 overflow-y-auto pr-1 text-sm">
              {data.map((rev) => (
                <li
                  key={rev.id}
                  className="rounded-lg border border-foreground/10 bg-foreground/[0.02] px-3 py-2"
                >
                  <p className="font-medium text-foreground">{rev.versionName ?? 'Untitled'}</p>
                  <p className="mt-0.5 text-xs text-foreground/45">{formatMessageDateTime(rev.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </AdminCard>
  );
}
