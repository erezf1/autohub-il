import { useMutation, useQueryClient } from '@tanstack/react-query';
import { openOrCreateChat } from '@/utils/mobile/chatHelpers';

interface CreateConversationParams {
  otherUserId: string;
  entityType: 'vehicle' | 'auction' | 'iso_request';
  entityId: string;
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateConversationParams) => {
      return await openOrCreateChat(params);
    },
    onSuccess: () => {
      // Invalidate conversations query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
