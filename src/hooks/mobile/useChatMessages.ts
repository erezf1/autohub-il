import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  messageContent: string;
  messageType: 'text' | 'image' | 'voice' | 'system';
  isRead: boolean;
  createdAt: string;
  senderName: string;
  senderAvatar: string | null;
}

export const useChatMessages = (conversationId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['chat-messages', conversationId],
    queryFn: async () => {
      const { data, error } = await dealerClient
        .from('chat_messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          message_content,
          message_type,
          is_read,
          created_at
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch sender profiles separately
      const senderIds = [...new Set(data.map(m => m.sender_id))];
      const { data: profiles } = await dealerClient
        .from('user_profiles')
        .select('id, business_name, profile_picture_url')
        .in('id', senderIds);

      const profilesMap = profiles?.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {} as Record<string, typeof profiles[0]>) || {};

      return data.map((msg): ChatMessage => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        senderId: msg.sender_id,
        messageContent: msg.message_content,
        messageType: msg.message_type as ChatMessage['messageType'],
        isRead: msg.is_read,
        createdAt: msg.created_at,
        senderName: profilesMap[msg.sender_id]?.business_name || 'משתמש',
        senderAvatar: profilesMap[msg.sender_id]?.profile_picture_url || null
      }));
    },
    enabled: !!conversationId
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = dealerClient
      .channel(`chat-messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      dealerClient.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (!conversationId || !user?.id) return;

    const markAsRead = async () => {
      const { error } = await dealerClient
        .from('chat_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (!error) {
        // Optimistically update the conversations cache
        queryClient.setQueryData(['conversations', user.id], (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.map((conv: any) => 
            conv.id === conversationId 
              ? { ...conv, unreadCount: 0 }
              : conv
          );
        });
        
        // Then invalidate to ensure consistency
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    };

    markAsRead();
  }, [conversationId, user?.id, queryClient]);

  return query;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      messageContent, 
      messageType = 'text' 
    }: { 
      conversationId: string; 
      messageContent: string; 
      messageType?: 'text' | 'image' | 'voice' 
    }) => {
      const { data, error } = await dealerClient
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user?.id,
          message_content: messageContent,
          message_type: messageType
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};
