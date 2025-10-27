import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to generate anonymous dealer number per conversation
const generateAnonymousNumber = (conversationId: string, userId: string): string => {
  const combined = conversationId + userId;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash = hash & hash;
  }
  const fiveDigit = Math.abs(hash % 90000) + 10000;
  return fiveDigit.toString();
};

export interface ConversationParticipant {
  id: string;
  business_name: string;
  profile_picture_url: string | null;
}

export interface ConversationEntity {
  type: 'vehicle' | 'auction' | 'iso_request';
  id: string;
  title: string;
  subtitle?: string;
}

export interface Conversation {
  id: string;
  otherParty: ConversationParticipant;
  entity: ConversationEntity;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isDetailsRevealed: boolean;
  detailsRevealRequestedBy: string | null;
  detailsRevealApprovedBy: string | null;
}

export const useConversations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await dealerClient
        .from('chat_conversations')
        .select(`
          id,
          participant_1_id,
          participant_2_id,
          vehicle_id,
          auction_id,
          iso_request_id,
          is_details_revealed,
          details_reveal_requested_by,
          details_reveal_approved_by,
          last_message_at,
          vehicle_listings(id, make:vehicle_makes(name_hebrew), model:vehicle_models(name_hebrew), year),
          auctions(id, vehicle:vehicle_listings(id, make:vehicle_makes(name_hebrew), model:vehicle_models(name_hebrew), year)),
          iso_requests(id, title),
          chat_messages(message_content, created_at, sender_id)
        `)
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Get unread counts for each conversation
      const conversationIds = data.map(c => c.id);
      const { data: unreadData } = await dealerClient
        .from('chat_messages')
        .select('conversation_id, is_read')
        .in('conversation_id', conversationIds)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      const unreadCounts = unreadData?.reduce((acc, msg) => {
        acc[msg.conversation_id] = (acc[msg.conversation_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Fetch participant profiles separately
      const participantIds = [...new Set(data.flatMap(c => [c.participant_1_id, c.participant_2_id]))];
      const { data: profiles } = await dealerClient
        .from('user_profiles')
        .select('id, business_name, profile_picture_url')
        .in('id', participantIds);

      const profilesMap = profiles?.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {} as Record<string, typeof profiles[0]>) || {};

      return data.map((conv): Conversation => {
        const isParticipant1 = conv.participant_1_id === user.id;
        const otherPartyId = isParticipant1 ? conv.participant_2_id : conv.participant_1_id;
        const otherParty = profilesMap[otherPartyId];
        
        let entity: ConversationEntity;
        if (conv.vehicle_listings) {
          const v = conv.vehicle_listings;
          entity = {
            type: 'vehicle',
            id: v.id,
            title: `${v.make?.name_hebrew} ${v.model?.name_hebrew}`,
            subtitle: `${v.year}`
          };
        } else if (conv.auctions) {
          const a = conv.auctions;
          entity = {
            type: 'auction',
            id: a.id,
            title: `מכרז - ${a.vehicle.make?.name_hebrew} ${a.vehicle.model?.name_hebrew}`,
            subtitle: `${a.vehicle.year}`
          };
        } else if (conv.iso_requests) {
          entity = {
            type: 'iso_request',
            id: conv.iso_requests.id,
            title: conv.iso_requests.title
          };
        } else {
          entity = { type: 'vehicle', id: '', title: 'שיחה' };
        }

        const lastMsg = Array.isArray(conv.chat_messages) && conv.chat_messages.length > 0 
          ? conv.chat_messages[0] 
          : null;

        const lastMessageContent = lastMsg?.message_content || '';
        const lastMessageSender = lastMsg?.sender_id;
        const senderPrefix = !lastMessageContent ? '' :
          lastMessageSender === user.id ? 'אתה: ' : 'סוחר: ';

        return {
          id: conv.id,
          otherParty: {
            id: otherPartyId,
            business_name: conv.is_details_revealed ? otherParty?.business_name || 'משתמש' : `סוחר #${generateAnonymousNumber(conv.id, otherPartyId)}`,
            profile_picture_url: otherParty?.profile_picture_url || null
          },
          entity,
          lastMessage: senderPrefix + lastMessageContent,
          lastMessageAt: conv.last_message_at || '',
          unreadCount: unreadCounts[conv.id] || 0,
          isDetailsRevealed: conv.is_details_revealed || false,
          detailsRevealRequestedBy: conv.details_reveal_requested_by,
          detailsRevealApprovedBy: conv.details_reveal_approved_by
        };
      });
    },
    enabled: !!user?.id
  });
};

export const useConversation = (conversationId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const { data, error } = await dealerClient
        .from('chat_conversations')
        .select(`
          id,
          participant_1_id,
          participant_2_id,
          vehicle_id,
          auction_id,
          iso_request_id,
          is_details_revealed,
          details_reveal_requested_by,
          details_reveal_approved_by,
          vehicle_listings(id, make:vehicle_makes(name_hebrew), model:vehicle_models(name_hebrew), year),
          auctions(id, vehicle:vehicle_listings(id, make:vehicle_makes(name_hebrew), model:vehicle_models(name_hebrew), year)),
          iso_requests(id, title)
        `)
        .eq('id', conversationId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Conversation not found');

      const isParticipant1 = data.participant_1_id === user?.id;
      const otherPartyId = isParticipant1 ? data.participant_2_id : data.participant_1_id;

      // Fetch other party's profile separately
      const { data: profileData } = await dealerClient
        .from('user_profiles')
        .select('id, business_name, profile_picture_url')
        .eq('id', otherPartyId)
        .single();

      // Fetch phone number if details are revealed
      let phoneNumber = null;
      if (data.is_details_revealed) {
        const { data: userData } = await dealerClient
          .from('users')
          .select('phone_number')
          .eq('id', otherPartyId)
          .single();
        phoneNumber = userData?.phone_number;
      }

      return {
        ...data,
        otherParty: {
          id: otherPartyId,
          business_name: profileData?.business_name || 'משתמש',
          profile_picture_url: profileData?.profile_picture_url || null,
          phone_number: phoneNumber,
          displayName: data.is_details_revealed 
            ? profileData?.business_name || 'משתמש'
            : `סוחר #${generateAnonymousNumber(data.id, otherPartyId)}`
        }
      };
    },
    enabled: !!conversationId && !!user?.id
  });
};

export const useRequestReveal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { error } = await dealerClient
        .from('chat_conversations')
        .update({
          details_reveal_requested_by: user?.id,
          details_reveal_requested_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) throw error;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};

export const useApproveReveal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { error } = await dealerClient
        .from('chat_conversations')
        .update({
          is_details_revealed: true,
          details_reveal_approved_by: user?.id
        })
        .eq('id', conversationId);

      if (error) throw error;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};

export const useRejectReveal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { error } = await dealerClient
        .from('chat_conversations')
        .update({
          details_reveal_requested_by: null,
          details_reveal_requested_at: null
        })
        .eq('id', conversationId);

      if (error) throw error;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};
