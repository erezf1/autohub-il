-- Phase 1: Fix get_remaining_boosts function to use subscription_plans table
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
  
  -- Count boost activations this month (any vehicle that was boosted this month)
  SELECT COUNT(*) INTO used_this_month
  FROM public.vehicle_listings
  WHERE owner_id = user_id
    AND boosted_until >= date_trunc('month', CURRENT_DATE)
    AND boosted_until IS NOT NULL;
  
  -- Return remaining boosts (can't be negative)
  RETURN GREATEST(0, monthly_allocation - used_this_month);
END;
$function$;

-- Phase 5: Add foreign key constraint from user_profiles to subscription_plans
ALTER TABLE public.user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_subscription_type_fkey;

ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_subscription_type_fkey
FOREIGN KEY (subscription_type) 
REFERENCES public.subscription_plans(id)
ON DELETE RESTRICT;