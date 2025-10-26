import { dealerClient } from '@/integrations/supabase/dealerClient';

interface OpenChatParams {
  otherUserId: string;
  entityType: 'vehicle' | 'auction' | 'iso_request';
  entityId: string;
}

/**
 * Opens or creates a chat conversation for a specific entity
 * Returns the conversation ID for navigation
 */
export const openOrCreateChat = async (params: OpenChatParams): Promise<string> => {
  const { otherUserId, entityType, entityId } = params;

  try {
    // Get current user
    const { data: { user }, error: userError } = await dealerClient.auth.getUser();
    if (userError || !user) throw new Error('User not authenticated');

    // Determine which field to check based on entity type
    const entityField = entityType === 'vehicle' ? 'vehicle_id' : 
                       entityType === 'auction' ? 'auction_id' : 'iso_request_id';

    // Check if conversation exists
    // Need to check both orderings of participants
    const { data: existingConversations, error: fetchError } = await dealerClient
      .from('chat_conversations')
      .select('id')
      .eq(entityField, entityId)
      .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${otherUserId}),and(participant_1_id.eq.${otherUserId},participant_2_id.eq.${user.id})`);

    if (fetchError) throw fetchError;

    // If conversation exists, return its ID
    if (existingConversations && existingConversations.length > 0) {
      return existingConversations[0].id;
    }

    // Create new conversation
    const conversationData: any = {
      participant_1_id: user.id,
      participant_2_id: otherUserId,
    };

    // Add entity reference
    conversationData[entityField] = entityId;

    const { data: newConversation, error: createError } = await dealerClient
      .from('chat_conversations')
      .insert(conversationData)
      .select('id')
      .single();

    if (createError) throw createError;
    if (!newConversation) throw new Error('Failed to create conversation');

    return newConversation.id;
  } catch (error) {
    console.error('Error opening/creating chat:', error);
    throw error;
  }
};
