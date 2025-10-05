-- Phase 1: Update database schema for phone-only authentication

-- Remove password_hash column from users table (passwords are in auth.users)
ALTER TABLE public.users DROP COLUMN IF EXISTS password_hash;

-- Ensure phone_number is properly indexed and unique
CREATE UNIQUE INDEX IF NOT EXISTS users_phone_number_unique ON public.users(phone_number);

-- Update create_user_profile function to handle phone properly
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  v_phone TEXT;
  v_full_name TEXT;
  v_business_name TEXT;
BEGIN
  -- Extract phone from metadata or use auth phone
  v_phone := COALESCE(
    NEW.raw_user_meta_data->>'phone_number',
    NEW.phone,
    ''
  );
  
  -- Clean phone number (remove all non-digits)
  v_phone := regexp_replace(v_phone, '[^0-9]', '', 'g');
  
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  v_business_name := COALESCE(NEW.raw_user_meta_data->>'business_name', '');
  
  -- Insert into users table with cleaned phone
  INSERT INTO public.users (id, phone_number)
  VALUES (NEW.id, v_phone)
  ON CONFLICT (id) DO UPDATE
  SET phone_number = EXCLUDED.phone_number;
  
  -- Insert into user_profiles
  INSERT INTO public.user_profiles (id, full_name, business_name)
  VALUES (NEW.id, v_full_name, v_business_name)
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    business_name = EXCLUDED.business_name;
  
  -- Insert default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'dealer'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$function$;