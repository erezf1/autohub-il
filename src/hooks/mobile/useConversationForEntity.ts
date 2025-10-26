import { useQuery } from '@tanstack/react-query';
import { findConversationIdForEntity } from '@/utils/mobile/chatHelpers';
import { useAuth } from '@/contexts/AuthContext';

interface UseConversationForEntityParams {
  otherUserId: string | null | undefined;
  entityType: 'vehicle' | 'auction' | 'iso_request';
  entityId: string | null | undefined;
}

/**
 * React Query hook to check if a conversation exists for a specific entity
 * Returns the conversation ID if found, null otherwise
 */
export const useConversationForEntity = (params: UseConversationForEntityParams) => {
  const { user } = useAuth();
  const { otherUserId, entityType, entityId } = params;

  return useQuery({
    queryKey: ['conversation-for-entity', user?.id, otherUserId, entityType, entityId],
    queryFn: async () => {
      if (!otherUserId || !entityId) return null;
      
      return await findConversationIdForEntity({
        otherUserId,
        entityType,
        entityId
      });
    },
    enabled: !!user?.id && !!otherUserId && !!entityId
  });
};
