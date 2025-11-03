# Notification System Specification

## Overview
Auto-Hub implements a comprehensive notification system for both dealers (mobile) and admins (desktop). Notifications are stored in database tables and delivered in real-time via Supabase Realtime subscriptions.

---

## Status System Decision

### Simple Boolean System
We use a simple `is_read` boolean field to track notification status:
- **Unread (New)**: `is_read = false`, `read_at = NULL`
- **Read**: `is_read = true`, `read_at = <timestamp>`

### Transition Criteria: From "Unread" to "Read"
A notification is marked as read when:
1. **User clicks on the notification** → Navigate to target page + mark as read
2. **Manual "Mark as Read" action** → User explicitly marks it
3. **"Mark All as Read" button** → Bulk action on all unread notifications

### Why This Approach?
- **Simple**: Easy to implement and maintain
- **Clear Intent**: User action required (no auto-read on view)
- **Performance**: Boolean field is efficient for queries and indexes
- **Sufficient for MVP**: More complex statuses (dismissed, archived) can be added later if needed

---

## Database Schema

### Table: `user_notifications`
Stores notifications for dealers (mobile users).

```sql
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES public.users(id) NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Indexes:**
```sql
CREATE INDEX idx_user_notifications_recipient ON user_notifications(recipient_id);
CREATE INDEX idx_user_notifications_unread ON user_notifications(recipient_id, is_read) WHERE is_read = false;
CREATE INDEX idx_user_notifications_created ON user_notifications(created_at DESC);
```

**RLS Policies:**
- Users can SELECT their own notifications
- Users can UPDATE their own notifications (mark as read)
- Only system/triggers can INSERT

**Real-time:**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;
```

---

### Table: `admin_notifications`
Stores notifications for admins (desktop users).

```sql
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium', -- low, medium, high, critical
  related_entity_type TEXT,
  related_entity_id UUID,
  assigned_to UUID REFERENCES public.users(id),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Indexes:**
```sql
CREATE INDEX idx_admin_notifications_unread ON admin_notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_admin_notifications_priority ON admin_notifications(priority, created_at);
CREATE INDEX idx_admin_notifications_assigned ON admin_notifications(assigned_to);
```

**RLS Policies:**
- Admins can SELECT all admin notifications
- Admins can UPDATE admin notifications (mark as read, assign)
- Only system/triggers can INSERT

**Real-time:**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;
```

---

## Notification Types - Dealers (Mobile)

### 1. Registration Approved
**Type:** `registration_approved`  
**Trigger:** Admin approves user account (`users.status` = 'active')  
**Recipient:** The approved user  
**Priority:** Implicit HIGH  
**Message:**
- **Title (Hebrew):** `"חשבונך אושר! 🎉"`
- **Description (Hebrew):** `"כעת תוכל להתחיל להשתמש בפלטפורמה ולהעלות כלי רכב למכירה"`
**Action URL:** `/mobile/dashboard`  
**Related Entity:** `user` / `{user_id}`

---

### 2. Registration Rejected
**Type:** `registration_rejected`  
**Trigger:** Admin rejects user account (`users.status` = 'rejected')  
**Recipient:** The rejected user  
**Priority:** Implicit HIGH  
**Message:**
- **Title (Hebrew):** `"הרשמתך נדחתה"`
- **Description (Hebrew):** `"מצטערים, הבקשה שלך לא אושרה. ניתן לפנות לתמיכה לפרטים נוספים"`
**Action URL:** `/mobile/support` (if support page exists)  
**Related Entity:** `user` / `{user_id}`

---

### 3. Account Suspended
**Type:** `account_suspended`  
**Trigger:** Admin suspends user account (`users.status` = 'suspended')  
**Recipient:** The suspended user  
**Priority:** Implicit CRITICAL  
**Message:**
- **Title (Hebrew):** `"חשבונך הושעה זמנית"`
- **Description (Hebrew):** `"חשבונך הושעה בעקבות [REASON]. לפרטים נוספים צור קשר עם התמיכה"`
**Action URL:** `/mobile/support`  
**Related Entity:** `user` / `{user_id}`  
**Note:** `[REASON]` should be passed dynamically

---

### 4. Subscription Expiring
**Type:** `subscription_expiring`  
**Trigger:** Edge Function checks subscriptions expiring in 7 days  
**Recipient:** User with expiring subscription  
**Priority:** Implicit MEDIUM  
**Message:**
- **Title (Hebrew):** `"המנוי שלך עומד לפוג בעוד 7 ימים"`
- **Description (Hebrew):** `"חדש את המנוי שלך כדי להמשיך ליהנות מכל היתרונות"`
**Action URL:** `/mobile/subscription` (or profile settings)  
**Related Entity:** `user` / `{user_id}`

---

### 5. Auction Outbid
**Type:** `auction_outbid`  
**Trigger:** New bid placed on auction where user was previous highest bidder  
**Recipient:** Previous highest bidder  
**Priority:** Implicit MEDIUM  
**Message:**
- **Title (Hebrew):** `"הצעתך עוברה במכרז"`
- **Description (Hebrew):** `"הצעה חדשה נרשמה במכרז ל[VEHICLE_MAKE] [VEHICLE_MODEL]. הצע מחיר גבוה יותר כדי לזכות"`
**Action URL:** `/mobile/auction/{auction_id}`  
**Related Entity:** `auction` / `{auction_id}`  
**Note:** `[VEHICLE_MAKE]` and `[VEHICLE_MODEL]` should be dynamically inserted

---

### 6. Auction Won
**Type:** `auction_won`  
**Trigger:** Auction ends and user is highest bidder (`auctions.status` = 'completed')  
**Recipient:** Winning bidder  
**Priority:** Implicit HIGH  
**Message:**
- **Title (Hebrew):** `"זכית במכרז! 🏆"`
- **Description (Hebrew):** `"מזל טוב! זכית במכרז ל[VEHICLE_MAKE] [VEHICLE_MODEL] בסך [BID_AMOUNT]₪"`
**Action URL:** `/mobile/auction/{auction_id}`  
**Related Entity:** `auction` / `{auction_id}`

---

### 7. Auction Ending Soon
**Type:** `auction_ending_soon`  
**Trigger:** Edge Function checks auctions ending in 1 hour (only for users with active bids)  
**Recipient:** All users with bids on the auction  
**Priority:** Implicit MEDIUM  
**Message:**
- **Title (Hebrew):** `"המכרז מסתיים בקרוב! ⏰"`
- **Description (Hebrew):** `"המכרז ל[VEHICLE_MAKE] [VEHICLE_MODEL] מסתיים בעוד שעה. הצעתך הנוכחית: [USER_BID]₪"`
**Action URL:** `/mobile/auction/{auction_id}`  
**Related Entity:** `auction` / `{auction_id}`

---

### 8. ISO Offer Received
**Type:** `iso_offer_received`  
**Trigger:** New offer submitted on user's ISO request (`iso_request_offers` INSERT)  
**Recipient:** ISO request creator  
**Priority:** Implicit MEDIUM  
**Message:**
- **Title (Hebrew):** `"קיבלת הצעה חדשה על בקשת הרכב שלך"`
- **Description (Hebrew):** `"דילר מעוניין הציע לך [VEHICLE_MAKE] [VEHICLE_MODEL] [VEHICLE_YEAR] ב-[OFFERED_PRICE]₪"`
**Action URL:** `/mobile/iso-request/{iso_request_id}`  
**Related Entity:** `iso_request` / `{iso_request_id}`

---

### 9. Contact Details Requested
**Type:** `contact_details_requested`  
**Trigger:** Other user requests contact reveal in chat (`chat_conversations.details_reveal_requested_by` updated)  
**Recipient:** The other participant in the conversation  
**Priority:** Implicit MEDIUM  
**Message:**
- **Title (Hebrew):** `"בקשה לחשיפת פרטי קשר"`
- **Description (Hebrew):** `"[REQUESTER_NAME] מבקש לקבל את פרטי הקשר שלך בנוגע ל[VEHICLE_MAKE] [VEHICLE_MODEL]"`
**Action URL:** `/mobile/chat/{conversation_id}`  
**Related Entity:** `conversation` / `{conversation_id}`

---

### 10. Contact Details Revealed
**Type:** `contact_details_revealed`  
**Trigger:** Contact reveal approved (`chat_conversations.is_details_revealed` = true)  
**Recipient:** The user who requested the reveal  
**Priority:** Implicit HIGH  
**Message:**
- **Title (Hebrew):** `"פרטי הקשר נחשפו! 📞"`
- **Description (Hebrew):** `"[REVEALER_NAME] אישר את חשיפת פרטי הקשר. כעת תוכל ליצור קשר ישיר"`
**Action URL:** `/mobile/chat/{conversation_id}`  
**Related Entity:** `conversation` / `{conversation_id}`

---

### 11. Vehicle Deleted
**Type:** `vehicle_deleted`  
**Trigger:** Vehicle removed from listing (admin action or user action)  
**Recipient:** Vehicle owner  
**Priority:** Implicit MEDIUM  
**Message:**
- **Title (Hebrew):** `"כלי רכב הוסר מהמערכת"`
- **Description (Hebrew):** `"[VEHICLE_MAKE] [VEHICLE_MODEL] [VEHICLE_YEAR] הוסר מהמערכת. [REASON]"`
**Action URL:** `/mobile/my-vehicles`  
**Related Entity:** `vehicle` / `{vehicle_id}` (if still accessible)  
**Note:** `[REASON]` should be provided (e.g., "בקשתך", "על ידי מנהל המערכת")

---

## Notification Types - Admins (Desktop)

### 1. User Verification Required
**Type:** `user_verification_required`  
**Trigger:** New user registers with trade license (`users` INSERT with status 'pending')  
**Recipient:** All admins  
**Priority:** `medium`  
**Message:**
- **Title (Hebrew):** `"משתמש חדש ממתין לאישור"`
- **Description (Hebrew):** `"[USER_NAME] ([BUSINESS_NAME]) נרשם למערכת וממתין לאימות רישיון עסק"`
**Admin Route:** `/admin/users/{user_id}`  
**Related Entity:** `user` / `{user_id}`

---

### 2. User Password Reset
**Type:** `user_password_reset`  
**Trigger:** User requests password reset  
**Recipient:** All admins  
**Priority:** `low`  
**Message:**
- **Title (Hebrew):** `"בקשה לאיפוס סיסמה"`
- **Description (Hebrew):** `"[USER_NAME] ביקש לאפס את הסיסמה. ודא שהבקשה לגיטימית"`
**Admin Route:** `/admin/users/{user_id}`  
**Related Entity:** `user` / `{user_id}`

---

### 3. New Vehicle Listing
**Type:** `new_vehicle_listing`  
**Trigger:** New vehicle added to platform (`vehicle_listings` INSERT)  
**Recipient:** All admins  
**Priority:** `low`  
**Message:**
- **Title (Hebrew):** `"רכב חדש נוסף למערכת"`
- **Description (Hebrew):** `"[USER_NAME] הוסיף [VEHICLE_MAKE] [VEHICLE_MODEL] [VEHICLE_YEAR] במחיר [PRICE]₪"`
**Admin Route:** `/admin/vehicles/{vehicle_id}`  
**Related Entity:** `vehicle` / `{vehicle_id}`

---

### 4. Vehicle Reported
**Type:** `vehicle_reported`  
**Trigger:** User reports a vehicle listing as suspicious/fraudulent  
**Recipient:** All admins  
**Priority:** `high`  
**Message:**
- **Title (Hebrew):** `"רכב דווח על ידי משתמש"`
- **Description (Hebrew):** `"[REPORTER_NAME] דיווח על [VEHICLE_MAKE] [VEHICLE_MODEL]. סיבה: [REPORT_REASON]"`
**Admin Route:** `/admin/vehicles/{vehicle_id}`  
**Related Entity:** `vehicle` / `{vehicle_id}`

---

### 5. Auction Created
**Type:** `auction_created`  
**Trigger:** New auction started (`auctions` INSERT)  
**Recipient:** All admins  
**Priority:** `low`  
**Message:**
- **Title (Hebrew):** `"מכרז חדש נוצר"`
- **Description (Hebrew):** `"[USER_NAME] פתח מכרז על [VEHICLE_MAKE] [VEHICLE_MODEL]. מחיר פתיחה: [STARTING_PRICE]₪"`
**Admin Route:** `/admin/auctions/{auction_id}`  
**Related Entity:** `auction` / `{auction_id}`

---

### 6. Auction Completed
**Type:** `auction_completed`  
**Trigger:** Auction ends (`auctions.status` = 'completed')  
**Recipient:** All admins  
**Priority:** `medium`  
**Message:**
- **Title (Hebrew):** `"מכרז הסתיים"`
- **Description (Hebrew):** `"מכרז ל[VEHICLE_MAKE] [VEHICLE_MODEL] הסתיים. הצעה זוכה: [WINNING_BID]₪ ([WINNER_NAME])"`
**Admin Route:** `/admin/auctions/{auction_id}`  
**Related Entity:** `auction` / `{auction_id}`

---

### 7. Auction Dispute
**Type:** `auction_dispute`  
**Trigger:** User reports dispute on auction result  
**Recipient:** All admins  
**Priority:** `high`  
**Message:**
- **Title (Hebrew):** `"מחלוקת על מכרז"`
- **Description (Hebrew):** `"[USER_NAME] דיווח על מחלוקת במכרז ל[VEHICLE_MAKE] [VEHICLE_MODEL]. סיבה: [DISPUTE_REASON]"`
**Admin Route:** `/admin/auctions/{auction_id}`  
**Related Entity:** `auction` / `{auction_id}`

---

### 8. User Report
**Type:** `user_report`  
**Trigger:** User submits complaint about another user (`support_tickets` INSERT with type 'user_report')  
**Recipient:** All admins  
**Priority:** `medium`  
**Message:**
- **Title (Hebrew):** `"דיווח על משתמש"`
- **Description (Hebrew):** `"[REPORTER_NAME] דיווח על [REPORTED_USER_NAME]. סיבה: [REPORT_REASON]"`
**Admin Route:** `/admin/support/{ticket_id}`  
**Related Entity:** `support_ticket` / `{ticket_id}`

---

### 9. High Priority Ticket
**Type:** `high_priority_ticket`  
**Trigger:** Support ticket marked as high priority  
**Recipient:** All admins  
**Priority:** `high`  
**Message:**
- **Title (Hebrew):** `"פנייה דחופה לתמיכה"`
- **Description (Hebrew):** `"[USER_NAME] פתח פנייה בעדיפות גבוהה: [TICKET_SUBJECT]"`
**Admin Route:** `/admin/support/{ticket_id}`  
**Related Entity:** `support_ticket` / `{ticket_id}`

---

### 10. Payment Failed
**Type:** `payment_failed`  
**Trigger:** Payment processing fails (subscription, auction payment, etc.)  
**Recipient:** All admins  
**Priority:** `high`  
**Message:**
- **Title (Hebrew):** `"תשלום נכשל"`
- **Description (Hebrew):** `"תשלום עבור [PAYMENT_TYPE] של [USER_NAME] נכשל. סכום: [AMOUNT]₪"`
**Admin Route:** `/admin/users/{user_id}`  
**Related Entity:** `user` / `{user_id}`

---

### 11. System Alert
**Type:** `system_alert`  
**Trigger:** Critical system issue detected (database, storage, API failures)  
**Recipient:** All admins  
**Priority:** `critical`  
**Message:**
- **Title (Hebrew):** `"⚠️ התראת מערכת קריטית"`
- **Description (Hebrew):** `"זוהתה בעיה במערכת: [ERROR_MESSAGE]. יש לטפל בהקדם"`
**Admin Route:** `/admin/settings` or `/admin/logs`  
**Related Entity:** `system` / `null`

---

### 12. Data Export Ready
**Type:** `data_export_ready`  
**Trigger:** Requested report/export completed  
**Recipient:** Admin who requested the export  
**Priority:** `low`  
**Message:**
- **Title (Hebrew):** `"הדוח מוכן להורדה"`
- **Description (Hebrew):** `"הדוח [REPORT_NAME] מוכן להורדה"`
**Admin Route:** `/admin/reports`  
**Related Entity:** `report` / `{report_id}`

---

## Helper Functions

### `create_user_notification()`
Creates a notification for a dealer user.

```sql
CREATE OR REPLACE FUNCTION public.create_user_notification(
  p_recipient_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_description TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_action_url TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.user_notifications (
    recipient_id, notification_type, title, description,
    related_entity_type, related_entity_id, action_url
  ) VALUES (
    p_recipient_id, p_type, p_title, p_description,
    p_entity_type, p_entity_id, p_action_url
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;
```

---

### `create_admin_notification()`
Creates a notification for admin users.

```sql
CREATE OR REPLACE FUNCTION public.create_admin_notification(
  p_type TEXT,
  p_title TEXT,
  p_description TEXT,
  p_priority TEXT DEFAULT 'medium',
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_assigned_to UUID DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.admin_notifications (
    notification_type, title, description, priority,
    related_entity_type, related_entity_id, assigned_to
  ) VALUES (
    p_type, p_title, p_description, p_priority,
    p_entity_type, p_entity_id, p_assigned_to
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;
```

---

### `get_unread_notifications_count()`
Gets unread notification count for a dealer user.

```sql
CREATE OR REPLACE FUNCTION public.get_unread_notifications_count(
  p_user_id UUID
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.user_notifications
    WHERE recipient_id = p_user_id AND is_read = FALSE
  );
END;
$$;
```

---

### `get_admin_unread_notifications_count()`
Gets unread notification count for admins.

```sql
CREATE OR REPLACE FUNCTION public.get_admin_unread_notifications_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.admin_notifications
    WHERE is_read = FALSE
  );
END;
$$;
```

---

## Notification Delivery Methods

### 1. Real-time via Supabase
- **Dealer Notifications**: Subscribe to `user_notifications` table filtered by `recipient_id`
- **Admin Notifications**: Subscribe to `admin_notifications` table (all admins see all)
- **Toast Notifications**: Show in-app toast when new notification arrives
- **Badge Updates**: Update unread count badge in real-time

### 2. Database Triggers
Automatic notification creation on database events:
- User status changes
- Auction events (new bid, auction ends)
- ISO offer submissions
- Vehicle deletions
- Chat contact reveal requests/approvals

### 3. Edge Functions
Complex logic and scheduled checks:
- **scheduled-notifications**: Check subscriptions expiring, auctions ending soon, boosts expired
- **support-notifications**: User reports, high priority tickets
- **payment-notifications**: Payment failures

### 4. Manual Creation
From admin interface:
- Custom notifications to specific users
- Broadcast announcements
- Marketing messages (future)

---

## Implementation Notes

### Marking Notifications as Read
- **On Click**: When user clicks notification → Navigate to target page + UPDATE `is_read=true`, `read_at=NOW()`
- **Manual Action**: "Mark as Read" button on individual notification
- **Bulk Action**: "Mark All as Read" button → UPDATE all unread notifications for user

### Real-time Badge Updates
- Subscribe to Supabase Realtime on notification table
- Listen for INSERT events (new notifications)
- Listen for UPDATE events (read status changes)
- Update badge count instantly without page refresh

### Notification Sorting
- **Default**: Sort by `created_at DESC` (newest first)
- **Admin**: Can sort by priority, type, date

### Pagination
- Load 50 notifications per page
- Implement "Load More" or infinite scroll
- Consider archiving notifications older than 90 days

### Navigation
- Each notification has `action_url` (dealers) or admin route (admins)
- Clicking notification navigates to relevant page
- If related entity deleted, show fallback message

---

## Testing Scenarios

### Dealer Notifications
1. ✅ Register new user → Admin approves → User receives `registration_approved`
2. ✅ Register new user → Admin rejects → User receives `registration_rejected`
3. ✅ Admin suspends user → User receives `account_suspended`
4. ✅ Subscription expires in 7 days → User receives `subscription_expiring`
5. ✅ User bids on auction → Another user bids higher → First user receives `auction_outbid`
6. ✅ Auction ends → Highest bidder receives `auction_won`
7. ✅ User has bid on auction → 1 hour before end → User receives `auction_ending_soon`
8. ✅ User creates ISO request → Another user offers vehicle → User receives `iso_offer_received`
9. ✅ User A requests contact reveal → User B receives `contact_details_requested`
10. ✅ User B approves contact reveal → User A receives `contact_details_revealed`
11. ✅ Admin deletes vehicle → Owner receives `vehicle_deleted`

### Admin Notifications
1. ✅ New user registers → Admins receive `user_verification_required`
2. ✅ User requests password reset → Admins receive `user_password_reset`
3. ✅ User adds vehicle → Admins receive `new_vehicle_listing`
4. ✅ User reports vehicle → Admins receive `vehicle_reported`
5. ✅ User creates auction → Admins receive `auction_created`
6. ✅ Auction ends → Admins receive `auction_completed`
7. ✅ User reports auction dispute → Admins receive `auction_dispute`
8. ✅ User reports another user → Admins receive `user_report`
9. ✅ Support ticket marked high priority → Admins receive `high_priority_ticket`
10. ✅ Payment fails → Admins receive `payment_failed`
11. ✅ System error detected → Admins receive `system_alert`
12. ✅ Export completes → Requesting admin receives `data_export_ready`

### Real-time Testing
1. ✅ User A logged in → Trigger notification → Badge updates instantly
2. ✅ User A has notification screen open → New notification arrives → List updates in real-time
3. ✅ User A marks notification as read → Badge count decreases instantly
4. ✅ Admin panel open → New admin notification arrives → Toast shown + list updates

### UI/UX Testing
1. ✅ Click notification → Navigate to correct page + mark as read
2. ✅ "Mark All as Read" → All unread become read + badge clears
3. ✅ Notification for deleted entity → Show graceful fallback message
4. ✅ Test with 100+ notifications → Pagination works smoothly
5. ✅ Test RTL layout → All text and icons properly aligned

---

## Future Enhancements (Out of Scope for MVP)

- **Push Notifications**: Mobile push notifications via Firebase
- **Email Notifications**: Email digest for important notifications
- **Notification Preferences**: Let users choose which notifications to receive
- **Notification History**: Archive read notifications after 90 days
- **Custom Sounds**: Different sounds for different priority levels
- **Notification Templates**: Admin can create custom notification templates
- **Scheduled Notifications**: Admin can schedule notifications for future delivery
- **Notification Analytics**: Track open rates, click-through rates
