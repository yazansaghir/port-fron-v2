import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';

import type { ContactMessage, SendMessageRequest } from '@/features/messages/api/messages.types';
import { sendMessage } from '@/features/messages/api/messages.api';
import { messagesKeys } from '@/features/messages/query-keys';

export function useSendMessage(
  options?: Omit<
    UseMutationOptions<ContactMessage, Error, SendMessageRequest>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: sendMessage,
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: messagesKeys.admin() });
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
