import type { AdminMessagesQueryParams } from '@/features/messages/api/messages.types';

export const messagesKeys = {
  all: ['messages'] as const,
  admin: () => [...messagesKeys.all, 'admin'] as const,
  adminList: (params?: AdminMessagesQueryParams) =>
    [...messagesKeys.admin(), 'list', params ?? {}] as const,
};
