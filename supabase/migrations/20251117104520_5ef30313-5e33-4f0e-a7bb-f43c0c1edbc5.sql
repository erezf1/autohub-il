-- Create function to sync user limits when subscription type changes
CREATE OR REPLACE FUNCTION public.sync_user_limits_on_subscription_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  plan_limits RECORD;
BEGIN
  -- Only proceed if subscription_type actually changed
  IF NEW.subscription_type IS DISTINCT FROM OLD.subscription_type THEN
    -- Fetch the new plan's limits
    SELECT max_vehicles, monthly_boosts, monthly_auctions
    INTO plan_limits
    FROM public.subscription_plans
    WHERE id = NEW.subscription_type;
    
    -- Update the user's limits if plan found
    IF plan_limits IS NOT NULL THEN
      NEW.vehicles_limit := plan_limits.max_vehicles;
      NEW.available_boosts := plan_limits.monthly_boosts;
      NEW.available_auctions := plan_limits.monthly_auctions;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically sync limits before profile update
CREATE TRIGGER sync_limits_before_update
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_limits_on_subscription_change();