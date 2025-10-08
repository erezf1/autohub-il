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

### 6. Car Search Screen (`/mobile/search`)
**File**: `src/pages/mobile/CarSearchScreen.tsx`

#### Purpose
Browse and search available vehicles in marketplace.

#### Layout Requirements
- **Search Bar**: RTL placeholder "חיפוש רכב"
- **Quick Filters**: "עד ₪50,000", "אחרי תאונה", "רכבי יוקרה", "אופנועים"
- **Results Grid**: Vehicle cards with boost indicators

#### Components Needed
- Advanced search with filters
- Vehicle cards showing boost status
- Empty state for no results
- Pull to refresh functionality

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
Display boosted vehicles with priority placement.

#### Layout Requirements
- **Boosted Indicator**: Clear visual indication of boost status
- **Time Remaining**: Countdown for boost expiration
- **Enhanced Cards**: Premium styling for boosted listings

#### Components Needed
- Boosted vehicle cards with special styling
- Boost countdown timers
- Filter by boost remaining time
- "Boost My Vehicle" call-to-action

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
- Display subscription plan (Regular/Silver/Unlimited)
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

#### Vehicle Type Field
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
- **Required**: Yes
- **RTL Support**: Hebrew labels with proper text alignment
- **Search/Filter**: Vehicle type is filterable in search screens using these categories

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
Manage boost usage and apply boosts to vehicle listings.

#### Layout Requirements
- **Available Boosts**: Current boost count from subscription
- **Active Boosts**: Currently boosted vehicles with timers
- **Boost Application**: Select vehicles to boost

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
Comprehensive vehicle information with enhanced PRD features.

#### Enhanced Features
- Boost status and boost option
- Create auction option
- Enhanced vehicle specifications per PRD data model
- Anonymous chat initiation
- Report vehicle/owner functionality

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