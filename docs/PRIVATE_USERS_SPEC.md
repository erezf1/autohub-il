# Private Users Module - Requirements Specification

## Document Overview
This document specifies the requirements for adding **Private Users (משתמשים פרטיים)** to the Auto-Hub platform. Private users are regular individuals who want to sell their personal vehicles to dealers.

**Last Updated:** 2025-11-30  
**Status:** Implementation Ready

---

## 1. User Role Definition

### 1.1 Role Characteristics
- **Role Name:** `private` (stored in `app_role` enum)
- **User Identifier:** Phone number (10 digits, format: `05XXXXXXXX`)
- **Role Exclusivity:** Users can ONLY be ONE of: `dealer`, `admin`, or `private` (mutually exclusive)
- **Access Level:** Web-only interface, no mobile app access

### 1.2 Private User Profile
Required fields in `private_users` table:
- `id` (UUID) - References auth.users
- `phone_number` (TEXT, NOT NULL) - 10-digit Israeli phone
- `full_name` (TEXT, NOT NULL) - User's full name
- `location_id` (INTEGER) - References locations table
- `status` (TEXT) - Values: `active`, `suspended`, `rejected` (NO `pending` - users are active immediately)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

---

## 2. Authentication Flow

### 2.1 Authentication Method
- **Type:** OTP-based (SMS verification)
- **Provider:** 019sms.co.il (future integration)
- **Mock OTP:** `9876` (used until real SMS integration)
- **No Password:** Private users authenticate ONLY via OTP
- **No Admin Approval:** Users become `active` immediately after OTP verification

### 2.2 Registration Flow (New Users)
1. User enters: Full Name, Phone Number, Location
2. System sends OTP (mock: `9876`)
3. User enters OTP on `/private/otp-verify`
4. **AFTER OTP verification:** User account is created with `status = 'active'`
5. User is automatically logged in and redirected to `/private/dashboard`

### 2.3 Login Flow (Existing Users)
1. User enters: Phone Number
2. System sends OTP (mock: `9876`)
3. User enters OTP on `/private/otp-verify`
4. User is logged in and redirected to `/private/dashboard`

### 2.4 Authentication Screens
1. **Private Welcome Screen** (`/private`) - Entry point from landing page
2. **Private Login Screen** (`/private/login`) - Phone input only
3. **Private Registration Screen** (`/private/register`) - Name + Phone + Location
4. **OTP Verification Screen** (`/private/otp-verify`) - Context-aware OTP entry
   - Handles both registration (creates user) and login (signs in existing user)
   - Uses location state to determine flow

### 2.5 Authentication Context
- **Separate Context:** `PrivateAuthContext` (independent from dealer auth)
- **Separate Client:** `privateClient` with storage key `private-auth`
- **Session Persistence:** localStorage with private-specific key
- **Auto-redirect:** Logged-in users redirected to `/private/dashboard`
- **signUp():** Called AFTER OTP verification with user data

---

## 3. Screen Specifications

### 3.1 New Screens (To Create)

| Screen | Route | Purpose |
|--------|-------|---------|
| Private Welcome | `/private` | Landing/intro for private users |
| Private Login | `/private/login` | Phone input + OTP request |
| Private Register | `/private/register` | Name, phone, location signup |
| Private Dashboard | `/private/dashboard` | Main hub, vehicle stats |
| Private My Vehicles | `/private/my-vehicles` | List of user's vehicles (max 3) |
| Private Profile | `/private/profile` | View profile details |
| Private Profile Edit | `/private/profile/edit` | Edit name, location |

### 3.2 Reused Screens (Context-Aware)

| Screen | Original Route | Private Route | Modifications |
|--------|---------------|---------------|---------------|
| OTP Verification | `/mobile/otp-verify` | `/private/otp-verify` | Detect context, route back correctly |
| Add Vehicle | `/mobile/add-vehicle` | `/private/add-vehicle` | Check max 3 limit, set `is_private_listing=true` |
| Edit Vehicle | `/mobile/edit-vehicle/:id` | `/private/edit-vehicle/:id` | Context-aware back navigation |
| Vehicle Detail | `/mobile/vehicle/:id` | `/private/vehicle/:id` | Show owner context correctly |

### 3.3 Navigation Context Hook
```typescript
// useNavigationContext.ts
const useNavigationContext = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isPrivateContext = location.pathname.startsWith('/private');
  const isDealerContext = location.pathname.startsWith('/mobile');
  
  const routes = {
    dashboard: isPrivateContext ? '/private/dashboard' : '/mobile/dashboard',
    myVehicles: isPrivateContext ? '/private/my-vehicles' : '/mobile/my-vehicles',
    // ... more routes
  };
  
  return { isPrivateContext, isDealerContext, routes, navigate };
};
```

### 3.4 Screens NOT Available to Private Users
- ❌ Car Search (`/mobile/search`)
- ❌ Hot Cars (`/mobile/hot`)
- ❌ Required Cars (ISO Requests) (`/mobile/required`)
- ❌ All Auctions (`/mobile/auctions`)
- ❌ Bids Screen (`/mobile/bids`)
- ❌ Chat (any chat functionality)
- ❌ Boost Management

---

## 4. Vehicle Management

### 4.1 Vehicle Listing Constraints
- **Maximum Vehicles:** 3 per private user
- **Listing Type:** `is_private_listing = true`
- **Owner Reference:** `private_user_id` (UUID)
- **No Special Features:** No boosts, no auctions, no hot sales
- **Basic Details Only:** Make, model, year, price, images, description

### 4.2 Private Vehicle Badge
- **Display:** "מפרטי" badge on all private listings
- **Styling:** Distinct color (e.g., purple gradient)
- **Visibility:** Shown on:
  - Vehicle cards in dealer search
  - Vehicle detail pages
  - Admin vehicle lists

### 4.3 Contact Method
- **No Chat:** Private listings do NOT support internal chat
- **Direct Contact:** Display phone number directly on listing
- **Dealer Action:** "התקשר למוכר" (Call Seller) button with phone link

---

## 5. Landing Page Integration

### 5.1 Three User Type Cards
Landing page (`/`) displays three options:

1. **סוחר** (Dealer)
   - Route: `/mobile/welcome`
   - Icon: Car dealership
   
2. **מנהל מערכת** (Admin)
   - Route: `/admin/login`
   - Icon: Admin dashboard
   
3. **משתמש פרטי** (Private User) - NEW
   - Route: `/private`
   - Icon: Person with car
   - Subtitle: "מוכר רכב פרטי לסוחרים"

---

## 6. Database Schema Changes

### 6.1 Enum Update
```sql
-- Add 'private' to app_role enum
ALTER TYPE public.app_role ADD VALUE 'private';
```

### 6.2 New Table: private_users
```sql
CREATE TABLE public.private_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  location_id INTEGER REFERENCES public.locations(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.private_users ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_private_users_phone ON public.private_users(phone_number);
CREATE INDEX idx_private_users_status ON public.private_users(status);
```

### 6.3 Update vehicle_listings Table
```sql
-- Add columns for private listings
ALTER TABLE public.vehicle_listings
ADD COLUMN is_private_listing BOOLEAN DEFAULT FALSE,
ADD COLUMN private_user_id UUID REFERENCES public.private_users(id) ON DELETE CASCADE;

-- Add constraint: Either dealer OR private owner
ALTER TABLE public.vehicle_listings
ADD CONSTRAINT vehicle_owner_check 
CHECK (
  (owner_id IS NOT NULL AND private_user_id IS NULL) OR
  (owner_id IS NULL AND private_user_id IS NOT NULL)
);

-- Index for private listings
CREATE INDEX idx_vehicle_listings_private ON public.vehicle_listings(is_private_listing, private_user_id);
```

### 6.4 RLS Policies

#### private_users Table
```sql
-- Private users can view own profile
CREATE POLICY "Private users view own profile"
ON public.private_users FOR SELECT
USING (id = auth.uid());

-- Private users can update own profile
CREATE POLICY "Private users update own profile"
ON public.private_users FOR UPDATE
USING (id = auth.uid());

-- Admins can view all private users
CREATE POLICY "Admins view all private users"
ON public.private_users FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage private users
CREATE POLICY "Admins manage private users"
ON public.private_users FOR ALL
USING (public.has_role(auth.uid(), 'admin'));
```

#### vehicle_listings Table (Updates)
```sql
-- Private users can insert own vehicles (max 3 enforced in app)
CREATE POLICY "Private users insert own vehicles"
ON public.vehicle_listings FOR INSERT
WITH CHECK (
  private_user_id = auth.uid() AND
  is_private_listing = true AND
  EXISTS (
    SELECT 1 FROM public.private_users
    WHERE id = auth.uid() AND status = 'active'
  )
);

-- Private users can view own vehicles
CREATE POLICY "Private users view own vehicles"
ON public.vehicle_listings FOR SELECT
USING (private_user_id = auth.uid());

-- Private users can update own vehicles
CREATE POLICY "Private users update own vehicles"
ON public.vehicle_listings FOR UPDATE
USING (private_user_id = auth.uid());

-- Private users can delete own vehicles
CREATE POLICY "Private users delete own vehicles"
ON public.vehicle_listings FOR DELETE
USING (private_user_id = auth.uid());

-- Active dealers can view private listings
CREATE POLICY "Dealers view private listings"
ON public.vehicle_listings FOR SELECT
USING (
  is_private_listing = true AND
  status = 'available' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND status = 'active'
  )
);
```

---

## 7. Admin Management

### 7.1 New Admin Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Admin Private Users List | `/admin/private-users` | List all private users |
| Admin Private User Detail | `/admin/private-users/:id` | Manage individual user |

### 7.2 Admin Features
- View all private users with status filter
- Suspend/activate private users (no approval needed - users are active immediately)
- View user's vehicle listings
- Delete user vehicles if needed
- Access user contact information

### 7.3 Admin Sidebar Update
Add new menu item:
```
📋 משתמשים פרטיים (Private Users)
  └─ Route: /admin/private-users
```

### 7.4 Vehicle List Source Filter
In `AdminVehiclesList`, add filter:
- **All Sources** (default)
- **Dealer Listings** (`is_private_listing = false`)
- **Private Listings** (`is_private_listing = true`)

---

## 8. Files to Create

### 8.1 Authentication & Context
- `src/integrations/supabase/privateClient.ts` - Separate Supabase client
- `src/contexts/PrivateAuthContext.tsx` - Private user auth context
- `src/hooks/private/usePrivateProfile.ts` - Fetch private user profile
- `src/hooks/useNavigationContext.ts` - Detect dealer vs private context

### 8.2 Private User Screens
- `src/pages/private/PrivateWelcomeScreen.tsx`
- `src/pages/private/PrivateLoginScreen.tsx`
- `src/pages/private/PrivateRegisterScreen.tsx`
- `src/pages/private/PrivateDashboardScreen.tsx`
- `src/pages/private/PrivateMyVehiclesScreen.tsx`
- `src/pages/private/PrivateProfileScreen.tsx`
- `src/pages/private/PrivateProfileEditScreen.tsx`

### 8.3 Private Layouts & Components
- `src/components/private/PrivateLayout.tsx` - Layout wrapper
- `src/components/private/PrivateHeader.tsx` - Simple header
- `src/components/private/PrivateUserProfile.tsx` - Profile display
- `src/components/private/ProtectedPrivateRoute.tsx` - Auth guard
- `src/components/common/PrivateUserContactCard.tsx` - Contact display for dealers

### 8.4 Admin Screens
- `src/pages/admin/AdminPrivateUsersList.tsx`
- `src/pages/admin/AdminPrivateUserDetail.tsx`

### 8.5 Hooks
- `src/hooks/private/usePrivateAuth.ts` - Private auth hook
- `src/hooks/private/usePrivateVehicles.ts` - Fetch private vehicles
- `src/hooks/admin/usePrivateUsers.ts` - Admin hook for private users

---

## 9. Files to Modify

### 9.1 Core Application
- `src/App.tsx` - Add `/private/*` routes
- `src/pages/LandingPage.tsx` - Add private user card
- `src/pages/mobile/OTPVerificationScreen.tsx` - Support context detection

### 9.2 Shared Vehicle Screens
- `src/pages/mobile/AddVehicleScreen.tsx` - Detect private context, set flags
- `src/pages/mobile/EditVehicleScreen.tsx` - Context-aware navigation
- `src/pages/mobile/VehicleDetailScreen.tsx` - Show private badge & contact

### 9.3 Dealer Screens
- `src/pages/mobile/CarSearchScreen.tsx` - Show private badge on cards
- `src/components/common/VehicleCard.tsx` - Add private badge support

### 9.4 Admin Screens
- `src/pages/admin/AdminVehiclesList.tsx` - Add source filter
- `src/pages/admin/AdminVehicleDetail.tsx` - Show private user info
- `src/components/admin/AdminDesktopSidebar.tsx` - Add menu item

### 9.5 Types
- `src/types/private/index.ts` - Create private user types

---

## 10. Implementation Phases

### Phase 1: Database & Auth Foundation ✅
1. Create specification document (this file)
2. Database migration (enum, tables, RLS)
3. Create `privateClient.ts`
4. Create `PrivateAuthContext.tsx`
5. Create `useNavigationContext.ts` hook

### Phase 2: Core Private User Screens
1. Create `PrivateLayout.tsx` & `PrivateHeader.tsx`
2. Create authentication screens (Welcome, Login, Register)
3. Update `OTPVerificationScreen.tsx` for context awareness
4. Create `PrivateDashboardScreen.tsx`
5. Create `PrivateProfileScreen.tsx` & Edit

### Phase 3: Vehicle Management
1. Create `PrivateMyVehiclesScreen.tsx`
2. Update `AddVehicleScreen.tsx` - max 3 check, private flag
3. Update `EditVehicleScreen.tsx` - context-aware navigation
4. Create `PrivateUserContactCard.tsx` component
5. Update `VehicleCard.tsx` - add private badge

### Phase 4: Integration with Dealer Side
1. Update `LandingPage.tsx` - add private user card
2. Update `VehicleDetailScreen.tsx` - show badge & contact
3. Update `CarSearchScreen.tsx` - show badge on search results
4. Test dealer viewing private listings

### Phase 5: Admin Management
1. Create `AdminPrivateUsersList.tsx`
2. Create `AdminPrivateUserDetail.tsx`
3. Update `AdminDesktopSidebar.tsx`
4. Update `AdminVehiclesList.tsx` - source filter
5. Update `AdminVehicleDetail.tsx` - show private owner

---

## 11. Security Considerations

### 11.1 Authentication
- Private users use separate auth storage key (`private-auth`)
- No cross-contamination with dealer sessions
- Mock OTP `9876` only in development (env check)

### 11.2 Authorization
- Private users can ONLY manage their own vehicles
- Dealers can view but NOT edit private listings
- Admins have full control over private users and listings

### 11.3 Data Validation
- Enforce max 3 vehicles per private user (app-level)
- Validate phone format (10 digits, starts with 05)
- Validate `is_private_listing` matches owner type
- Check `vehicle_owner_check` constraint

### 11.4 RLS Policies
- Private users: SELECT/UPDATE own profile, SELECT/INSERT/UPDATE/DELETE own vehicles
- Dealers: SELECT private listings (status=available)
- Admins: Full access to all private users and vehicles

---

## 12. Excluded Features (Not for Private Users)

- ❌ Internal chat/messaging system
- ❌ Vehicle boosts (hot sales)
- ❌ Auctions (creating or bidding)
- ❌ ISO requests (required cars)
- ❌ Dealer search/discovery
- ❌ Subscription plans
- ❌ Mobile app access
- ❌ More than 3 vehicle listings

---

## 13. Future Enhancements (Post-MVP)

1. **019sms.co.il Integration** - Real SMS OTP instead of mock
2. **Email Notifications** - Alert when dealer views vehicle
3. **Analytics Dashboard** - Views, contacts for private listings
4. **Vehicle History** - Track sold vehicles
5. **Mobile App Support** - Extend to mobile if demand exists
6. **Payment Integration** - Paid listing promotion options

---

## Document Status

**Version:** 1.0  
**Author:** AI Assistant  
**Last Review:** 2025-11-30  
**Next Review:** After Phase 1 completion

**Approval Status:**
- [ ] Technical Review
- [ ] Security Review  
- [ ] UX Review
- [ ] Product Owner Approval

---

**End of Specification Document**
