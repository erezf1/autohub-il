-- Add subscription_expired to status check constraint
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_status_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_status_check 
CHECK (status IN ('pending', 'active', 'suspended', 'rejected', 'subscription_expired'));