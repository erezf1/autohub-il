-- Fix notify_admin_new_user to use correct notification type
CREATE OR REPLACE FUNCTION public.notify_admin_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM create_admin_notification(
    'user_verification_required',
    'משתמש חדש נרשם',
    'משתמש חדש "' || COALESCE(NEW.business_name, NEW.full_name) || '" נרשם למערכת וממתין לאישור',
    'medium',
    'user',
    NEW.id
  );
  RETURN NEW;
END;
$$;