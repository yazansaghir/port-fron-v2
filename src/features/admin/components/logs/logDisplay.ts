import type { ActivityLogItem } from '@/features/logs/api/logs.types';

/** Preferred human-readable line for a log row. */
export function getLogPrimaryText(item: ActivityLogItem): string {
  const fromMessage = item.message?.trim();
  if (fromMessage) return fromMessage;
  return item.action?.trim() || '—';
}

/** Tooltip / title string combining context without leading with raw ids. */
export function getLogSummaryTitle(item: ActivityLogItem): string {
  const primary = getLogPrimaryText(item);
  const parts = [primary];
  if (item.entityLabel?.trim()) {
    parts.push(`Entity: ${item.entityLabel.trim()}`);
  }
  if (item.entityId && item.entityType) {
    parts.push(`${item.entityType} id: ${item.entityId}`);
  } else if (item.entityId) {
    parts.push(`id: ${item.entityId}`);
  }
  return parts.join(' · ');
}

/** Present API enum-style strings as short labels (e.g. PROJECT_UPDATE → Project update). */
export function formatLogKindLabel(value: string): string {
  const cleaned = value.replace(/^[a-z]+\./i, '').replace(/_/g, ' ').trim();
  if (!cleaned) return value;
  const lower = cleaned.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
