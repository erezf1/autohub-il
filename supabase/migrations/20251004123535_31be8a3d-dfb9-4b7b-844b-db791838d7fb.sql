-- ============================================
-- SECURITY FIXES - Address linter warnings
-- ============================================

-- Fix 1: Enable RLS on lookup tables (READ-ONLY for all authenticated users)
ALTER TABLE public.vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Public read policies for lookup tables
CREATE POLICY "Anyone can view vehicle makes" ON public.vehicle_makes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view vehicle models" ON public.vehicle_models
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view vehicle tags" ON public.vehicle_tags
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view locations" ON public.locations
  FOR SELECT USING (true);

-- Fix 2: Add missing RLS policies
CREATE POLICY "Users see tags for vehicles they can see" ON public.vehicle_listing_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehicle_listings v
      WHERE v.id = vehicle_id AND v.status = 'available'
    )
  );

CREATE POLICY "Users manage own vehicle tags" ON public.vehicle_listing_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vehicle_listings v
      WHERE v.id = vehicle_id AND v.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users see offers on their ISO requests" ON public.iso_request_offers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.iso_requests r
      WHERE r.id = iso_request_id AND r.requester_id = auth.uid()
    ) OR offerer_id = auth.uid()
  );

CREATE POLICY "Users create offers" ON public.iso_request_offers
  FOR INSERT WITH CHECK (
    offerer_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND status = 'active')
  );

CREATE POLICY "Users update own offers" ON public.iso_request_offers
  FOR UPDATE USING (offerer_id = auth.uid());

CREATE POLICY "Users create support tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users see own tickets" ON public.support_tickets
  FOR SELECT USING (
    reporter_id = auth.uid() OR 
    reported_user_id = auth.uid() OR
    is_admin(auth.uid())
  );

CREATE POLICY "Admins manage all tickets" ON public.support_tickets
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Users see ticket messages" ON public.support_ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id 
      AND (t.reporter_id = auth.uid() OR t.reported_user_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "Users send ticket messages" ON public.support_ticket_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id 
      AND (t.reporter_id = auth.uid() OR t.reported_user_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

-- Fix 3: Add search_path to all functions for security
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_phone TEXT;
  v_full_name TEXT;
  v_business_name TEXT;
BEGIN
  v_phone := NEW.raw_user_meta_data->>'phone_number';
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  v_business_name := COALESCE(NEW.raw_user_meta_data->>'business_name', '');
  
  INSERT INTO public.users (id, phone_number)
  VALUES (NEW.id, COALESCE(v_phone, NEW.phone, ''))
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_profiles (id, full_name, business_name)
  VALUES (NEW.id, v_full_name, v_business_name)
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'dealer'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION create_user_notification(
  p_recipient_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_description TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_action_url TEXT DEFAULT NULL
)
RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.user_notifications (
    recipient_id, notification_type, title, description,
    related_entity_type, related_entity_id, action_url
  ) VALUES (
    p_recipient_id, p_type, p_title, p_description,
    p_entity_type, p_entity_id, p_action_url
  ) RETURNING id INTO notification_id;
  RETURN notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_admin_notification(
  p_type TEXT,
  p_title TEXT,
  p_description TEXT,
  p_priority TEXT DEFAULT 'medium',
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_assigned_to UUID DEFAULT NULL
)
RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.admin_notifications (
    notification_type, title, description, priority,
    related_entity_type, related_entity_id, assigned_to
  ) VALUES (
    p_type, p_title, p_description, p_priority,
    p_entity_type, p_entity_id, p_assigned_to
  ) RETURNING id INTO notification_id;
  RETURN notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_unread_notifications_count(user_id UUID)
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.user_notifications
    WHERE recipient_id = user_id AND is_read = FALSE
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_admin_unread_notifications_count()
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.admin_notifications
    WHERE is_read = FALSE
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_user_unread_messages_count(user_id UUID)
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.chat_messages m
    JOIN public.chat_conversations c ON m.conversation_id = c.id
    WHERE (c.participant_1_id = user_id OR c.participant_2_id = user_id)
    AND m.sender_id != user_id
    AND m.is_read = FALSE
  );
END;
$$;

CREATE OR REPLACE FUNCTION notify_admin_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM create_admin_notification(
    'new_user_registration',
    'משתמש חדש נרשם',
    'משתמש חדש "' || COALESCE(NEW.business_name, NEW.full_name) || '" נרשם למערכת וממתין לאישור',
    'medium',
    'user',
    NEW.id
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_auction_highest_bid()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.auctions
  SET 
    current_highest_bid = NEW.bid_amount,
    highest_bidder_id = NEW.bidder_id,
    bid_count = bid_count + 1,
    updated_at = NOW()
  WHERE id = NEW.auction_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.chat_conversations
  SET 
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    public.has_role(user_id, 'admin'::public.app_role) OR 
    public.has_role(user_id, 'support'::public.app_role)
  );
END;
$$;