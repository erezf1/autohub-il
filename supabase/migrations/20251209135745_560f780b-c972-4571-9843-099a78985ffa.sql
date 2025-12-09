-- Fix: Private users should be 'active' immediately after OTP verification
-- Update the create_private_user_profile function to set status = 'active'
CREATE OR REPLACE FUNCTION public.create_private_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
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
    
    -- Insert into private_users table with 'active' status (no approval required)
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
      'active'  -- Private users are active immediately after OTP verification
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      phone_number = EXCLUDED.phone_number,
      full_name = EXCLUDED.full_name,
      location_id = EXCLUDED.location_id,
      status = 'active';
    
    -- Assign 'private' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'private'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update all existing pending private users to active
UPDATE public.private_users SET status = 'active' WHERE status = 'pending';