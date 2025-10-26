-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id TEXT PRIMARY KEY CHECK (id IN ('regular', 'gold', 'vip')),
  name_hebrew TEXT NOT NULL,
  name_english TEXT NOT NULL,
  max_vehicles INTEGER NOT NULL,
  monthly_boosts INTEGER NOT NULL,
  monthly_auctions INTEGER NOT NULL,
  price_monthly DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view plans"
ON public.subscription_plans FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage plans"
ON public.subscription_plans FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Insert default plans
INSERT INTO public.subscription_plans (id, name_hebrew, name_english, max_vehicles, monthly_boosts, monthly_auctions, price_monthly) VALUES
('regular', 'רגיל', 'Regular', 10, 0, 0, 0),
('gold', 'זהב', 'Gold', 25, 5, 3, 299),
('vip', 'VIP', 'VIP', 100, 15, 10, 799);

-- Update user_profiles constraint
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_subscription_type_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_subscription_type_check 
CHECK (subscription_type IN ('regular', 'gold', 'vip'));

-- Migrate existing subscription data
UPDATE public.user_profiles 
SET subscription_type = 'gold' 
WHERE subscription_type IN ('silver', 'premium');

UPDATE public.user_profiles 
SET subscription_type = 'vip' 
WHERE subscription_type = 'unlimited';