-- Create function to get users statistics
CREATE OR REPLACE FUNCTION public.get_users_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  total_count INTEGER;
  new_count INTEGER;
  pending_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM public.users;
  
  SELECT COUNT(*) INTO new_count 
  FROM public.users 
  WHERE created_at >= NOW() - INTERVAL '7 days';
  
  SELECT COUNT(*) INTO pending_count 
  FROM public.users 
  WHERE status = 'pending';
  
  RETURN json_build_object(
    'total', total_count,
    'new', new_count,
    'pending', pending_count
  );
END;
$function$;

-- Create function to get vehicles statistics
CREATE OR REPLACE FUNCTION public.get_vehicles_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  total_count INTEGER;
  new_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count 
  FROM public.vehicle_listings 
  WHERE status = 'available';
  
  SELECT COUNT(*) INTO new_count 
  FROM public.vehicle_listings 
  WHERE status = 'available' 
  AND created_at >= NOW() - INTERVAL '7 days';
  
  RETURN json_build_object(
    'total', total_count,
    'new', new_count
  );
END;
$function$;

-- Create function to get auctions statistics
CREATE OR REPLACE FUNCTION public.get_auctions_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  total_count INTEGER;
  new_count INTEGER;
  active_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM public.auctions;
  
  SELECT COUNT(*) INTO new_count 
  FROM public.auctions 
  WHERE created_at >= NOW() - INTERVAL '7 days';
  
  SELECT COUNT(*) INTO active_count 
  FROM public.auctions 
  WHERE status IN ('scheduled', 'active');
  
  RETURN json_build_object(
    'total', total_count,
    'new', new_count,
    'active', active_count
  );
END;
$function$;

-- Create function to get support tickets statistics
CREATE OR REPLACE FUNCTION public.get_support_tickets_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  total_count INTEGER;
  new_count INTEGER;
  pending_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM public.support_tickets;
  
  SELECT COUNT(*) INTO new_count 
  FROM public.support_tickets 
  WHERE created_at >= NOW() - INTERVAL '7 days';
  
  SELECT COUNT(*) INTO pending_count 
  FROM public.support_tickets 
  WHERE status = 'open';
  
  RETURN json_build_object(
    'total', total_count,
    'new', new_count,
    'pending', pending_count
  );
END;
$function$;

-- Create function to get boosted vehicles statistics
CREATE OR REPLACE FUNCTION public.get_boosted_vehicles_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  total_count INTEGER;
  new_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count 
  FROM public.vehicle_listings 
  WHERE is_boosted = true 
  AND boosted_until > NOW();
  
  SELECT COUNT(*) INTO new_count 
  FROM public.vehicle_listings 
  WHERE is_boosted = true 
  AND boosted_until > NOW()
  AND (boosted_until - INTERVAL '5 days') >= NOW() - INTERVAL '7 days';
  
  RETURN json_build_object(
    'total', total_count,
    'new', new_count
  );
END;
$function$;