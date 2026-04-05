import type { ActivityLogItem } from '@/features/logs/api/logs.types';
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableRow,
} from '@/features/admin/components/ui/AdminTable';
import { EntityTypeBadge } from './EntityTypeBadge';
import { LogSummaryCell } from './LogSummaryCell';
import { LogTypeBadge } from './LogTypeBadge';
import { formatActivityLogDateTime } from './logTimestamp';

const TABLE_COLUMNS = ['Event', 'Action', 'Entity', 'User', 'When'];

type Props = {
  items: ActivityLogItem[];
};

export function LogsTable({ items }: Props) {
  return (
    <AdminTable>
      <AdminTableHead columns={TABLE_COLUMNS} />
      <AdminTableBody>
        {items.map((item) => (
          <AdminTableRow key={item.id}>
            <AdminTableCell className="align-top">
              <LogSummaryCell item={item} />
            </AdminTableCell>
            <AdminTableCell className="align-top">
              <LogTypeBadge actionType={item.actionType} />
            </AdminTableCell>
            <AdminTableCell className="align-top">
              <EntityTypeBadge entityType={item.entityType} />
            </AdminTableCell>
            <AdminTableCell className="whitespace-nowrap align-top text-white/70">
              {item.user.email}
            </AdminTableCell>
            <AdminTableCell className="whitespace-nowrap align-top text-white/60">
              {formatActivityLogDateTime(item.createdAt)}
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  );
}
