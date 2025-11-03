-- Phase 1: Database Foundation - Fix existing data and update constraints

-- Step 1: Drop existing constraints temporarily
ALTER TABLE public.user_notifications 
DROP CONSTRAINT IF EXISTS user_notifications_notification_type_check;

ALTER TABLE public.admin_notifications 
DROP CONSTRAINT IF EXISTS admin_notifications_notification_type_check;

-- Step 2: Update existing admin notifications to match new spec
UPDATE public.admin_notifications 
SET notification_type = 'user_verification_required'
WHERE notification_type = 'new_user_registration';

-- Step 3: Add new constraints with updated types
ALTER TABLE public.user_notifications
ADD CONSTRAINT user_notifications_notification_type_check 
CHECK (notification_type IN (
  'registration_approved',
  'registration_rejected',
  'account_suspended',
  'subscription_expiring',
  'auction_outbid',
  'auction_won',
  'auction_ending_soon',
  'iso_offer_received',
  'contact_details_requested',
  'contact_details_revealed',
  'vehicle_deleted'
));

ALTER TABLE public.admin_notifications
ADD CONSTRAINT admin_notifications_notification_type_check 
CHECK (notification_type IN (
  'user_verification_required',
  'user_password_reset',
  'new_vehicle_listing',
  'vehicle_reported',
  'auction_created',
  'auction_completed',
  'auction_dispute',
  'user_report',
  'high_priority_ticket',
  'payment_failed',
  'system_alert',
  'data_export_ready'
));

-- Step 4: Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_recipient 
ON public.user_notifications(recipient_id);

CREATE INDEX IF NOT EXISTS idx_user_notifications_unread 
ON public.user_notifications(recipient_id, is_read) 
WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_user_notifications_created 
ON public.user_notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_notifications_type 
ON public.user_notifications(notification_type);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_unread 
ON public.admin_notifications(is_read) 
WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_admin_notifications_priority 
ON public.admin_notifications(priority, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_assigned 
ON public.admin_notifications(assigned_to) 
WHERE assigned_to IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_admin_notifications_type 
ON public.admin_notifications(notification_type);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_created 
ON public.admin_notifications(created_at DESC);

-- Step 5: Real-time is already enabled for both tables (no action needed)