
-- Fix the get_remaining_boosts function to correctly count activations this month
-- The issue: it was counting boosts that EXPIRE this month, not boosts ACTIVATED this month
-- Since boosts are 5 days long, we calculate activation date as boosted_until - 5 days

CREATE OR REPLACE FUNCTION public.get_remaining_boosts(user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  monthly_allocation INTEGER;
  used_this_month INTEGER;
  user_subscription_type TEXT;
BEGIN
  -- Get user's subscription type
  SELECT up.subscription_type INTO user_subscription_type
  FROM public.user_profiles up
  WHERE up.id = user_id;
  
  -- Get monthly allocation from subscription_plans table
  SELECT sp.monthly_boosts INTO monthly_allocation
  FROM public.subscription_plans sp
  WHERE sp.id = user_subscription_type;
  
  -- If no plan found, default to 0
  IF monthly_allocation IS NULL THEN
    monthly_allocation := 0;
  END IF;
  
  -- Count boost activations this month
  -- Calculate activation date as boosted_until - 5 days (boost duration)
  -- Check if activation date is in current month
  SELECT COUNT(*) INTO used_this_month
  FROM public.vehicle_listings
  WHERE owner_id = user_id
    AND boosted_until IS NOT NULL
    AND (boosted_until - INTERVAL '5 days') >= date_trunc('month', CURRENT_DATE)
    AND (boosted_until - INTERVAL '5 days') < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month';
  
  -- Return remaining boosts (can't be negative)
  RETURN GREATEST(0, monthly_allocation - used_this_month);
END;
$function$;
