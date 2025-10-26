# Mobile Screens Specification - Auto-Hub

## Overview
This document specifies all mobile screens for the Auto-Hub application based on PROJECT_PRD.md. The mobile app is designed for licensed car dealers with RTL (Hebrew) interface support and secure authentication.

## Screen Navigation Flow
```
MobileLayout (RTL)
├── MobileHeader (Logo, Notifications, Subscription Status)
├── Main Content Area
└── MobileTabBar (Bottom Navigation: Car Search, Required Cars, Hot Cars, Bids, My Profile)
```

## Authentication & Onboarding Flow
New users must complete registration and approval process before accessing main application.

## Authentication & Onboarding Screens

### 1. Login Screen (`/mobile/login`)
**File**: `src/pages/mobile/LoginScreen.tsx`

#### Purpose
Initial authentication screen for new and returning users.

#### Layout Requirements
- **Phone Input**: RTL support with Israeli format (+972)
- **OTP Button**: Send verification code
- **Branding**: Auto-Hub logo and welcome message

#### Components Needed
- Phone number input with validation
- OTP send button
- Terms and conditions link
- Loading states for OTP sending

### 2. OTP Verification Screen (`/mobile/verify-otp`)
**File**: `src/pages/mobile/OTPVerificationScreen.tsx`

#### Purpose
Verify phone number with OTP code.

#### Layout Requirements
- **OTP Input**: 6-digit code entry
- **Resend Options**: Timer and resend functionality
- **Navigation**: Back to login

### 3. Onboarding Profile Screen (`/mobile/onboarding/profile`)
**File**: `src/pages/mobile/OnboardingProfileScreen.tsx`

#### Purpose
Collect dealer profile information during registration.

#### Layout Requirements
- **Form Fields**: Full name, business name, location (RTL)
- **Progress Indicator**: Step 1 of 2
- **Navigation**: Continue to license upload

### 4. Onboarding License Screen (`/mobile/onboarding/license`)
**File**: `src/pages/mobile/OnboardingLicenseScreen.tsx`

#### Purpose
Upload and verify trade license document.

#### Layout Requirements
- **File Upload**: Camera and gallery options
- **Preview**: Show selected license image
- **Submission**: Submit for admin approval

### 5. Pending Approval Screen (`/mobile/pending-approval`)
**File**: `src/pages/mobile/PendingApprovalScreen.tsx`

#### Purpose
Display waiting state during admin approval process.

#### Layout Requirements
- **Status Message**: RTL explanation of approval process
- **Contact Info**: Support contact for questions
- **Logout Option**: Return to login screen

## Main Application Screens

### 6. Car Search Screen (`/mobile/search` or `/mobile/car-search`)
**File**: `src/pages/mobile/CarSearchScreen.tsx`

#### Purpose
Browse and search available vehicles from OTHER dealers in the marketplace. **EXCLUDES user's own vehicles.**

#### Search Behavior
- **CRITICAL**: Search results automatically exclude the current user's own vehicles
- Query implementation: `.neq('owner_id', userId)` in `useVehicles()` hook
- User's own vehicles are accessible only through "My Vehicles" screen (`/mobile/my-vehicles`)
- Displays only vehicles owned by other dealers

#### Layout Requirements
- **Header**: Page title with back button and "My Vehicles" link
- **Search Bar**: Real-time search with RTL placeholder "חפש לפי יצרן, דגם או שנה..."
- **Filter Button**: Icon button with active filter count badge
- **Active Filters Display**: Shows applied filter count with "Clear All" button
- **Results Counter**: Hebrew text showing number of matching vehicles
- **Vehicle Cards**: Scrollable list with comprehensive vehicle information

#### Components Needed
- Search input with icon (right-aligned for RTL)
- Full-width filter drawer (see VehicleFilterDrawer specifications below)
- Vehicle result cards displaying:
  - Vehicle image with boosted badge
  - Make, model, year (Hebrew)
  - Kilometers, transmission type, fuel type
  - Price in ILS (₪)
  - Click to navigate to vehicle detail
- Active filter badges with count
- "Clear All" button that resets all filters
- Loading states

#### VehicleFilterDrawer Specifications
- **Component**: `src/components/mobile/VehicleFilterDrawer.tsx`
- **Width**: Full mobile screen width (`w-full`)
- **Max Height**: 90vh for scrollable content
- **RTL Support**: `dir="rtl"` for proper Hebrew layout
- **Filter Categories**:
  - Make (יצרן): Dropdown with "הכל" option
  - Model (דגם): Dependent on make selection
  - Year Range (שנת ייצור): From/To inputs
  - Price Range (מחיר): From/To inputs
  - Tags (תגיות): Interactive badge selection
- **Clear All Button**: 
  - Resets all filters to empty state
  - Immediately applies changes via `onApplyFilters({})`
  - Auto-closes drawer via `onOpenChange(false)`
  - Returns user to search screen in one action
- **Apply Button**: Closes drawer and applies selected filters

### 7. Required Cars Screen (`/mobile/required-cars`)
**File**: `src/pages/mobile/RequiredCarsScreen.tsx`

#### Purpose
Manage "Vehicles Wanted" requests - dealer's specific vehicle requirements.

#### Layout Requirements
- **My Requests List**: Current ISO requests with status
- **Create Button**: Add new vehicle requirement
- **Filter Tabs**: Active, Completed, Expired requests

#### Components Needed
- ISO request cards with specifications
- Status indicators (Active, Matches Found, Completed)
- Create new ISO request button
- Request detail navigation

### 8. Hot Cars Screen (`/mobile/hot-cars`)
**File**: `src/pages/mobile/HotCarsScreen.tsx`

#### Purpose
Display boosted vehicles ("Hot Sales") with 5-day priority placement. Shows ONLY other dealers' boosted vehicles.

#### Boost System Rules
- **Fixed Duration**: All boosts are exactly 5 days
- **Optional Hot Sale Price**: Dealers can set special reduced pricing
- **Visibility**: Excludes current user's own boosted vehicles (managed via "My Boosts")
- **Communication**: Dealers use existing chat system to contact about hot cars
- **Monthly Allocation**: Gold plan (5 boosts/month), VIP plan (15 boosts/month)

#### Layout Requirements
- **Header**: Title with flame icon, "My Boosts" button to access own boost management
- **Filter Support**: Standard vehicle filtering applies to hot cars
- **Boosted Indicator**: Flame icon and "מכירה חמה!" badge on cards
- **Hot Sale Price Display**: Shows both original and discounted price if applicable
- **Time Remaining**: Days remaining until boost expires
- **Enhanced Cards**: Premium styling with hot sale price highlighting

#### Components Needed
- Vehicle cards with special "Hot Car" styling
- Flame icon indicators for boosted status
- Hot sale price display with original price strikethrough
- Days remaining countdown
- Navigation to individual vehicle detail screens
- Contact seller via chat button (uses existing chat system)

### 9. Bids Screen (`/mobile/bids`)
**File**: `src/pages/mobile/BidsScreen.tsx`

#### Purpose
Manage auction participation and bidding activities.

#### Layout Requirements
- **Filter Tabs**: My Bids, My Auctions, Active Auctions
- **Bid Management**: Create new bids and track existing ones
- **Real-time Updates**: Live bid updates and notifications

#### Components Needed
- Auction cards with bid status
- Bid creation flow (select car -> set bid details)
- Bid history and status tracking
- Real-time countdown and updates
- "Create New Bid" button leading to car selection

### 10. My Profile Screen (`/mobile/profile`)
**File**: `src/pages/mobile/MyProfileScreen.tsx`

#### Purpose
Comprehensive profile management with subscription and business information.

#### Layout Requirements
- **Profile Header**: Business name, rating tier, tenure display
- **Subscription Section**: Plan type, vehicles remaining, boosts available
- **Business Information**: Contact details, trade license status
- **Settings**: Preferences and account management

#### Components Needed
- Profile information display with subscription details
- Subscription usage indicators (vehicles used/remaining)
- Available boosts and auctions count
- Business rating and tenure display
- Settings and preferences management
- Logout functionality

#### Enhanced Features from PRD
- Display subscription plan (Regular/Gold/VIP)
- Show remaining vehicles, boosts, and auctions
- Rating tier visualization
- Years in business (tenure)
- Trade license verification status

## Supporting Screens

### 11. My Vehicles Screen (`/mobile/my-vehicles`)
**File**: `src/pages/mobile/MyVehiclesScreen.tsx`

#### Purpose
Manage dealer's personal vehicle inventory separately from marketplace search.

#### Layout Requirements
- **Vehicle List**: Dealer's own vehicle listings
- **Management Actions**: Edit, boost, create auction, remove
- **Add Vehicle**: Quick access to add new vehicles
- **Status Indicators**: Available, sold, boosted status

### Add/Edit Vehicle Screens
**Files**: `src/pages/mobile/AddVehicleScreen.tsx`, `src/pages/mobile/EditVehicleScreen.tsx`

#### Shared Field Specifications

**Vehicle Type Field**
- **Field Name**: "סוג" (Type)
- **Input Type**: Dropdown/Select with 7 predefined categories
- **Options** (from `src/constants/vehicleTypes.ts`):
  - מיקרו (micro)
  - מיני (mini)
  - משפחתי (family)
  - מנהלים (executive)
  - SUV (suv)
  - יוקרתי (luxury)
  - ספורט (sport)
- **Required**: Optional
- **RTL Support**: Hebrew labels with proper text alignment
- **Search/Filter**: Vehicle type is filterable in search screens using these categories

**Engine Size Field**
- **Field Name**: "נפח מנוע" (Engine Size)
- **Input Type**: Numeric input
- **Unit**: Cubic centimeters (סמ"ק / cc)
- **Placeholder**: "1600 סמ״ק"
- **Validation**: Accepts any positive number (no upper limit)
- **Database**: Stored as NUMERIC type to support values like 5000cc, 10000cc
- **Required**: Optional

**Tags Field (Edit Vehicle Screen Only)**
- **Field Name**: "תגיות" (Tags)
- **Location**: Separate Card after description field, before images section
- **Input Type**: Interactive badge selection
- **Data Source**: `vehicle_tags` table via `useVehicleTags()` hook
- **Display**: 
  - Color-coded badges from database (`tag.color` field or default #6B7280)
  - Selected tags show filled badge with tag color
  - Unselected tags show outline badge
  - Flex-wrap layout for multi-row display
- **Interaction**: Click/tap to toggle selection
- **State Management**: 
  - Component state: `selectedTagIds: number[]`
  - Loads existing tags on mount from `vehicle_listing_tags` table
  - Updates local state array on toggle
- **Database Operations**:
  - On save: Deletes all existing tags for vehicle, then inserts new selection
  - Uses `vehicle_listing_tags` junction table
- **RTL Support**: Proper Hebrew text in badges

#### Edit Vehicle Screen Specific Features
- **Model Dropdown Fix**: Uses `key={`model-${selectedMakeId}`}` to force re-render when make changes
- **Tags Section**: Full Card component with interactive badge selection
- **Pre-populated Data**: Loads vehicle data and existing tags on mount via separate useEffect hooks

### 12. Create ISO Request Screen (`/mobile/create-iso-request`)
**File**: `src/pages/mobile/CreateISORequestScreen.tsx`

#### Purpose
Create new "Vehicles Wanted" requests with detailed specifications.

#### Layout Requirements
- **Vehicle Specifications**: Make, model, year, price range
- **Requirements Form**: Detailed requirements and preferences
- **Submission**: Create and publish request

### 13. Boost Management Screen (`/mobile/boost-management`)
**File**: `src/pages/mobile/BoostManagementScreen.tsx`

#### Purpose
Manage boost usage and apply 5-day boosts to dealer's own vehicle listings.

#### Visual Hierarchy & Layout Structure
The screen is organized to prioritize active boosts and make adding new boosts effortless:

1. **Boost Counter Card** (Compact Header):
   - Shows remaining boosts: "X / Y בוסטים זמינים" (e.g., "7 / 10")
   - Visual progress bar indicating usage
   - Subscription plan name display
   - Fetches allocation from `subscription_plans` table via `useProfile` hook

2. **Active Boosts Section** (Priority #1):
   - Title: "הבוסטים הפעילים שלי"
   - Displays currently boosted vehicles with:
     - Vehicle thumbnail (80x80px) and details
     - Time remaining countdown (e.g., "3 ימים נותרים")
     - Hot sale price badge if applicable (₪XXX,XXX)
     - Deactivate button (X icon) to cancel boost early
   - Empty state when no active boosts:
     - Flame icon (faded)
     - Message: "אין בוסטים פעילים"
     - Subtext: "הפעל בוסט כדי להגביר את החשיפה של הרכבים שלך"

3. **Add Boost Button** (Large CTA):
   - Prominent gradient-bordered button
   - Icons: Flame + Plus
   - Text: "הוסף בוסט חדש"
   - Disabled state when `availableBoosts === 0`
   - Opens Vehicle Selection Drawer on click

4. **Subscription Info Card** (Bottom):
   - Compact footer display
   - Shows: "סוג מנוי: [plan_name]"
   - Monthly allocation: "(X בוסטים בחודש)"
   - Contact message: "לשדרוג מנוי, צור קשר עם המנהל"

#### Components & User Flow

**VehicleSelectionDrawer Component** (`src/components/mobile/VehicleSelectionDrawer.tsx`):
- Opens when user clicks "הוסף בוסט חדש"
- Displays user's eligible (non-boosted) vehicles
- Each vehicle card shows:
  - Thumbnail, make/model, year, current price
  - "בחר" button
- Empty state with "הוסף רכב" button if no eligible vehicles
- On selection: Opens Boost Configuration Dialog

**Boost Configuration Dialog**:
- Pre-filled with selected vehicle details
- Shows original price for reference
- Hot sale price input (optional):
  - Allows setting promotional price
  - Can be left as original price (no discount)
  - Validation ensures positive number
- Display: "משך הבוסט: 5 ימים" (read-only)
- Actions:
  - "הפעל בוסט" button (primary, with Flame icon)
  - "ביטול" button (secondary)
- On success: Dialog closes, Active Boosts section updates immediately

#### Boost Counting Logic
- Uses `get_remaining_boosts(user_id)` RPC function
- Counts activations (not just currently active boosts)
- Formula: `remaining = monthly_allocation - boosts_activated_this_month`
- Resets on 1st of each month
- Progress bar calculation: `(availableBoosts / totalBoosts) * 100`

#### Technical Implementation
- **Queries**: 
  - `useProfile()` - Fetches subscription plan with boost allocation
  - `myActiveBoostedVehicles` - Active boosts with remaining time
  - `myVehicles` - Eligible vehicles for new boosts (filtered: not boosted)
- **Mutations**:
  - `activateBoost({ vehicleId, hotSalePrice })` - Activates 5-day boost
  - `deactivateBoost(vehicleId)` - Cancels active boost early
- **State Management**: React Query with refetch on window focus

### 14. Subscription Status Screen (`/mobile/subscription`)
**File**: `src/pages/mobile/SubscriptionStatusScreen.tsx`

#### Purpose
Display comprehensive subscription information and usage tracking.

#### Layout Requirements
- **Plan Overview**: Current plan type and validity
- **Usage Tracking**: Vehicles, boosts, auctions used/remaining
- **Renewal Information**: Expiration date and renewal process

### 15. Chat Request Screen (`/mobile/chat-request/:chatId`)
**File**: `src/pages/mobile/ChatRequestScreen.tsx`

#### Purpose
Anonymous chat interface with mutual detail-reveal mechanism.

#### Layout Requirements
- **Anonymous Interface**: No personal details shown initially
- **Reveal Request**: Button to request dealer information
- **Chat Interface**: Standard messaging with privacy protection

### 16. Notifications Screen (`/mobile/notifications`)
**File**: `src/pages/mobile/NotificationListScreen.tsx`

#### Purpose
Display all system notifications with enhanced categorization per PRD requirements.

#### Components Needed
- Enhanced notification types per PRD:
  - Registration approval confirmation
  - Vehicle Wanted matches found
  - Auction bid updates (outbid notifications)
  - New bids on user's auctions
  - Subscription expiring warnings
  - Admin warnings/suspensions
  - Support ticket responses

### 17. Vehicle Detail Screen (`/mobile/vehicle/:id`)
**File**: `src/pages/mobile/VehicleDetailScreen.tsx`

#### Purpose
Display comprehensive vehicle information for other users' listings with seller contact options.

#### Layout Requirements
- RTL mobile interface with proper Hebrew text alignment
- Fixed header with back navigation
- Image carousel with navigation dots and status badge
- Scrollable content area with organized card sections

#### Components
1. **Vehicle Images Carousel:**
   - Full-width image display with navigation arrows (RTL layout)
   - Image indicator dots at bottom
   - Status badge overlay (זמין/נמכר)

2. **Vehicle Title & Price Card:**
   - Large title: Make Model Year in Hebrew
   - Prominent price display with "ניתן למשא ומתן" subtitle
   - Quick stats icons: Year, Kilometers

3. **Technical Specifications Card (מפרט טכני):**
   - Grid layout (2 columns) displaying:
     - שנת ייצור, קילומטרז׳
     - תיבת הילוכים (אוטומט/ידנית/טיפטרוניק)
     - סוג דלק (בנזין/דיזל/היברידי/חשמלי)
     - נפח מנוע displayed as "XXX סמ״ק"
     - סוג, צבע, בעלים קודמים (if provided)

4. **Description Card (תיאור):**
   - Displayed only if description exists
   - Full-width text block with RTL text flow

5. **Tags Card (תגיות):**
   - Displayed only if vehicle has tags
   - Color-coded badges matching database tag colors
   - Flex wrap layout showing Hebrew tag names

6. **Vehicle Condition & History Card (מצב ורקע הרכב):**
   - תאונה חמורה (Severe crash): כן/לא
   - בעלים קודמים (Previous owners count)
   - Test result file viewer button (if file exists)

7. **Seller Information Card (פרטי המוכר):**
   - Avatar with seller initial
   - Business/full name display
   - "שלח הודעה" button - navigates to chat

#### Data Fetching
- Fetch vehicle with joined `vehicle_makes`, `vehicle_models`
- Fetch `vehicle_listing_tags` with nested `vehicle_tags` for color-coded display
- Fetch owner profile for seller information display

## 7. Profile Screen (`/mobile/profile`)
**File**: `src/pages/mobile/MyProfileScreen.tsx`

### Purpose
User profile management and account settings.

### Layout Requirements
- **Profile Header**: User avatar, name, and basic info
- **Settings Sections**: Grouped configuration options
- **Action Buttons**: Logout, support contact

### Components Needed
- Profile information display
- Settings menu items
- Language/theme preferences
- Notification settings toggle
- Support and help links

## 8. Not Found Screen (`/mobile/*`)
**File**: `src/pages/mobile/NotFound.tsx`

### Purpose
Handle invalid mobile routes with user-friendly message.

### Layout Requirements
- **Error Message**: RTL Hebrew text
- **Navigation Options**: Return to home or main sections
- **Consistent Styling**: Match app theme

## Common Mobile Layout Components

### MobileHeader
- **Logo**: Auto-Hub branding
- **Title**: Current page title in Hebrew
- **Actions**: Notification and chat icons with badges

### MobileTabBar (Updated per PRD Requirements)
- **Navigation Tabs**: 
  - חיפוש רכבים (Car Search) - Browse marketplace vehicles
  - רכבים מבוקשים (Required Cars) - Manage ISO requests  
  - רכבים חמים (Hot Cars) - Boosted vehicle listings
  - הצעות מחיר (Bids) - Auction participation and management
  - הפרופיל שלי (My Profile) - Account and subscription management
- **Active State**: Visual indication of current screen
- **Badge Support**: Unread counts and notification indicators
- **Subscription Awareness**: Indicate available boosts/auctions in relevant tabs

## RTL (Hebrew) Design Guidelines

### Text Direction
- All text flows right-to-left
- Icons positioned on the left side of text
- Navigation flows from right to left
- Numbers and English text maintain LTR within RTL context

### Layout Considerations
- Margins and padding mirror standard LTR layouts
- Button placement favors right side for primary actions
- Form fields align to the right
- Lists and cards maintain RTL text flow

### Accessibility
- Screen reader support for RTL content
- Proper aria labels in Hebrew
- Color contrast compliance
- Touch targets meet minimum size requirements

## PRD Compliance Checklist

### ✅ Implemented Features
- RTL Hebrew interface support
- Basic authentication and profile management
- Vehicle search and listing capabilities
- Auction participation system
- Chat system foundation
- Notification system

### 🔄 Enhanced Features (Per PRD)
- **Authentication**: OTP-based passwordless login
- **Subscription Management**: Plan tracking and usage limits
- **Boost System**: 3-day priority placement for listings
- **Anonymous Chat**: Mutual detail-reveal mechanism
- **Rating System**: Dealer rating tiers and tenure display
- **ISO Requests**: Enhanced vehicle wanted system with matching

### 📊 Data Model Alignment
All screens now align with PRD entity specifications:
- User profiles with business names and rating tiers
- Vehicle listings with boost status and enhanced specifications
- Subscription plans with usage tracking
- Auction system with proper bid management
- ISO request system with matching capabilities

### 🎯 Business Rules Integration
- Subscription limits enforcement (vehicles, boosts, auctions)
- Boost 3-day activation cycle
- Quick search categories: "עד ₪50,000", "אחרי תאונה", "רכבי יוקרה", "אופנועים"
- Anonymous communication with reveal mechanism
- Trade license verification requirement

---
*This specification aligns with PROJECT_PRD.md and should be referenced for all mobile screen development and updates.*