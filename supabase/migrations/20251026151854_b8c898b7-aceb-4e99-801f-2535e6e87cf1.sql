-- Add auction_id to chat_conversations
ALTER TABLE public.chat_conversations 
ADD COLUMN auction_id UUID REFERENCES public.auctions(id);

-- Update message_type to support voice messages
ALTER TABLE public.chat_messages 
DROP CONSTRAINT IF EXISTS chat_messages_message_type_check;

ALTER TABLE public.chat_messages 
ADD CONSTRAINT chat_messages_message_type_check 
CHECK (message_type IN ('text', 'image', 'voice', 'system'));

-- Add reveal request tracking columns
ALTER TABLE public.chat_conversations 
ADD COLUMN details_reveal_requested_by UUID REFERENCES public.users(id),
ADD COLUMN details_reveal_requested_at TIMESTAMP WITH TIME ZONE;

-- Rename existing column for clarity
ALTER TABLE public.chat_conversations 
RENAME COLUMN details_revealed_by TO details_reveal_approved_by;

-- Drop existing restrictive unique constraint
ALTER TABLE public.chat_conversations 
DROP CONSTRAINT IF EXISTS chat_conversations_participant_1_id_participant_2_id_vehicl_key;

-- Add new partial unique constraints for each context type
CREATE UNIQUE INDEX chat_conversations_vehicle_unique 
ON public.chat_conversations (
  LEAST(participant_1_id, participant_2_id),
  GREATEST(participant_1_id, participant_2_id),
  vehicle_id
) 
WHERE vehicle_id IS NOT NULL AND auction_id IS NULL AND iso_request_id IS NULL;

CREATE UNIQUE INDEX chat_conversations_auction_unique 
ON public.chat_conversations (
  LEAST(participant_1_id, participant_2_id),
  GREATEST(participant_1_id, participant_2_id),
  auction_id
) 
WHERE auction_id IS NOT NULL AND vehicle_id IS NULL AND iso_request_id IS NULL;

CREATE UNIQUE INDEX chat_conversations_iso_unique 
ON public.chat_conversations (
  LEAST(participant_1_id, participant_2_id),
  GREATEST(participant_1_id, participant_2_id),
  iso_request_id
) 
WHERE iso_request_id IS NOT NULL AND vehicle_id IS NULL AND auction_id IS NULL;

-- Update RLS policies to include auction_id
DROP POLICY IF EXISTS "Users create conversations" ON public.chat_conversations;
CREATE POLICY "Users create conversations" 
ON public.chat_conversations 
FOR INSERT 
WITH CHECK (
  ((participant_1_id = auth.uid()) OR (participant_2_id = auth.uid())) 
  AND (EXISTS ( 
    SELECT 1 FROM public.users 
    WHERE (users.id = auth.uid()) AND (users.status = 'active'::text)
  ))
);

-- Add index for auction_id
CREATE INDEX idx_chat_conversations_auction_id ON public.chat_conversations(auction_id) WHERE auction_id IS NOT NULL;