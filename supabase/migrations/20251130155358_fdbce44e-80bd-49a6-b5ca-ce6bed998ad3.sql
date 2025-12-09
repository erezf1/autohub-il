-- ============================================
-- Private Users Module - Database Migration
-- ============================================

-- 1. Add 'private' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'private';

-- 2. Create private_users table
CREATE TABLE IF NOT EXISTS public.private_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  location_id INTEGER REFERENCES public.locations(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.private_users ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_private_users_phone ON public.private_users(phone_number);
CREATE INDEX IF NOT EXISTS idx_private_users_status ON public.private_users(status);

-- 3. Update vehicle_listings table
ALTER TABLE public.vehicle_listings
ADD COLUMN IF NOT EXISTS is_private_listing BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS private_user_id UUID REFERENCES public.private_users(id) ON DELETE CASCADE;

-- Add constraint: Either dealer OR private owner (not both)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'vehicle_owner_check'
  ) THEN
    ALTER TABLE public.vehicle_listings
    ADD CONSTRAINT vehicle_owner_check 
    CHECK (
      (owner_id IS NOT NULL AND private_user_id IS NULL) OR
      (owner_id IS NULL AND private_user_id IS NOT NULL)
    );
  END IF;
END $$;

-- Create index for private listings
CREATE INDEX IF NOT EXISTS idx_vehicle_listings_private 
ON public.vehicle_listings(is_private_listing, private_user_id)
WHERE is_private_listing = TRUE;

-- 4. RLS Policies for private_users table

-- Private users can view their own profile
CREATE POLICY "Private users view own profile"
ON public.private_users FOR SELECT
USING (id = auth.uid());

-- Private users can update their own profile
CREATE POLICY "Private users update own profile"
ON public.private_users FOR UPDATE
USING (id = auth.uid());

-- Admins can view all private users
CREATE POLICY "Admins view all private users"
ON public.private_users FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage all private users
CREATE POLICY "Admins manage private users"
ON public.private_users FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 5. RLS Policies for vehicle_listings (private listing support)

-- Private users can insert their own vehicles
CREATE POLICY "Private users insert own vehicles"
ON public.vehicle_listings FOR INSERT
WITH CHECK (
  private_user_id = auth.uid() AND
  is_private_listing = true AND
  EXISTS (
    SELECT 1 FROM public.private_users
    WHERE id = auth.uid() AND status = 'active'
  )
);

-- Private users can view their own vehicles
CREATE POLICY "Private users view own vehicles"
ON public.vehicle_listings FOR SELECT
USING (private_user_id = auth.uid());

-- Private users can update their own vehicles
CREATE POLICY "Private users update own vehicles"
ON public.vehicle_listings FOR UPDATE
USING (private_user_id = auth.uid());

-- Private users can delete their own vehicles
CREATE POLICY "Private users delete own vehicles"
ON public.vehicle_listings FOR DELETE
USING (private_user_id = auth.uid());

-- Active dealers can view available private listings
CREATE POLICY "Dealers view private listings"
ON public.vehicle_listings FOR SELECT
USING (
  is_private_listing = true AND
  status = 'available' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND status = 'active'
  )
);

-- 6. Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_private_users_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger on private_users table
DROP TRIGGER IF EXISTS update_private_users_updated_at_trigger ON public.private_users;
CREATE TRIGGER update_private_users_updated_at_trigger
BEFORE UPDATE ON public.private_users
FOR EACH ROW
EXECUTE FUNCTION public.update_private_users_updated_at();

-- 7. Create function to auto-create private_user profile on auth signup
CREATE OR REPLACE FUNCTION public.create_private_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_phone TEXT;
  v_full_name TEXT;
  v_location_id INTEGER;
BEGIN
  -- Check if user has 'private' role in metadata
  IF NEW.raw_user_meta_data->>'user_type' = 'private' THEN
    -- Extract metadata
    v_phone := COALESCE(
      NEW.raw_user_meta_data->>'phone_number',
      NEW.phone,
      ''
    );
    
    -- Clean phone number (remove non-digits)
    v_phone := regexp_replace(v_phone, '[^0-9]', '', 'g');
    
    v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    v_location_id := (NEW.raw_user_meta_data->>'location_id')::INTEGER;
    
    -- Insert into private_users table
    INSERT INTO public.private_users (
      id, 
      phone_number,
      full_name, 
      location_id,
      status
    )
    VALUES (
      NEW.id,
      v_phone,
      v_full_name, 
      v_location_id,
      'pending'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      phone_number = EXCLUDED.phone_number,
      full_name = EXCLUDED.full_name,
      location_id = EXCLUDED.location_id;
    
    -- Assign 'private' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'private'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_private_auth_user_created ON auth.users;
CREATE TRIGGER on_private_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_private_user_profile();

-- 8. Create admin notification for new private user registration
CREATE OR REPLACE FUNCTION public.notify_admin_new_private_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM create_admin_notification(
    'private_user_verification_required',
    'משתמש פרטי חדש נרשם',
    'משתמש פרטי חדש "' || NEW.full_name || '" נרשם למערכת וממתין לאישור',
    'medium',
    'private_user',
    NEW.id
  );
  RETURN NEW;
END;
$$;

-- Create trigger for admin notification
DROP TRIGGER IF EXISTS notify_admin_new_private_user_trigger ON public.private_users;
CREATE TRIGGER notify_admin_new_private_user_trigger
AFTER INSERT ON public.private_users
FOR EACH ROW
WHEN (NEW.status = 'pending')
EXECUTE FUNCTION public.notify_admin_new_private_user();

-- 9. Create user notification when private user is approved
CREATE OR REPLACE FUNCTION public.notify_private_user_approved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'active' AND OLD.status = 'pending' THEN
    PERFORM create_user_notification(
      NEW.id,
      'registration_approved',
      'החשבון שלך אושר',
      'ברוך הבא! כעת תוכל להתחיל להעלות רכבים למכירה',
      'private_user',
      NEW.id,
      '/private/dashboard'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for user approval notification
DROP TRIGGER IF EXISTS notify_private_user_approved_trigger ON public.private_users;
CREATE TRIGGER notify_private_user_approved_trigger
AFTER UPDATE ON public.private_users
FOR EACH ROW
EXECUTE FUNCTION public.notify_private_user_approved();