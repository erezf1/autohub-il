-- Add business_description and profile_picture_url to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS business_description TEXT,
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Create storage buckets for profile pictures and dealer documents
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('profile-pictures', 'profile-pictures', true),
  ('dealer-documents', 'dealer-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for profile-pictures bucket
CREATE POLICY "Users can upload own profile picture"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view profile pictures"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can update own profile picture"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own profile picture"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policies for dealer-documents bucket
CREATE POLICY "Users can upload own dealer documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dealer-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own dealer documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'dealer-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all dealer documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'dealer-documents' AND
  is_admin(auth.uid())
);

CREATE POLICY "Users can update own dealer documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dealer-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Update create_user_profile function to handle new fields
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
  v_location_id INTEGER;
  v_business_description TEXT;
  v_trade_license_url TEXT;
  v_profile_picture_url TEXT;
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
  v_location_id := (NEW.raw_user_meta_data->>'location_id')::INTEGER;
  v_business_description := COALESCE(NEW.raw_user_meta_data->>'business_description', '');
  v_trade_license_url := COALESCE(NEW.raw_user_meta_data->>'trade_license_file_url', '');
  v_profile_picture_url := COALESCE(NEW.raw_user_meta_data->>'profile_picture_url', '');
  
  -- Insert into users table with cleaned phone
  INSERT INTO public.users (id, phone_number)
  VALUES (NEW.id, v_phone)
  ON CONFLICT (id) DO UPDATE
  SET phone_number = EXCLUDED.phone_number;
  
  -- Insert into user_profiles with all fields
  INSERT INTO public.user_profiles (
    id, 
    full_name, 
    business_name, 
    location_id,
    business_description,
    trade_license_file_url,
    profile_picture_url
  )
  VALUES (
    NEW.id, 
    v_full_name, 
    v_business_name, 
    v_location_id,
    v_business_description,
    v_trade_license_url,
    v_profile_picture_url
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    business_name = EXCLUDED.business_name,
    location_id = EXCLUDED.location_id,
    business_description = EXCLUDED.business_description,
    trade_license_file_url = EXCLUDED.trade_license_file_url,
    profile_picture_url = EXCLUDED.profile_picture_url;
  
  -- Insert default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'dealer'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$function$;