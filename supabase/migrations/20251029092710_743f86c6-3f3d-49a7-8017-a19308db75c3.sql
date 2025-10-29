-- Allow conversation participants to mark received messages as read
-- This policy grants UPDATE permission only for messages the user received (not sent)

CREATE POLICY "Participants mark received messages read" 
ON public.chat_messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.chat_conversations c
    WHERE c.id = chat_messages.conversation_id
      AND (c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid())
  )
  AND sender_id <> auth.uid()
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.chat_conversations c
    WHERE c.id = chat_messages.conversation_id
      AND (c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid())
  )
  AND sender_id <> auth.uid()
);