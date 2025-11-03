-- Phase 2: Database Triggers - Create triggers for automatic notifications

-- ========================================
-- TRIGGER 1: User Registration Approved
-- ========================================
CREATE OR REPLACE FUNCTION notify_user_registration_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND OLD.status = 'pending' THEN
    PERFORM create_user_notification(
      NEW.id,
      'registration_approved',
      'החשבון שלך אושר',
      'ברוך הבא ל-Auto Hub! כעת תוכל להתחיל להשתמש בכל התכונות של הפלטפורמה',
      'user',
      NEW.id,
      '/mobile/dashboard'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_user_registration_approved ON public.users;
CREATE TRIGGER trigger_user_registration_approved
AFTER UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION notify_user_registration_approved();

-- ========================================
-- TRIGGER 2: User Registration Rejected
-- ========================================
CREATE OR REPLACE FUNCTION notify_user_registration_rejected()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
    PERFORM create_user_notification(
      NEW.id,
      'registration_rejected',
      'החשבון שלך לא אושר',
      'מצטערים, לא הצלחנו לאמת את המסמכים שלך. אנא פנה לתמיכה לפרטים נוספים',
      'user',
      NEW.id,
      NULL
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_user_registration_rejected ON public.users;
CREATE TRIGGER trigger_user_registration_rejected
AFTER UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION notify_user_registration_rejected();

-- ========================================
-- TRIGGER 3: Account Suspended
-- ========================================
CREATE OR REPLACE FUNCTION notify_user_account_suspended()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'suspended' AND OLD.status = 'active' THEN
    PERFORM create_user_notification(
      NEW.id,
      'account_suspended',
      'החשבון שלך הושעה',
      'החשבון שלך הושעה זמנית. אנא צור קשר עם התמיכה לפרטים נוספים',
      'user',
      NEW.id,
      NULL
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_user_account_suspended ON public.users;
CREATE TRIGGER trigger_user_account_suspended
AFTER UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION notify_user_account_suspended();

-- ========================================
-- TRIGGER 4: Auction Outbid
-- ========================================
CREATE OR REPLACE FUNCTION notify_auction_outbid()
RETURNS TRIGGER AS $$
DECLARE
  previous_bidder_id UUID;
  auction_vehicle_id UUID;
BEGIN
  -- Get the previous highest bidder (before this new bid)
  SELECT highest_bidder_id, vehicle_id 
  INTO previous_bidder_id, auction_vehicle_id
  FROM public.auctions 
  WHERE id = NEW.auction_id;
  
  -- Only notify if there was a previous bidder and it's not the same person
  IF previous_bidder_id IS NOT NULL AND previous_bidder_id != NEW.bidder_id THEN
    PERFORM create_user_notification(
      previous_bidder_id,
      'auction_outbid',
      'הוצע מחיר גבוה יותר',
      'מישהו הציע מחיר גבוה יותר במכרז שהצעת בו. הגדל את ההצעה שלך כדי להישאר במשחק',
      'auction',
      NEW.auction_id,
      '/mobile/auction/' || NEW.auction_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auction_outbid ON public.auction_bids;
CREATE TRIGGER trigger_auction_outbid
AFTER INSERT ON public.auction_bids
FOR EACH ROW
EXECUTE FUNCTION notify_auction_outbid();

-- ========================================
-- TRIGGER 5: Auction Won
-- ========================================
CREATE OR REPLACE FUNCTION notify_auction_won()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.highest_bidder_id IS NOT NULL THEN
    PERFORM create_user_notification(
      NEW.highest_bidder_id,
      'auction_won',
      'זכית במכרז!',
      'מזל טוב! זכית במכרז. צור קשר עם המוכר כדי לסגור את העסקה',
      'auction',
      NEW.id,
      '/mobile/auction/' || NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auction_won ON public.auctions;
CREATE TRIGGER trigger_auction_won
AFTER UPDATE ON public.auctions
FOR EACH ROW
EXECUTE FUNCTION notify_auction_won();

-- ========================================
-- TRIGGER 6: ISO Offer Received
-- ========================================
CREATE OR REPLACE FUNCTION notify_iso_offer_received()
RETURNS TRIGGER AS $$
DECLARE
  requester_id UUID;
BEGIN
  -- Get the requester of the ISO request
  SELECT requester_id INTO requester_id
  FROM public.iso_requests
  WHERE id = NEW.iso_request_id;
  
  IF requester_id IS NOT NULL THEN
    PERFORM create_user_notification(
      requester_id,
      'iso_offer_received',
      'התקבלה הצעה חדשה',
      'סוחר הציע רכב שמתאים לדרישות שלך. לחץ כדי לראות את ההצעה',
      'iso_offer',
      NEW.id,
      '/mobile/iso-request/' || NEW.iso_request_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_iso_offer_received ON public.iso_request_offers;
CREATE TRIGGER trigger_iso_offer_received
AFTER INSERT ON public.iso_request_offers
FOR EACH ROW
EXECUTE FUNCTION notify_iso_offer_received();

-- ========================================
-- TRIGGER 7: Contact Details Requested
-- ========================================
CREATE OR REPLACE FUNCTION notify_contact_details_requested()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
BEGIN
  IF NEW.details_reveal_requested_by IS NOT NULL 
     AND OLD.details_reveal_requested_by IS NULL THEN
    
    -- Determine who should receive the notification
    -- It's the OTHER participant (not the one who requested)
    IF NEW.participant_1_id = NEW.details_reveal_requested_by THEN
      recipient_id := NEW.participant_2_id;
    ELSE
      recipient_id := NEW.participant_1_id;
    END IF;
    
    PERFORM create_user_notification(
      recipient_id,
      'contact_details_requested',
      'בקשה לחשיפת פרטי קשר',
      'סוחר ביקש לחשוף את פרטי הקשר שלכם. אשר את הבקשה כדי להמשיך',
      'conversation',
      NEW.id,
      '/mobile/chat/' || NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_contact_details_requested ON public.chat_conversations;
CREATE TRIGGER trigger_contact_details_requested
AFTER UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION notify_contact_details_requested();

-- ========================================
-- TRIGGER 8: Contact Details Revealed
-- ========================================
CREATE OR REPLACE FUNCTION notify_contact_details_revealed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_details_revealed = true 
     AND OLD.is_details_revealed = false 
     AND NEW.details_reveal_requested_by IS NOT NULL THEN
    
    -- Notify the person who REQUESTED the reveal
    PERFORM create_user_notification(
      NEW.details_reveal_requested_by,
      'contact_details_revealed',
      'פרטי הקשר נחשפו',
      'הסוחר אישר את חשיפת פרטי הקשר. כעת תוכל ליצור קשר ישירות',
      'conversation',
      NEW.id,
      '/mobile/chat/' || NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_contact_details_revealed ON public.chat_conversations;
CREATE TRIGGER trigger_contact_details_revealed
AFTER UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION notify_contact_details_revealed();

-- ========================================
-- TRIGGER 9: Vehicle Deleted (Admin Action)
-- ========================================
CREATE OR REPLACE FUNCTION notify_vehicle_deleted()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'available' AND NEW.status = 'deleted' THEN
    PERFORM create_user_notification(
      OLD.owner_id,
      'vehicle_deleted',
      'הרכב שלך הוסר',
      'הרכב שלך הוסר מהמערכת. לפרטים נוספים, פנה לתמיכה',
      'vehicle',
      OLD.id,
      NULL
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_vehicle_deleted ON public.vehicle_listings;
CREATE TRIGGER trigger_vehicle_deleted
AFTER UPDATE ON public.vehicle_listings
FOR EACH ROW
EXECUTE FUNCTION notify_vehicle_deleted();

-- ========================================
-- ADMIN TRIGGER 1: User Verification Required
-- ========================================
-- This already exists via the notify_admin_new_user trigger
-- No changes needed

-- ========================================
-- ADMIN TRIGGER 2: New Vehicle Listing
-- ========================================
CREATE OR REPLACE FUNCTION notify_admin_new_vehicle()
RETURNS TRIGGER AS $$
DECLARE
  owner_name TEXT;
BEGIN
  -- Get owner's business name
  SELECT business_name INTO owner_name
  FROM public.user_profiles
  WHERE id = NEW.owner_id;
  
  PERFORM create_admin_notification(
    'new_vehicle_listing',
    'רכב חדש נוסף',
    'רכב חדש נוסף למערכת על ידי ' || COALESCE(owner_name, 'סוחר'),
    'low',
    'vehicle',
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_admin_new_vehicle ON public.vehicle_listings;
CREATE TRIGGER trigger_admin_new_vehicle
AFTER INSERT ON public.vehicle_listings
FOR EACH ROW
EXECUTE FUNCTION notify_admin_new_vehicle();

-- ========================================
-- ADMIN TRIGGER 3: Auction Created
-- ========================================
CREATE OR REPLACE FUNCTION notify_admin_auction_created()
RETURNS TRIGGER AS $$
DECLARE
  creator_name TEXT;
BEGIN
  SELECT business_name INTO creator_name
  FROM public.user_profiles
  WHERE id = NEW.creator_id;
  
  PERFORM create_admin_notification(
    'auction_created',
    'מכרז חדש נוצר',
    'מכרז חדש נוצר על ידי ' || COALESCE(creator_name, 'סוחר'),
    'low',
    'auction',
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_admin_auction_created ON public.auctions;
CREATE TRIGGER trigger_admin_auction_created
AFTER INSERT ON public.auctions
FOR EACH ROW
EXECUTE FUNCTION notify_admin_auction_created();

-- ========================================
-- ADMIN TRIGGER 4: Auction Completed
-- ========================================
CREATE OR REPLACE FUNCTION notify_admin_auction_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    PERFORM create_admin_notification(
      'auction_completed',
      'מכרז הסתיים',
      'מכרז הסתיים עם ' || NEW.bid_count || ' הצעות',
      'low',
      'auction',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_admin_auction_completed ON public.auctions;
CREATE TRIGGER trigger_admin_auction_completed
AFTER UPDATE ON public.auctions
FOR EACH ROW
EXECUTE FUNCTION notify_admin_auction_completed();