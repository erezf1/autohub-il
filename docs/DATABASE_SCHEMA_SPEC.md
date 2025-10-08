# Database Schema Specification - Auto-Hub

## Overview
This document defines the complete Supabase database schema for Auto-Hub, including all tables, functions, triggers, and RLS policies. The schema supports a Hebrew RTL B2B marketplace for licensed car dealers in Israel.

## Database Architecture

### 1. Lookup Tables (Constant Values)

#### 1.1 Vehicle Makes Table
```sql
CREATE TABLE public.vehicle_makes (
  id SERIAL PRIMARY KEY,
  name_hebrew TEXT NOT NULL UNIQUE,
  name_english TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert popular makes
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
('אינפיניטי', 'Infiniti');
```

#### 1.2 Vehicle Models Table
```sql
CREATE TABLE public.vehicle_models (
  id SERIAL PRIMARY KEY,
  make_id INTEGER REFERENCES public.vehicle_makes(id) ON DELETE CASCADE,
  name_hebrew TEXT NOT NULL,
  name_english TEXT NOT NULL,
  vehicle_type TEXT CHECK (vehicle_type IN ('car', 'motorcycle')) DEFAULT 'car',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(make_id, name_hebrew)
);

-- Example models for Toyota
INSERT INTO public.vehicle_models (make_id, name_hebrew, name_english) VALUES
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'קורולה', 'Corolla'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'קמרי', 'Camry'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'פריוס', 'Prius'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'יאריס', 'Yaris'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'אוריס', 'Auris'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'איגוס', 'Aygo'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'ראב 4', 'RAV4'),
((SELECT id FROM public.vehicle_makes WHERE name_english = 'Toyota'), 'לנד קרוזר', 'Land Cruiser');
```

#### 1.3 Vehicle Tags Table
```sql
CREATE TABLE public.vehicle_tags (
  id SERIAL PRIMARY KEY,
  name_hebrew TEXT NOT NULL UNIQUE,
  name_english TEXT NOT NULL UNIQUE,
  tag_type TEXT CHECK (tag_type IN ('condition', 'category', 'feature')) DEFAULT 'feature',
  color TEXT DEFAULT '#6B7280', -- For UI display
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common tags
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
('קילומטרז' נמוך', 'low_mileage', 'feature', '#10B981');
```

#### 1.4 Israeli Locations Table
```sql
CREATE TABLE public.locations (
  id SERIAL PRIMARY KEY,
  name_hebrew TEXT NOT NULL UNIQUE,
  name_english TEXT NOT NULL UNIQUE,
  region TEXT, -- North, Center, South, Jerusalem
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert major cities and regions
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
('רעננה', 'Ra\'anana', 'Center'),
('חולון', 'Holon', 'Center'),
('מודיעין', 'Modi\'in', 'Center'),
('נצרת', 'Nazareth', 'North'),
('עכו', 'Acre', 'North'),
('צפת', 'Safed', 'North'),
('אילת', 'Eilat', 'South');
```

### 2. Core Application Tables

#### 2.1 Authentication & User Management
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- 6-digit password hash
  user_role TEXT DEFAULT 'dealer' CHECK (user_role IN ('dealer', 'admin', 'support')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (dealer information)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  location_id INTEGER REFERENCES public.locations(id),
  trade_license_number TEXT,
  trade_license_file_url TEXT,
  tenure INTEGER DEFAULT 0, -- Years in business
  avg_response_time INTEGER, -- In minutes
  rating_tier TEXT DEFAULT 'bronze' CHECK (rating_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  subscription_type TEXT DEFAULT 'regular' CHECK (subscription_type IN ('regular', 'silver', 'unlimited')),
  subscription_valid_until DATE,
  available_boosts INTEGER DEFAULT 0,
  available_auctions INTEGER DEFAULT 0,
  vehicles_limit INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2.2 Vehicle Management
```sql
-- Vehicle listings table
CREATE TABLE public.vehicle_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  make_id INTEGER REFERENCES public.vehicle_makes(id),
  model_id INTEGER REFERENCES public.vehicle_models(id),
  sub_model TEXT, -- Vehicle type category: micro, mini, family, executive, suv, luxury, sport (from predefined constants in src/constants/vehicleTypes.ts)
  year INTEGER NOT NULL CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
  kilometers INTEGER CHECK (kilometers >= 0),
  transmission TEXT CHECK (transmission IN ('manual', 'automatic', 'semi_automatic')),
  fuel_type TEXT CHECK (fuel_type IN ('gasoline', 'diesel', 'hybrid', 'electric')),
  engine_size DECIMAL(3,1), -- Engine size in liters
  color TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  description TEXT,
  images TEXT[], -- Array of image URLs
  test_result_file_url TEXT,
  had_severe_crash BOOLEAN DEFAULT FALSE,
  previous_owners INTEGER DEFAULT 1,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'removed', 'pending')),
  is_boosted BOOLEAN DEFAULT FALSE,
  boosted_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle listing tags junction table
CREATE TABLE public.vehicle_listing_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicle_listings(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES public.vehicle_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vehicle_id, tag_id)
);
```

#### 2.3 Auction System
```sql
-- Auctions table
CREATE TABLE public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicle_listings(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  auction_type TEXT DEFAULT 'standard' CHECK (auction_type IN ('standard', 'reserve', 'buy_now')),
  starting_price DECIMAL(10,2) NOT NULL CHECK (starting_price > 0),
  reserve_price DECIMAL(10,2), -- Only for reserve auctions
  buy_now_price DECIMAL(10,2), -- Only for buy-now auctions
  current_highest_bid DECIMAL(10,2),
  highest_bidder_id UUID REFERENCES public.users(id),
  bid_count INTEGER DEFAULT 0,
  auction_start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  auction_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auction bids table
CREATE TABLE public.auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bid_amount DECIMAL(10,2) NOT NULL CHECK (bid_amount > 0),
  is_automatic BOOLEAN DEFAULT FALSE, -- For auto-bidding features
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2.4 ISO Requests & Offers System
```sql
-- ISO requests table (Vehicles Wanted)
CREATE TABLE public.iso_requests (
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

-- ISO request offers table (Responses to "Vehicles Wanted")
CREATE TABLE public.iso_request_offers (
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
```

#### 2.5 Communication System
```sql
-- Chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  participant_2_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicle_listings(id), -- Optional: related vehicle
  iso_request_id UUID REFERENCES public.iso_requests(id), -- Optional: related ISO request
  is_details_revealed BOOLEAN DEFAULT FALSE,
  details_revealed_by UUID REFERENCES public.users(id), -- Who revealed details first
  details_revealed_at TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id, vehicle_id),
  CHECK (participant_1_id != participant_2_id)
);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message_content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'contact_reveal', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2.6 Notifications System
```sql
-- User notifications table (mobile users only)
CREATE TABLE public.user_notifications (
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
  related_entity_type TEXT, -- 'vehicle', 'auction', 'iso_request', 'message', 'offer'
  related_entity_id UUID,
  action_url TEXT, -- Deep link for mobile navigation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin notifications table (admin users only)
CREATE TABLE public.admin_notifications (
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
  related_entity_type TEXT, -- 'user', 'vehicle', 'auction', 'ticket'
  related_entity_id UUID,
  assigned_to UUID REFERENCES public.users(id), -- Optional: specific admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2.7 Support System
```sql
-- Support tickets table
CREATE TABLE public.support_tickets (
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

-- Support ticket messages/comments
CREATE TABLE public.support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message_content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE, -- Internal admin/support communication
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Database Functions

### 1. User Profile Management
```sql
-- Function to create user profile after registration
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

-- Trigger for profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();
```

### 2. Notification Functions
```sql
-- Function to create user notification
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

-- Function to create admin notification
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
```

### 3. Count Functions
```sql
-- Get unread notification count for mobile users
CREATE OR REPLACE FUNCTION get_user_unread_notifications_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.user_notifications
    WHERE recipient_id = user_id AND is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get unread chat messages count for mobile users
CREATE OR REPLACE FUNCTION get_user_unread_messages_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.chat_messages m
    JOIN public.chat_conversations c ON m.conversation_id = c.id
    WHERE (c.participant_1_id = user_id OR c.participant_2_id = user_id)
    AND m.sender_id != user_id
    AND m.is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get unread admin notifications count
CREATE OR REPLACE FUNCTION get_admin_unread_notifications_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.admin_notifications
    WHERE is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. Business Logic Functions
```sql
-- Function to match ISO requests with new vehicles
CREATE OR REPLACE FUNCTION check_iso_matches_for_vehicle(vehicle_id UUID)
RETURNS VOID AS $$
DECLARE
  vehicle_record RECORD;
  iso_record RECORD;
BEGIN
  -- Get vehicle details
  SELECT v.*, vm.make_id, vm.id as model_id
  INTO vehicle_record
  FROM public.vehicle_listings v
  JOIN public.vehicle_models vm ON v.model_id = vm.id
  WHERE v.id = vehicle_id;
  
  -- Find matching ISO requests
  FOR iso_record IN
    SELECT ir.*, up.full_name as requester_name
    FROM public.iso_requests ir
    JOIN public.user_profiles up ON ir.requester_id = up.id
    WHERE ir.status = 'active'
    AND (ir.make_id IS NULL OR ir.make_id = vehicle_record.make_id)
    AND (ir.model_id IS NULL OR ir.model_id = vehicle_record.model_id)
    AND (ir.year_from IS NULL OR vehicle_record.year >= ir.year_from)
    AND (ir.year_to IS NULL OR vehicle_record.year <= ir.year_to)
    AND (ir.price_from IS NULL OR vehicle_record.price >= ir.price_from)
    AND (ir.price_to IS NULL OR vehicle_record.price <= ir.price_to)
    AND (ir.max_kilometers IS NULL OR vehicle_record.kilometers <= ir.max_kilometers)
    AND ir.requester_id != vehicle_record.owner_id -- Don't match own requests
  LOOP
    -- Notify ISO request owner
    PERFORM create_user_notification(
      iso_record.requester_id,
      'iso_match',
      'התאמה חדשה למבוקש שלך',
      'נמצא רכב שמתאים לבקשה שלך: "' || iso_record.title || '"',
      'vehicle',
      vehicle_id,
      '/mobile/vehicle/' || vehicle_id
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to check matches when new vehicle is added
CREATE OR REPLACE FUNCTION trigger_iso_matches()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM check_iso_matches_for_vehicle(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_vehicle_listing_created
  AFTER INSERT ON public.vehicle_listings
  FOR EACH ROW EXECUTE FUNCTION trigger_iso_matches();
```

### 5. Auto-notification Triggers
```sql
-- Trigger for new user registration (notify admins)
CREATE OR REPLACE FUNCTION notify_admin_new_user()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_admin_notification(
    'new_user_registration',
    'משתמש חדש נרשם למערכת',
    'משתמש חדש "' || COALESCE(NEW.business_name, NEW.full_name) || '" נרשם למערכת וממתין לאישור',
    'medium',
    'user',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION notify_admin_new_user();

-- Trigger for auction bids
CREATE OR REPLACE FUNCTION notify_auction_bid()
RETURNS TRIGGER AS $$
DECLARE
  auction_record RECORD;
  vehicle_record RECORD;
BEGIN
  -- Get auction and vehicle details
  SELECT a.*, v.make_id, v.model_id, vm.name_hebrew as make_name, vmo.name_hebrew as model_name
  INTO auction_record
  FROM public.auctions a
  JOIN public.vehicle_listings v ON a.vehicle_id = v.id
  JOIN public.vehicle_models vmo ON v.model_id = vmo.id
  JOIN public.vehicle_makes vm ON vmo.make_id = vm.id
  WHERE a.id = NEW.auction_id;
  
  -- Notify auction creator
  PERFORM create_user_notification(
    auction_record.creator_id,
    'auction_bid_received',
    'הצעה חדשה במכירה פומבית',
    'הצעה של ' || NEW.bid_amount::TEXT || ' ₪ התקבלה על ' || auction_record.make_name || ' ' || auction_record.model_name,
    'auction',
    NEW.auction_id,
    '/mobile/auction/' || NEW.auction_id
  );
  
  -- Notify previous highest bidder if outbid
  IF auction_record.highest_bidder_id IS NOT NULL AND auction_record.highest_bidder_id != NEW.bidder_id THEN
    PERFORM create_user_notification(
      auction_record.highest_bidder_id,
      'auction_outbid',
      'הוצאת מההצעה הגבוהה',
      'הצעה גבוהה יותר הוגשה על ' || auction_record.make_name || ' ' || auction_record.model_name,
      'auction',
      NEW.auction_id,
      '/mobile/auction/' || NEW.auction_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auction_bid_created
  AFTER INSERT ON public.auction_bids
  FOR EACH ROW EXECUTE FUNCTION notify_auction_bid();

-- Trigger for ISO request offers
CREATE OR REPLACE FUNCTION notify_iso_offer()
RETURNS TRIGGER AS $$
DECLARE
  iso_record RECORD;
  vehicle_record RECORD;
  offerer_name TEXT;
BEGIN
  -- Get ISO request details
  SELECT ir.title, ir.requester_id
  INTO iso_record
  FROM public.iso_requests ir
  WHERE ir.id = NEW.iso_request_id;
  
  -- Get vehicle and offerer details
  SELECT v.*, vm.name_hebrew as make_name, vmo.name_hebrew as model_name, up.full_name
  INTO vehicle_record
  FROM public.vehicle_listings v
  JOIN public.vehicle_models vmo ON v.model_id = vmo.id
  JOIN public.vehicle_makes vm ON vmo.make_id = vm.id
  JOIN public.user_profiles up ON NEW.offerer_id = up.id
  WHERE v.id = NEW.vehicle_id;
  
  -- Notify ISO request owner
  PERFORM create_user_notification(
    iso_record.requester_id,
    'iso_offer_received',
    'הצעה חדשה למבוקש שלך',
    'התקבלה הצעה על ' || vehicle_record.make_name || ' ' || vehicle_record.model_name || ' במחיר ' || NEW.offered_price::TEXT || ' ₪',
    'offer',
    NEW.id,
    '/mobile/iso-request/' || NEW.iso_request_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_iso_offer_created
  AFTER INSERT ON public.iso_request_offers
  FOR EACH ROW EXECUTE FUNCTION notify_iso_offer();
```

## Row Level Security (RLS) Policies

### 1. Enable RLS on All Tables
```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_listing_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iso_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iso_request_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;
```

### 2. User Access Policies
```sql
-- Users can see their own profile and active approved users
CREATE POLICY "Users can view profiles" ON public.user_profiles
  FOR SELECT USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() AND u.status = 'active'
    )
  );

-- Users can update only their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (id = auth.uid());

-- Users see their own notifications
CREATE POLICY "Users see own notifications" ON public.user_notifications
  FOR SELECT USING (recipient_id = auth.uid());

-- Users can mark their notifications as read
CREATE POLICY "Users update own notifications" ON public.user_notifications
  FOR UPDATE USING (recipient_id = auth.uid());
```

### 3. Admin Access Policies
```sql
-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND user_role IN ('admin', 'support')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admins see admin notifications
CREATE POLICY "Admins see admin notifications" ON public.admin_notifications
  FOR ALL USING (is_admin(auth.uid()));

-- Admins have full access to support tickets
CREATE POLICY "Admins access support tickets" ON public.support_tickets
  FOR ALL USING (is_admin(auth.uid()));
```

### 4. Vehicle and Auction Policies
```sql
-- Active users can see available vehicles
CREATE POLICY "Users see available vehicles" ON public.vehicle_listings
  FOR SELECT USING (
    status = 'available' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND status = 'active')
  );

-- Users can manage their own vehicles
CREATE POLICY "Users manage own vehicles" ON public.vehicle_listings
  FOR ALL USING (owner_id = auth.uid());

-- Active users can see active auctions
CREATE POLICY "Users see auctions" ON public.auctions
  FOR SELECT USING (
    status IN ('scheduled', 'active') AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND status = 'active')
  );

-- Users can create auctions for their vehicles
CREATE POLICY "Users create auctions" ON public.auctions
  FOR INSERT WITH CHECK (creator_id = auth.uid());
```

## Indexes for Performance

### 1. Search and Filter Indexes
```sql
-- Vehicle search indexes
CREATE INDEX idx_vehicle_listings_make_model ON public.vehicle_listings(make_id, model_id);
CREATE INDEX idx_vehicle_listings_price ON public.vehicle_listings(price) WHERE status = 'available';
CREATE INDEX idx_vehicle_listings_year ON public.vehicle_listings(year) WHERE status = 'available';
CREATE INDEX idx_vehicle_listings_boosted ON public.vehicle_listings(is_boosted, boosted_until) WHERE status = 'available';

-- Notification indexes
CREATE INDEX idx_user_notifications_recipient_unread ON public.user_notifications(recipient_id, is_read);
CREATE INDEX idx_admin_notifications_unread ON public.admin_notifications(is_read, created_at);

-- Chat indexes
CREATE INDEX idx_chat_messages_conversation_time ON public.chat_messages(conversation_id, created_at);
CREATE INDEX idx_chat_conversations_participants ON public.chat_conversations(participant_1_id, participant_2_id);

-- Auction indexes
CREATE INDEX idx_auctions_status_end_time ON public.auctions(status, auction_end_time);
CREATE INDEX idx_auction_bids_auction_time ON public.auction_bids(auction_id, created_at DESC);
```

## Real-time Subscriptions Setup

### 1. Enable Real-time for Tables
```sql
-- Enable real-time for notification tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.auction_bids;

-- Set replica identity for real-time updates
ALTER TABLE public.user_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.admin_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.auction_bids REPLICA IDENTITY FULL;
```

## Implementation Priority

### Phase 1: Core Setup
1. Create lookup tables (makes, models, tags, locations)
2. Create user authentication and profile tables
3. Set up basic RLS policies
4. Implement notification system

### Phase 2: Vehicle & Auction System
1. Create vehicle listing tables and relationships
2. Implement auction system with bidding
3. Add ISO request and offer system
4. Set up auto-notification triggers

### Phase 3: Communication & Support
1. Implement chat system
2. Create support ticket system
3. Add real-time subscriptions
4. Optimize with proper indexes

### Phase 4: Advanced Features
1. Add business logic functions (matching, ratings)
2. Implement subscription management
3. Add analytics and reporting functions
4. Performance optimization and monitoring

This comprehensive schema provides a solid foundation for the Auto-Hub B2B marketplace with proper separation of concerns, security, and scalability considerations.