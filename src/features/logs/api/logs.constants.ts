/**
 * Filter dropdown values sent verbatim to GET /admin/logs.
 * Values MUST match backend enum literals exactly.
 */
export type LogFilterOption = { value: string; label: string };

export const LOG_ACTION_TYPE_FILTER_OPTIONS: readonly LogFilterOption[] = [
  { value: 'PROJECT_CREATE', label: 'Project — Create' },
  { value: 'PROJECT_UPDATE', label: 'Project — Update' },
  { value: 'PROJECT_DELETE', label: 'Project — Delete' },
  { value: 'PROJECT_PUBLISH', label: 'Project — Publish' },
  { value: 'PROJECT_STATUS_CHANGE', label: 'Project — Status change' },
  { value: 'PROJECT_REORDER', label: 'Project — Reorder' },
  { value: 'ASSET_UPLOAD', label: 'Asset — Upload' },
  { value: 'ASSET_DELETE', label: 'Asset — Delete' },
  { value: 'ASSET_ORDER', label: 'Asset — Order' },
  { value: 'ASSET_ALT_TEXT', label: 'Asset — Alt text' },
  { value: 'MESSAGE_MARK_READ', label: 'Message — Mark read' },
  { value: 'MESSAGE_MARK_UNREAD', label: 'Message — Mark unread' },
  { value: 'SETTINGS_UPDATE', label: 'Settings — Update' },
  { value: 'SETTINGS_CLONE', label: 'Settings — Clone' },
  { value: 'SETTINGS_PUBLISH', label: 'Settings — Publish' },
];

export const LOG_ENTITY_TYPE_FILTER_OPTIONS: readonly LogFilterOption[] = [
  { value: 'project', label: 'Project' },
  { value: 'projectAsset', label: 'Asset' },
  { value: 'message', label: 'Message' },
  { value: 'siteSettings', label: 'Settings' },
  { value: 'system', label: 'System' },
];
