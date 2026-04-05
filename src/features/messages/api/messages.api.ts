import type {
  AdminMessagesPage,
  AdminMessagesQueryParams,
  ContactMessage,
  PatchMessageReadRequest,
  SendMessageRequest,
} from '@/features/messages/api/messages.types';
import { apiRequest } from '@/shared/api/request';

export async function sendMessage(body: SendMessageRequest): Promise<ContactMessage> {
  return apiRequest<ContactMessage>({
    method: 'POST',
    url: '/messages',
    data: body,
  });
}

export async function listAdminMessages(
  params?: AdminMessagesQueryParams,
): Promise<AdminMessagesPage> {
  return apiRequest<AdminMessagesPage>({
    method: 'GET',
    url: '/admin/messages',
    params:
      params?.isRead === undefined
        ? { page: params?.page, limit: params?.limit }
        : {
            page: params.page,
            limit: params.limit,
            isRead: String(params.isRead),
          },
  });
}

export async function patchMessageRead(
  id: string,
  body: PatchMessageReadRequest,
): Promise<ContactMessage> {
  return apiRequest<ContactMessage>({
    method: 'PATCH',
    url: `/admin/messages/${id}/read`,
    data: body,
  });
}
