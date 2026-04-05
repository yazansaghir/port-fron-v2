import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import { patchMessageRead } from '@/features/messages/api/messages.api';
import type { ContactMessage, PatchMessageReadRequest } from '@/features/messages/api/messages.types';
import { messagesKeys } from '@/features/messages/query-keys';
import type { ApiError } from '@/shared/api/errors';

type Vars = { id: string } & PatchMessageReadRequest;

export function useUpdateMessageReadStatus(
  options?: Omit<UseMutationOptions<ContactMessage, ApiError, Vars>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation<ContactMessage, ApiError, Vars>({
    mutationFn: ({ id, isRead }) => patchMessageRead(id, { isRead }),
    ...rest,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: messagesKeys.admin() });
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
