-- Create function to calculate remaining boosts for current month
CREATE OR REPLACE FUNCTION public.get_remaining_boosts(user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  monthly_allocation INTEGER;
  used_this_month INTEGER;
  subscription_type TEXT;
BEGIN
  -- Get user's subscription type
  SELECT up.subscription_type INTO subscription_type
  FROM public.user_profiles up
  WHERE up.id = user_id;
  
  -- Determine monthly allocation based on subscription
  CASE subscription_type
    WHEN 'silver' THEN monthly_allocation := 5;
    WHEN 'unlimited' THEN monthly_allocation := 10;
    ELSE monthly_allocation := 0;
  END CASE;
  
  -- Count boosts used this month
  SELECT COUNT(*) INTO used_this_month
  FROM public.vehicle_listings
  WHERE owner_id = user_id
    AND is_boosted = true
    AND boosted_until >= date_trunc('month', CURRENT_DATE)
    AND boosted_until IS NOT NULL;
  
  -- Return remaining boosts (can't be negative)
  RETURN GREATEST(0, monthly_allocation - used_this_month);
END;
$$;