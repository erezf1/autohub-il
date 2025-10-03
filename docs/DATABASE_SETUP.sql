-- ============================================
-- AUTO-HUB DATABASE SETUP
-- Complete SQL setup for all phases
-- Execute this in Supabase SQL Editor
-- ============================================

-- ============================================
-- PHASE 1: CORE SETUP
-- ============================================

-- ===== LOOKUP TABLES =====

CREATE TABLE IF NOT EXISTS public.vehicle_makes (
  id SERIAL PRIMARY KEY,
  name_hebrew TEXT NOT NULL UNIQUE,
  name_english TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.vehicle_makes (name_hebrew, name_english) VALUES
('טויוטה', 'Toyota'),
('מזדה', 'Mazda'),
('הונדה', 'Honda'),
('ב.מ.וו', 'BMW'),
('מרצדס', 'Mercedes-Benz'),
('אאודי', 'Audi'),
('פולקסווגן', 'Volkswagen'),
('ניסאן', 'Nissan'),
('הונדאי', 'Hyundai'),
('קיה', 'Kia'),
('סקודה', 'Skoda'),
('סיאט', 'Seat'),
('פיג''ו', 'Peugeot'),
('רנו', 'Renault'),
('פורד', 'Ford'),
('שברולט', 'Chevrolet'),
('סובארו', 'Subaru'),
('מיצובישי', 'Mitsubishi'),
('לקסוס', 'Lexus'),
('אינפיניטי', 'Infiniti')
ON CONFLICT (name_english) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.vehicle_models (
  id SERIAL PRIMARY KEY,
  make_id INTEGER REFERENCES public.vehicle_makes(id) ON DELETE CASCADE,
  name_hebrew TEXT NOT NULL,
  name_english TEXT NOT NULL,
  vehicle_type TEXT CHECK (vehicle_type IN ('car', 'motorcycle')) DEFAULT 'car',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(make_id, name_hebrew)
);

INSERT INTO public.vehicle_models (make_id, name_hebrew, name_english) VALUES
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'קורולה', 'Corolla'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'קמרי', 'Camry'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'פריוס', 'Prius'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'יאריס', 'Yaris'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'אוריס', 'Auris'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'איגוס', 'Aygo'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'ראב 4', 'RAV4'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'לנד קרוזר', 'Land Cruiser')
ON CONFLICT (make_id, name_hebrew) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.vehicle_tags (
  id SERIAL PRIMARY KEY,
  name_hebrew TEXT NOT NULL UNIQUE,
  name_english TEXT NOT NULL UNIQUE,
  tag_type TEXT CHECK (tag_type IN ('condition', 'category', 'feature')) DEFAULT 'feature',
  color TEXT DEFAULT '#6B7280',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.vehicle_tags (name_hebrew, name_english, tag_type, color) VALUES
('אחרי תאונה', 'after_accident', 'condition', '#EF4444'),
('רכב יוקרה', 'luxury', 'category', '#8B5CF6'),
('חסכוני בדלק', 'fuel_efficient', 'feature', '#10B981'),
('מתאים למשפחה', 'family_car', 'category', '#3B82F6'),
('ספורטיבי', 'sporty', 'category', '#F59E0B'),
('עבודה', 'work_vehicle', 'category', '#6B7280'),
('חדש יחסית', 'relatively_new', 'condition', '#10B981'),
('מטפל היטב', 'well_maintained', 'condition', '#10B981'),
('מחיר מעולה', 'great_price', 'feature', '#F59E0B'),
('קילומטרז'' נמוך', 'low_mileage', 'feature', '#10B981')
ON CONFLICT (name_english) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.locations (
  id SERIAL PRIMARY KEY,
  name_hebrew TEXT NOT NULL UNIQUE,
  name_english TEXT NOT NULL UNIQUE,
  region TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.locations (name_hebrew, name_english, region) VALUES
('תל אביב', 'Tel Aviv', 'Center'),
('ירושלים', 'Jerusalem', 'Jerusalem'),
('חיפה', 'Haifa', 'North'),
('באר שבע', 'Beer Sheva', 'South'),
('נתניה', 'Netanya', 'Center'),
('פתח תקווה', 'Petah Tikva', 'Center'),
('אשדוד', 'Ashdod', 'South'),
('ראשון לציון', 'Rishon LeZion', 'Center'),
('אשקלון', 'Ashkelon', 'South'),
('רמת גן', 'Ramat Gan', 'Center'),
('בת ים', 'Bat Yam', 'Center'),
('הרצליה', 'Herzliya', 'Center'),
('כפר סבא', 'Kfar Saba', 'Center'),
('רעננה', 'Ra''anana', 'Center'),
('חולון', 'Holon', 'Center'),
('מודיעין', 'Modi''in', 'Center'),
('נצרת', 'Nazareth', 'North'),
('עכו', 'Acre', 'North'),
('צפת', 'Safed', 'North'),
('אילת', 'Eilat', 'South')
ON CONFLICT (name_english) DO NOTHING;

-- ===== USER MANAGEMENT =====

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  user_role TEXT DEFAULT 'dealer' CHECK (user_role IN ('dealer', 'admin', 'support')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  location_id INTEGER REFERENCES public.locations(id),
  trade_license_number TEXT,
  trade_license_file_url TEXT,
  tenure INTEGER DEFAULT 0,
  avg_response_time INTEGER,
  rating_tier TEXT DEFAULT 'bronze' CHECK (rating_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  subscription_type TEXT DEFAULT 'regular' CHECK (subscription_type IN ('regular', 'silver', 'unlimited')),
  subscription_valid_until DATE,
  available_boosts INTEGER DEFAULT 0,
  available_auctions INTEGER DEFAULT 0,
  vehicles_limit INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== NOTIFICATIONS =====

CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'registration_approved', 'registration_rejected', 'iso_match', 'iso_offer_received',
    'auction_outbid', 'auction_bid_received', 'auction_won', 'auction_ended',
    'subscription_expiring', 'subscription_expired', 'admin_warning', 'message_received',
    'vehicle_sold', 'boost_expired', 'offer_accepted', 'offer_rejected'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  related_entity_type TEXT,
  related_entity_id UUID,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'new_user_registration', 'user_report', 'auction_completed', 'vehicle_added',
    'payment_failed', 'system_alert', 'support_ticket', 'suspicious_activity'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  related_entity_type TEXT,
  related_entity_id UUID,
  assigned_to UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PHASE 2: VEHICLES & AUCTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS public.vehicle_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  make_id INTEGER REFERENCES public.vehicle_makes(id),
  model_id INTEGER REFERENCES public.vehicle_models(id),
  sub_model TEXT,
  year INTEGER NOT NULL CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
  kilometers INTEGER CHECK (kilometers >= 0),
  transmission TEXT CHECK (transmission IN ('manual', 'automatic', 'semi_automatic')),
  fuel_type TEXT CHECK (fuel_type IN ('gasoline', 'diesel', 'hybrid', 'electric')),
  engine_size DECIMAL(3,1),
  color TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  description TEXT,
  images TEXT[],
  test_result_file_url TEXT,
  had_severe_crash BOOLEAN DEFAULT FALSE,
  previous_owners INTEGER DEFAULT 1,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'removed', 'pending')),
  is_boosted BOOLEAN DEFAULT FALSE,
  boosted_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vehicle_listing_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicle_listings(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES public.vehicle_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vehicle_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicle_listings(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  auction_type TEXT DEFAULT 'standard' CHECK (auction_type IN ('standard', 'reserve', 'buy_now')),
  starting_price DECIMAL(10,2) NOT NULL CHECK (starting_price > 0),
  reserve_price DECIMAL(10,2),
  buy_now_price DECIMAL(10,2),
  current_highest_bid DECIMAL(10,2),
  highest_bidder_id UUID REFERENCES public.users(id),
  bid_count INTEGER DEFAULT 0,
  auction_start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  auction_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bid_amount DECIMAL(10,2) NOT NULL CHECK (bid_amount > 0),
  is_automatic BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.iso_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  make_id INTEGER REFERENCES public.vehicle_makes(id),
  model_id INTEGER REFERENCES public.vehicle_models(id),
  year_from INTEGER CHECK (year_from >= 1990),
  year_to INTEGER CHECK (year_to >= year_from),
  price_from DECIMAL(10,2) CHECK (price_from >= 0),
  price_to DECIMAL(10,2) CHECK (price_to >= price_from),
  max_kilometers INTEGER CHECK (max_kilometers >= 0),
  transmission_preference TEXT CHECK (transmission_preference IN ('manual', 'automatic', 'any')),
  fuel_type_preference TEXT CHECK (fuel_type_preference IN ('gasoline', 'diesel', 'hybrid', 'electric', 'any')),
  location_id INTEGER REFERENCES public.locations(id),
  additional_requirements TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.iso_request_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  iso_request_id UUID REFERENCES public.iso_requests(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicle_listings(id) ON DELETE CASCADE,
  offerer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  offered_price DECIMAL(10,2) NOT NULL CHECK (offered_price > 0),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(iso_request_id, vehicle_id, offerer_id)
);

-- ============================================
-- PHASE 3: COMMUNICATION & SUPPORT
-- ============================================

CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  participant_2_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicle_listings(id),
  iso_request_id UUID REFERENCES public.iso_requests(id),
  is_details_revealed BOOLEAN DEFAULT FALSE,
  details_revealed_by UUID REFERENCES public.users(id),
  details_revealed_at TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id, vehicle_id),
  CHECK (participant_1_id != participant_2_id)
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message_content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'contact_reveal', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.users(id),
  reported_user_id UUID REFERENCES public.users(id),
  ticket_type TEXT CHECK (ticket_type IN ('user_report', 'technical_support', 'general', 'billing')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'escalated')),
  category TEXT CHECK (category IN ('fraud', 'harassment', 'fake_listing', 'payment', 'technical', 'other')),
  assigned_to UUID REFERENCES public.users(id),
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message_content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Profile creation trigger
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, business_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Notification functions
CREATE OR REPLACE FUNCTION create_user_notification(
  p_recipient_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_description TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_action_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_admin_notification(
  p_type TEXT,
  p_title TEXT,
  p_description TEXT,
  p_priority TEXT DEFAULT 'medium',
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_assigned_to UUID DEFAULT NULL
)
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_unread_notifications_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.user_notifications
    WHERE recipient_id = user_id AND is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_admin_unread_notifications_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.admin_notifications
    WHERE is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_unread_messages_count(user_id UUID)
RETURNS INTEGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-notification triggers
CREATE OR REPLACE FUNCTION notify_admin_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_profile_created ON public.user_profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION notify_admin_new_user();

CREATE OR REPLACE FUNCTION update_auction_highest_bid()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auction_bid_update_highest ON public.auction_bids;
CREATE TRIGGER on_auction_bid_update_highest
  AFTER INSERT ON public.auction_bids
  FOR EACH ROW EXECUTE FUNCTION update_auction_highest_bid();

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_conversations
  SET 
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_chat_message_created ON public.chat_messages;
CREATE TRIGGER on_chat_message_created
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_listing_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iso_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iso_request_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND user_role IN ('admin', 'support')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User policies
DROP POLICY IF EXISTS "Users can view own user record" ON public.users;
CREATE POLICY "Users can view own user record" ON public.users
  FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR ALL USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can view profiles" ON public.user_profiles;
CREATE POLICY "Users can view profiles" ON public.user_profiles
  FOR SELECT USING (
    id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.status = 'active')
  );

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (id = auth.uid());

-- Notification policies
DROP POLICY IF EXISTS "Users see own notifications" ON public.user_notifications;
CREATE POLICY "Users see own notifications" ON public.user_notifications
  FOR SELECT USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "Users update own notifications" ON public.user_notifications;
CREATE POLICY "Users update own notifications" ON public.user_notifications
  FOR UPDATE USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "Admins see admin notifications" ON public.admin_notifications;
CREATE POLICY "Admins see admin notifications" ON public.admin_notifications
  FOR ALL USING (is_admin(auth.uid()));

-- Vehicle policies
DROP POLICY IF EXISTS "Active users see available vehicles" ON public.vehicle_listings;
CREATE POLICY "Active users see available vehicles" ON public.vehicle_listings
  FOR SELECT USING (
    status = 'available' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND status = 'active')
  );

DROP POLICY IF EXISTS "Users manage own vehicles" ON public.vehicle_listings;
CREATE POLICY "Users manage own vehicles" ON public.vehicle_listings
  FOR ALL USING (owner_id = auth.uid());

-- Auction policies
DROP POLICY IF EXISTS "Active users see auctions" ON public.auctions;
CREATE POLICY "Active users see auctions" ON public.auctions
  FOR SELECT USING (
    status IN ('scheduled', 'active') AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND status = 'active')
  );

DROP POLICY IF EXISTS "Users create auctions" ON public.auctions;
CREATE POLICY "Users create auctions" ON public.auctions
  FOR INSERT WITH CHECK (creator_id = auth.uid());

-- Chat policies
DROP POLICY IF EXISTS "Users see their conversations" ON public.chat_conversations;
CREATE POLICY "Users see their conversations" ON public.chat_conversations
  FOR SELECT USING (
    participant_1_id = auth.uid() OR participant_2_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users see messages in their conversations" ON public.chat_messages;
CREATE POLICY "Users see messages in their conversations" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations c
      WHERE c.id = conversation_id 
      AND (c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid())
    )
  );

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_notifications_recipient_unread ON public.user_notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_unread ON public.admin_notifications(is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON public.users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_listings_make_model ON public.vehicle_listings(make_id, model_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_listings_price ON public.vehicle_listings(price) WHERE status = 'available';
CREATE INDEX IF NOT EXISTS idx_vehicle_listings_boosted ON public.vehicle_listings(is_boosted, boosted_until) WHERE status = 'available';
CREATE INDEX IF NOT EXISTS idx_auctions_status_end_time ON public.auctions(status, auction_end_time);
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_time ON public.auction_bids(auction_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_time ON public.chat_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_participants ON public.chat_conversations(participant_1_id, participant_2_id);

-- ============================================
-- REAL-TIME SETUP
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.auction_bids;

ALTER TABLE public.user_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.admin_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.auction_bids REPLICA IDENTITY FULL;
