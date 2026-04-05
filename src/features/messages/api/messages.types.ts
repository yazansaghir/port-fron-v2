import type { PaginatedResponse } from '@/shared/api/types';

export type ContactMessage = {
  id: string;
  senderName: string;
  senderEmail: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export type SendMessageRequest = {
  senderName: string;
  senderEmail: string;
  content: string;
};

export type AdminMessagesPage = PaginatedResponse<ContactMessage>;

export type AdminMessagesQueryParams = {
  page?: number;
  limit?: number;
  isRead?: boolean;
};

export type PatchMessageReadRequest = {
  isRead: boolean;
};
