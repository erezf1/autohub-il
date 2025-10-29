# Mobile Screens Specification

This document describes all mobile screens in the Auto-Hub B2B dealer platform as actually implemented.

## Table of Contents
1. [Authentication & Onboarding](#authentication--onboarding)
2. [Main Application Screens](#main-application-screens)
3. [Supporting Screens](#supporting-screens)
4. [Navigation Components](#navigation-components)
5. [Common Components & Patterns](#common-components--patterns)
6. [Business Rules & Constraints](#business-rules--constraints)
7. [Complete Route Table](#complete-route-table)
8. [Obsolete Screens](#obsolete-screens)

---

## Authentication & Onboarding

### 1. WelcomeScreen
**Route**: `/mobile/welcome`  
**Purpose**: First screen introducing Auto-Hub B2B platform  
**Auth**: Public

**Layout**: Fixed full-screen with gradient background

**Components**:
- Auto-Hub logo and branding
- Three feature cards (Car Database, Security/Trust, Professional Community)
- "הרשמה חדשה" button → `/mobile/register`
- "התחברות" button → `/mobile/login`
- Terms of service link (non-functional)

**Business Rules**: Licensed dealers only

---

### 2. LoginScreen
**Route**: `/mobile/login`  
**Purpose**: Authentication with phone + 6-digit password  
**Auth**: Public

**Form Fields**:
- Phone (XXX-XXX-XXXX format, 10 digits starting with 05)
- Password (6 digits, masked)
- Login button
- Forgot password link (non-functional)
- New registration button

**Functionality**:
- Validates phone format
- Calls `signIn` from AuthContext
- Routes based on status: pending → `/mobile/pending-approval`, active → `/mobile/dashboard`
- Shows loading state and error toasts

---

### 3. RegisterScreen
**Route**: `/mobile/register`  
**Purpose**: Complete dealer registration  
**Auth**: Public

**Required Fields**:
- Phone (05X-XXX-XXXX)
- Full name
- Business name
- Location (dropdown)
- Trade license file (PDF/image, max 10MB) → `dealer-documents` bucket
- Password (6 digits)
- Confirm password

**Optional Fields**:
- Profile picture (JPG/PNG, max 5MB) → `profile-pictures` bucket
- Business description (max 500 chars)

**Functionality**:
- Uploads files to Supabase storage
- Creates user in auth.users and profile in user_profiles with status='pending'
- Navigates to `/mobile/pending-approval` on success

---

### 4. PendingApprovalScreen
**Route**: `/mobile/pending-approval`  
**Purpose**: Show registration pending admin approval  
**Auth**: Authenticated (status='pending')

**Components**:
- Status message with timeline (1-2 business days)
- Profile details (name, business, location, description)
- "View Trade License" button (creates signed URL)
- Help contacts (non-functional)
- "Back to Login" button

**Functionality**:
- Fetches user_profiles with location join
- Creates signed URL for trade license viewing
- Shows loading skeleton during fetch

---

## Main Application Screens

### 5. DashboardScreen
**Route**: `/mobile/dashboard`  
**Auth**: Protected

**Components**:
- Welcome message with user name and business
- Four navigation cards with stats:
  - Chats (unread count) → `/mobile/chats`
  - Auctions (my bids) → `/mobile/bids`
  - Car Searches (ISO requests) → `/mobile/required-cars`
  - My Vehicles (active count) → `/mobile/my-vehicles`

**Functionality**:
- Checks user status (redirects if not active)
- Real-time stats from useDashboardStats and useProfile hooks

---

### 6. CarSearchScreen
**Route**: `/mobile/search`  
**Tab**: 1 - "מאגר הרכבים"

**Components**:
- "הרכבים שלי" button in header
- Results count, filter button with badge
- Active filters display
- Vehicle cards list (VehicleCard component)

**Functionality**:
- Fetches all vehicles (including user's own)
- Boosted vehicles appear first (sorted by is_boosted and boosted_until)
- Filtering via VehicleFilterDrawer
- Click vehicle → `/mobile/vehicle/{id}`

---

### 7. RequiredCarsScreen
**Route**: `/mobile/required-cars`  
**Tab**: 2 - "חיפוש רכבים"

**Tabs**:
1. "כל הבקשות" - All ISO requests (excludes own)
2. "הבקשות שלי" - User's own requests

**Components (All Requests)**:
- Search bar, filter button, results count
- Request cards showing: title, make/model/year range, price range, location, requester (anonymous), created date
- Click → `/mobile/iso-requests/{id}`

**Components (My Requests)**:
- "בקשה חדשה +" button → `/mobile/iso-requests/create`
- Request cards with offer count badges

**Business Rules**: User's own requests excluded from "All Requests" tab

---

### 8. ISORequestDetailScreen
**Route**: `/mobile/iso-requests/:id`

**Components**:
- Request header (title, status badge)
- Requester info (anonymous until reveal)
- Specifications (make, model, year range, price range, location, description)
- My Offer section (if user made offer): vehicle details, status, edit/cancel buttons
- Other Offers (if requester): list with accept/reject buttons
- Action buttons: "Create Offer" or "Edit/Delete Request"

**Functionality**:
- Offer creation, update, status changes
- Contact reveal flow on offer acceptance
- Uses useISORequestById and useOffersByRequestId hooks

---

### 9. CreateISORequestScreen
**Route**: `/mobile/iso-requests/create`

**Form Fields**:
- Title (required, max 100 chars)
- Description (required, max 500 chars)
- Make, Model (dropdowns, model filtered by make)
- Year range (from/to, 1990-2025)
- Price range (from/to, ₪)
- Location (optional)

**Validation**: year_to >= year_from, price_to >= price_from

**Functionality**:
- react-hook-form with zodResolver
- Model resets when make changes
- Success → `/mobile/required-cars`

---

### 10. HotCarsScreen
**Route**: `/mobile/hot-cars`  
**Tab**: 3 - "רכבים חמים"

**Components**:
- "הבוסטים שלי" button → `/mobile/boost-management`
- Filter section
- Vehicle cards (boosted only) with "Hot Sale" badges

**Functionality**:
- Uses useBoosts hook
- Shows only vehicles with is_boosted=true and valid boosted_until
- Hot sale price displayed prominently if set (strikethrough regular price)

**Business Rules**: Boost duration 5 days, hot sale price optional and must be < regular price

---

### 11. BidsScreen
**Route**: `/mobile/bids`  
**Tab**: 4 - "מכרזים"

**Tabs**:
1. "כל המכרזים" - All active auctions
2. "ההצעות שלי" - User's bids with status (winning/outbid)
3. "המכרזים שלי" - User's created auctions

**Components**:
- "Create Auction +" button (tab 1)
- Auction cards: vehicle info, current bid, bid count, time remaining, "Hot" badge
- Click → `/mobile/auctions/{id}`

**Functionality**: Real-time bid updates via subscriptions

---

### 12. AuctionDetailScreen
**Route**: `/mobile/auctions/:id`

**Components**:
- Vehicle info with image carousel
- Current highest bid, minimum next bid, bid count, time remaining countdown
- Seller info (dealer card)
- Bid history list (all bids with amounts, bidders, timestamps)
- Bid placement section (if not own auction): amount input, validation, "Place Bid" button
- Auction management (if own): edit/close buttons

**Functionality**:
- Real-time bid updates
- Validates bid >= minimum (current + increment)
- Countdown timer updates every second
- Winner revealed at auction end

---

### 13. MyProfileScreen
**Route**: `/mobile/profile`  
**Tab**: 5 - "הפרופיל שלי"

**Components**:
- Profile header (avatar, name, business name)
- Subscription section: plan name, status, expiration, usage stats (vehicles X/Y, boosts X/Y, auctions X/Y), upgrade button
- Statistics (active vehicles, member since, rating)
- Profile details (name, business, phone, location, description)
- "Edit Profile" button → `/mobile/profile-edit`
- "Logout" button

**Data Sources**: useProfile hook

---

## Supporting Screens

### 14. MyVehiclesScreen
**Route**: `/mobile/my-vehicles`

**Components**:
- "Add Vehicle +" button → `/mobile/add-vehicle`
- Subscription info card (plan, count/limit, warning if at limit)
- Vehicle cards with: details, status, boost status, edit/delete/boost buttons

**Functionality**:
- Check subscription limit before adding
- Delete with confirmation
- Click → `/mobile/vehicle/{id}`

---

### 15. AddVehicleScreen
**Route**: `/mobile/add-vehicle` or `/add-car`

**4-Step Wizard**:

**Step 1 - Basic**: Make, model, year (required), vehicle type, color (optional)

**Step 2 - Technical**: Kilometers (required), transmission, fuel type, engine size, previous owners (optional)

**Step 3 - Pricing**: Price (required), condition description (optional)

**Step 4 - Description & Media**: Description (required, min 10 chars), images (multi-upload, max 5MB each), tags (checkboxes), crash history, test file (max 10MB)

**Functionality**:
- Step validation, back button preserves data
- Images → `vehicle-images` bucket, test → `vehicle-documents` bucket
- Tags saved to vehicle_listing_tags junction
- Success → `/mobile/dashboard`

---

### 16. EditVehicleScreen
**Route**: `/mobile/vehicle/:id/edit`

**Layout**: Single form (all fields visible)

**Sections**: Basic info, technical details, pricing, description & media (same fields as add)

**Image Management**:
- Display existing images with remove buttons
- Upload additional images

**Functionality**:
- Loads vehicle data and pre-fills
- Updates tags (deletes old, inserts new)
- Success → `/mobile/my-vehicles`

**Authorization**: Verifies user owns vehicle

---

### 17. VehicleDetailScreen
**Route**: `/mobile/vehicle/:id`

**Components**:
- Image carousel with status badge, Hot Sale badge (if applicable)
- Title & pricing: make/model/year, boost expiration (if boosted), hot sale price (prominent if set, strikethrough regular price), regular price
- Vehicle specs card (VehicleSpecsCard)
- Description
- Tags (if any)
- Condition & history (crash indicator, owners, test file view button)
- Actions:
  - If own: "Edit Vehicle", "Boost" buttons
  - If other's: dealer card, "Send Message" button (or "Back to Chat"), phone button (requires reveal)

**Functionality**:
- Checks conversation existence via useConversationForEntity
- Opens/creates chat via openOrCreateChat helper
- Contact reveal via chat flow

---

### 18. BoostManagementScreen
**Route**: `/mobile/boost-management`

**Sections**:
1. Active Boosts: list with vehicle info, remaining time, deactivate button
2. Subscription Info: plan, boosts remaining, limits, upgrade button
3. Boost New Vehicle: select button → VehicleSelectionDrawer (excludes boosted)
4. Configuration Dialog: hot sale price input (optional, validates < regular price), "Activate Boost" button

**Functionality**:
- Deactivate: sets is_boosted=false, clears boosted_until and hot_sale_price
- Activate: sets is_boosted=true, boosted_until=now()+5days, hot_sale_price (if provided), decrements boost count
- Validates hot sale price < regular price

**Business Rules**: Boost duration 5 days, subscription limits enforced (Regular: 5, Gold: 10, VIP: 99 boosts/month)

---

### 19. ChatListScreen
**Route**: `/mobile/chats`

**Components**:
- Conversation cards: other party avatar/name, subject context, last message preview, unread badge, timestamp

**Timestamp Formatting**: "היום" (today), "אתמול" (yesterday), date (older)

**Functionality**: Click → `/mobile/chat/{id}`

---

### 20. ChatDetailScreen
**Route**: `/mobile/chat/:id`

**Components**:
- Header: back button, other party info, subject
- Contact reveal section (conditional):
  - If not revealed: "Request Contact Details" button (requester) or Approve/Reject buttons (dealer)
  - If revealed: contact info card (name, phone, email, business)
- Messages area: text/image/system messages, own vs other styling, sender info, timestamps
- Input area: text input, send button (disabled if empty)

**Functionality**:
- Send via useSendMessage mutation
- Enter key sends (Shift+Enter new line)
- Auto-scroll to latest
- Real-time updates via Supabase Realtime
- Reveal flow: useRequestReveal, useApproveReveal, useRejectReveal mutations

---

### 21. ProfileEditScreen
**Route**: `/mobile/profile-edit`

**Form Fields**:
- Phone (read-only display)
- Full name, business name, location (required)
- Business description (optional, max 500 chars)
- Profile picture upload (optional, max 5MB, JPG/PNG)

**Functionality**:
- Loads current profile and pre-fills
- Image upload → `profile-pictures` bucket
- Success → `/mobile/profile`

---

### 22. NotificationListScreen
**Route**: `/mobile/notifications`

**Components**:
- "Mark All as Read" button
- Notification cards: icon (by type), text, timestamp, read/unread indicator (blue dot)

**Notification Types**: New message, auction bid, ISO offer, auction outbid, subscription expiration, vehicle status

**Functionality**:
- Mark individual/all as read
- Click → navigate to relevant entity
- Real-time updates via subscription

---

### 23. ChatRequestScreen (Mock)
**Route**: `/mobile/chat-request/:id`  
**Status**: ⚠️ Mock implementation

**Components**:
- Context card
- Dealer preview (hardcoded mock data: name, rating, stats, specialties, online status)
- Privacy notice
- "Request Contact Details" button

**Functionality (mock)**: Shows toast, delays, navigates to `/mobile/chats` - NOT connected to real reveal flow

---

## Navigation Components

### MobileTabBar
**Location**: Fixed bottom

**5 Tabs**:
1. Search ("מאגר הרכבים") → `/mobile/search` - Search-tab.svg
2. Required Cars ("חיפוש רכבים") → `/mobile/required-cars` - Star-tab.svg
3. Hot Cars ("רכבים חמים") → `/mobile/hot-cars` - Hot-tab.svg
4. Bids ("מכרזים") → `/mobile/bids` - Bid-tab.svg
5. Profile ("הפרופיל שלי") → `/mobile/profile` - Profile-tab.svg

**Behavior**: Active tab highlighted, RTL layout, touch-optimized

---

### MobileHeader
**Location**: Fixed top

**Components**:
- Logo (right in RTL) → `/mobile/dashboard`
- Notification badge (unread count if > 0)
- Notification bell → `/mobile/notifications`
- User avatar → `/mobile/profile`

---

### MobileLayout
**Structure**: MobileHeader (fixed top) + Scrollable content + MobileTabBar (fixed bottom)

**Features**: Background (BG.svg), touch-optimized scrolling, RTL direction

---

## Common Components & Patterns

### Shared Components

**VehicleCard**: Vehicle display in lists - image, make/model/year, price (hot sale if boosted), boost badge, status, specs preview

**DealerCard**: Dealer info - avatar, business name, verification badge, rating, location, contact buttons (if revealed)

**AnonymousDealerCard**: Before reveal - generic avatar, "Dealer" placeholder, location, pending message

**VehicleSpecsCard**: Specs grid - year, km, transmission, fuel, engine, type, color, owners

**VehicleFilterDrawer**: Bottom sheet filters - make, model, year/price/km ranges, transmission, fuel, location, tags, "Clear All", "Apply" buttons

**VehicleSelectionDrawer**: Select from user's vehicles - compact cards, excludes used, search/filter

**FilterButton**: Opens drawer with badge count

**ActiveFiltersDisplay**: Filter chips with remove buttons, "Clear All"

**ResultsCount**: Shows count "X רכבים נמצאו"

**LoadingSpinner**: Centered spinner with accessible text

---

### RTL Implementation

**Container**: `<div dir="rtl">`  
**Text**: `.hebrew-text` class  
**Icons**: LEFT side of text  
**Spacing**: `space-x-reverse`, `mr-*` for left margins  
**Forms**: Right-aligned text, labels on right  
**Navigation**: Slide from/to right

---

## Business Rules & Constraints

### Authentication
- Password: 6 digits only
- Phone: Israeli format (05X-XXXXXXX), cannot change after registration
- Status flow: pending → approval → active
- Status routing: pending → pending screen, active → full access

### Vehicle Listings
**Subscription Limits**: Regular: 10 vehicles, Gold: 25, VIP: 100

**Boost**: Duration 5 days, Monthly limits (Regular: 5, Gold: 10, VIP: 99), Hot sale price optional (must be < regular)

**Display**: Boosted first in all lists, own vehicles NOT excluded from CarSearchScreen

### ISO Requests
**Validation**: year_to >= year_from, price_to >= price_from, title max 100 chars, description max 500 chars

**Visibility**: Own requests excluded from "All Requests" tab

**Offers**: One per user per request, requester can accept multiple

### Auctions
**Monthly Limits**: Regular: 5, Gold: 10, VIP: 99

**Bidding**: Min bid = current + increment, real-time updates, auto-close at end

### Chat & Reveal
**Two-stage**: Request → Approval → Reveal

**Revealed Info**: Name, phone, email, business

### Subscription Plans
- **Regular (₪99/mo)**: 10 vehicles, 5 boosts, 5 auctions
- **Gold (₪249/mo)**: 25 vehicles, 10 boosts, 10 auctions
- **VIP (₪499/mo)**: 100 vehicles, 99 boosts, 99 auctions

Limits reset monthly, enforced at action time

---

## Complete Route Table

### Public Routes
- `/mobile/welcome` - WelcomeScreen
- `/mobile/login` - LoginScreen
- `/mobile/register` - RegisterScreen
- `/mobile/pending-approval` - PendingApprovalScreen

### Protected Routes

**Core**:
- `/mobile` or `/mobile/` → Redirect to `/mobile/search`
- `/mobile/dashboard` - DashboardScreen

**Tabs**:
- `/mobile/search` - CarSearchScreen (Tab 1)
- `/mobile/required-cars` - RequiredCarsScreen (Tab 2)
- `/mobile/hot-cars` - HotCarsScreen (Tab 3)
- `/mobile/bids` - BidsScreen (Tab 4)
- `/mobile/profile` - MyProfileScreen (Tab 5)

**Vehicles**:
- `/mobile/my-vehicles` - MyVehiclesScreen
- `/mobile/add-vehicle` or `/add-car` - AddVehicleScreen
- `/mobile/vehicle/:id` - VehicleDetailScreen
- `/mobile/vehicle/:id/edit` - EditVehicleScreen
- `/mobile/boost-management` - BoostManagementScreen

**ISO**:
- `/mobile/iso-requests/:id` - ISORequestDetailScreen
- `/mobile/iso-requests/create` - CreateISORequestScreen

**Auctions**:
- `/mobile/auctions/:id` - AuctionDetailScreen

**Chat**:
- `/mobile/chats` - ChatListScreen
- `/mobile/chat/:id` - ChatDetailScreen
- `/mobile/chat-request/:id` - ChatRequestScreen (mock)

**Profile**:
- `/mobile/profile-edit` - ProfileEditScreen
- `/mobile/notifications` - NotificationListScreen

---

## Obsolete Screens

**Not routed or used**:
1. **OTPVerificationScreen.tsx** - Obsolete (replaced by password auth)
2. **SetPasswordScreen.tsx** - Obsolete (password set in registration)
3. **OnboardingProfileScreen.tsx** - Obsolete (merged into RegisterScreen)
4. **OnboardingLicenseScreen.tsx** - Obsolete (merged into RegisterScreen)
5. **CreateBidSelectCarScreen.tsx** - Incomplete implementation
6. **CreateBidDetailsScreen.tsx** - Incomplete implementation
7. **AuctionListScreen.tsx** - Obsolete (replaced by BidsScreen tabs)
8. **AllAuctionsScreen.tsx** - Empty file (never implemented)

---

**Document Version**: 2.0  
**Last Updated**: 2025-01-29  
**Status**: Reflects actual implementation
