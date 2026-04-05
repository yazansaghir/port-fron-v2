import { AdminCard } from '@/features/admin/components/ui/AdminCard';
import { AdminEmptyState } from '@/features/admin/components/ui/AdminEmptyState';
import { AdminSkeleton } from '@/features/admin/components/ui/AdminSkeleton';
import type { SiteSettings } from '@/features/settings/api/settings.types';

import { SettingsVersionRow } from './SettingsVersionRow';

type Props = {
  items: SiteSettings[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  skeletonCount?: number;
};

function VersionSkeleton() {
  return (
    <div className="rounded-lg border border-foreground/10 px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <AdminSkeleton className="h-3.5 w-32" />
          <AdminSkeleton className="h-2.5 w-48" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <AdminSkeleton key={i} className="h-4 w-4 rounded-sm" />
            ))}
          </div>
          <AdminSkeleton className="h-2.5 w-24" />
        </div>
      </div>
    </div>
  );
}

export function SettingsVersionList({
  items,
  selectedId,
  onSelect,
  isLoading,
  skeletonCount = 4,
}: Props) {
  return (
    <AdminCard>
      <div className="flex flex-col gap-2 p-3">
        {isLoading ? (
          Array.from({ length: skeletonCount }).map((_, i) => <VersionSkeleton key={i} />)
        ) : items.length === 0 ? (
          <AdminEmptyState
            title="No settings versions"
            description="No versions exist yet. The API will return versions once they are created on the backend."
          />
        ) : (
          items.map((item) => (
            <SettingsVersionRow
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </AdminCard>
  );
}
