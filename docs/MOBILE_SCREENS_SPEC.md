# Mobile Screens Specification - Auto-Hub

## Overview
This document specifies all mobile screens for the Auto-Hub application. The mobile app is designed for dealers and car traders with RTL (Hebrew) interface support.

## Screen Navigation Flow
```
MobileLayout (RTL)
├── MobileHeader (Logo, Notifications, Chat)
├── Main Content Area
└── MobileTabBar (Bottom Navigation)
```

## 1. Dashboard Screen (`/mobile`)
**File**: `src/pages/mobile/DashboardScreen.tsx`

### Purpose
Main hub for dealers to access key features and view summary statistics.

### Layout Requirements
- **RTL Support**: All text and layout elements flow right-to-left
- **Header**: Company logo, notifications badge, chat badge
- **Content**: Dashboard cards with statistics and quick actions
- **Bottom Tab**: Active on "דף הבית" (Home) tab

### Components Needed
- Summary cards (total vehicles, active auctions, pending requests)
- Quick action buttons (add vehicle, search cars, view auctions)
- Recent activity feed
- Statistics charts (optional)

### Data Requirements
- User statistics (vehicles count, auction participation)
- Recent notifications preview
- Quick access to frequently used features

## 2. Car Search Screen (`/mobile/search`)
**File**: `src/pages/mobile/CarSearchScreen.tsx`

### Purpose
Allow dealers to search and filter available vehicles in the system.

### Layout Requirements
- **Search Bar**: With RTL placeholder text "חיפוש רכב"
- **Filter Chips**: Horizontal scrollable quick filters
- **Results List**: Vehicle cards with images and details
- **Empty State**: When no results found

### Components Needed
- Search input with filter icon
- Filter badges (manufacturer, year, price range)
- Vehicle result cards with:
  - Vehicle image
  - Title and details
  - Price display
  - Auction indicator (if applicable)

### Interactions
- Text search functionality
- Filter selection/deselection
- Navigate to vehicle detail on card click
- Pull to refresh results

## 3. Auction List Screen (`/mobile/auctions`)
**File**: `src/pages/mobile/AuctionListScreen.tsx`

### Purpose
Display active and upcoming auctions for dealer participation.

### Layout Requirements
- **Filter Tabs**: Active, Upcoming, Completed auctions
- **Auction Cards**: With countdown timers and bid information
- **Pull to Refresh**: Update auction status

### Components Needed
- Tab navigation for auction status
- Auction cards with:
  - Vehicle image and details
  - Current bid amount
  - Countdown timer
  - Bid button (for active auctions)
- Empty states for each tab

### Data Requirements
- Auction status and timing
- Current bid amounts
- User's bid history
- Countdown functionality

## 4. ISO Requests Screen (`/mobile/iso-requests`)
**File**: `src/pages/mobile/ISORequestsScreen.tsx`

### Purpose
Manage In Search Of (ISO) requests for specific vehicles.

### Layout Requirements
- **Request List**: User's active and completed ISO requests
- **Add Button**: Create new ISO request
- **Status Indicators**: Visual status of each request

### Components Needed
- ISO request cards with:
  - Requested vehicle specifications
  - Status badge
  - Creation date
  - Response count (if any)
- Floating action button to add new ISO
- Status filter options

## 5. Chat List Screen (`/mobile/chats`)
**File**: `src/pages/mobile/ChatListScreen.tsx`

### Purpose
Display all chat conversations between dealers and other parties.

### Layout Requirements
- **Chat List**: Conversations sorted by recent activity
- **Unread Indicators**: Badge for unread message count
- **Avatar Display**: Other party's profile picture

### Components Needed
- Chat conversation cards with:
  - Contact avatar and name
  - Chat subject/topic
  - Last message preview
  - Timestamp (RTL formatted)
  - Unread count badge

### Interactions
- Navigate to chat detail on conversation click
- Pull to refresh for new messages
- Long press for conversation options (archive, delete)

## 6. Notifications Screen (`/mobile/notifications`)
**File**: `src/pages/mobile/NotificationListScreen.tsx`

### Purpose
Display all system notifications grouped by date.

### Layout Requirements
- **Date Groups**: "היום", "אתמול", "השבוע" sections
- **Notification Cards**: With icons and descriptions
- **Read/Unread States**: Visual distinction

### Components Needed
- Date section headers
- Notification cards with:
  - Type-specific icons (with appropriate colors)
  - Title and description
  - Timestamp
  - Unread indicator dot

### Notification Types
- Auction updates (bid changes, auction end)
- ISO request responses
- System announcements
- Chat messages

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

### MobileTabBar
- **Navigation Tabs**: 
  - דף הבית (Home/Dashboard)
  - חיפוש (Search)
  - מכירות פומביות (Auctions) 
  - בקשות ISO (ISO Requests)
  - הודעות (Notifications)
- **Active State**: Visual indication of current screen
- **Badge Support**: Unread counts on relevant tabs

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

---
*This specification should be referenced for all mobile screen development and updates.*