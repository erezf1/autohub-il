# Admin Desktop Screens Specification - Auto-Hub

## Overview
This document specifies all admin desktop screens for the Auto-Hub application. The admin interface is designed for desktop use with RTL (Hebrew) support and comprehensive management capabilities.

## Admin Authentication
**File**: `src/pages/admin/AdminLoginScreen.tsx`

### Login Flow
- **Phone Number + Password**: 6-digit password authentication (not OTP)
- **Admin Client**: Uses separate auth storage (`adminClient` with storageKey: 'admin-auth')
- **Auto-Redirect Behavior**: 
  - Authenticated admins are redirected to dashboard automatically
  - Intentional navigation to `/admin/login` allows manual re-login without auto-redirect
  - Prevents login loop while enabling fresh authentication
- **Session Management**: Separate from mobile dealer sessions

## Screen Navigation Structure
```
AdminDesktopLayout
├── AdminDesktopHeader (Logo, Notifications, User Menu)
├── AdminDesktopSidebar (Navigation Menu)
├── Main Content Area
└── Footer (Copyright)
```

## Navigation Menu Items
- לוח בקרה (Dashboard)
- ניהול משתמשים (User Management)
- ניהול כלי רכב (Vehicle Management)
- מכירות פומביות (Auctions)
- דוחות (Reports)
- הגדרות (Settings)
- תמיכה (Support)

## 1. Admin Dashboard (`/admin`)
**File**: `src/pages/admin/AdminDashboard.tsx`

### Purpose
Main overview screen for administrators with key metrics and quick actions.

### Layout Requirements
- **RTL Grid Layout**: Statistics cards in RTL flow
- **Charts Section**: Visual data representation
- **Recent Activity**: Latest system activities
- **Quick Actions**: Common admin tasks

### Components Needed
- Statistics cards:
  - Total active users
  - Total vehicles in system
  - Active auctions count
  - Support tickets pending
- Charts and graphs:
  - User registration trends
  - Vehicle listing trends
  - Auction participation rates
- Recent activity feed
- Quick action buttons

### Data Requirements
- Real-time system statistics
- Chart data for trends
- Recent user activities
- System health indicators

## 2. User Management Section

### 2.1 Users List (`/admin/users`)
**File**: `src/pages/admin/AdminUsersList.tsx`

### Purpose
Display and manage all system users (dealers, traders).

### Layout Requirements
- **Search and Filters**: User search functionality
- **Data Table**: Sortable columns with RTL headers
- **Action Buttons**: View, Edit, Suspend user actions
- **Pagination**: Handle large user datasets

### Table Columns (RTL)
- שם משתמש (Username)
- שם מלא (Full Name)  
- אימייל (Email)
- טלפון (Phone)
- סטטוס (Status)
- תאריך הרשמה (Registration Date)
- פעולות (Actions)

### Components Needed
- Search bar with filters
- Sortable data table
- Status badges (active, suspended, pending)
- Action dropdown menus
- User status toggle controls

### 2.2 User Detail (`/admin/users/:id`)
**File**: `src/pages/admin/AdminUserDetail.tsx`

### Purpose
Detailed view and management of individual user accounts.

### Layout Requirements
- **User Profile Section**: Basic information display
- **Activity History**: User's system activities
- **Vehicles and Auctions**: User's listings and participation
- **Account Actions**: Suspend, activate, delete options

### Components Needed
- User profile card with photo and details
- Activity timeline
- Related vehicles table
- Auction participation history
- Account management controls

## 3. Vehicle Management Section

### 3.1 Vehicles List (`/admin/vehicles`)
**File**: `src/pages/admin/AdminVehiclesList.tsx`

### Purpose
Manage all vehicle listings in the system.

### Layout Requirements
- **Vehicle Grid/Table View**: Toggle between views
- **Advanced Filters**: Make, model, year, status filters
- **Bulk Actions**: Approve, reject multiple listings

### Table Columns (RTL)
- תמונה (Image)
- יצרן ודגם (Make & Model)
- שנת ייצור (Year)
- מחיר (Price)
- בעלים (Owner)
- סטטוס (Status)
- תאריך העלאה (Upload Date)
- פעולות (Actions)

### Components Needed
- View toggle (grid/table)
- Advanced filter panel
- Vehicle image thumbnails
- Status approval controls
- Bulk action checkboxes

### 3.2 Vehicle Detail (`/admin/vehicles/:id`)
**File**: `src/pages/admin/AdminVehicleDetail.tsx`

### Purpose
Detailed vehicle information and management.

### Layout Requirements
- **Vehicle Gallery**: Image carousel
- **Specifications Table**: Detailed vehicle specs with RTL support
- **Owner Information**: Vehicle owner details
- **Approval Controls**: Approve/reject vehicle listing

### Summary Card Layout
- **First Row (4 columns)**: Price, Mileage, Year, Status
- **Second Row (3 columns)**: Type (סוג), Owner, Creation Date
- **RTL Styling**: All cards use `dir="rtl"` and `text-right` classes
- **Vehicle Type**: Displayed with Hebrew label from `vehicleTypes.ts` constants
- **Removed Fields**: "תאונה חמורה" (severe crash) badge and field removed from summary

### Technical Specifications Section
- **RTL Grid Layout**: `dir="rtl"` on CardContent and grid containers
- **Fields Displayed**: 
  - סוג (Type) - from predefined constants
  - תיבת הילוכים (Transmission)
  - סוג דלק (Fuel Type)
  - נפח מנוע (Engine Size)
  - צבע (Color)
  - בעלים קודמים (Previous Owners)
  - קובץ תוצאות בדיקה (Test Results)
- **Removed**: "תאונה חמורה" field completely removed

### Components Needed
- Image gallery with zoom
- RTL-aware specifications data table
- Owner contact information
- Approval/rejection workflow
- History and comments section

### 3.3 Vehicle Requests List (`/admin/vehicle-requests`)
**File**: `src/pages/admin/AdminVehicleRequestsList.tsx`

### Purpose
Manage pending vehicle listing requests.

### Layout Requirements
- **Pending Requests Table**: Awaiting approval
- **Quick Actions**: Batch approval/rejection
- **Priority Indicators**: Urgent requests highlighting

### Components Needed
- Requests data table
- Priority badges
- Quick approval buttons
- Batch selection controls
- Request details preview

### 3.4 Vehicle Request Detail (`/admin/vehicle-requests/:id`)
**File**: `src/pages/admin/AdminVehicleRequestDetail.tsx`

### Purpose
Detailed review of individual vehicle listing requests.

### Layout Requirements
- **Request Information**: Complete vehicle details
- **Verification Tools**: Image and document review
- **Approval Workflow**: Accept/reject with comments

### Components Needed
- Complete vehicle form display
- Image verification tools
- Document review section
- Approval decision form
- Comments and notes area

## 4. Auctions Management Section

### 4.1 Auctions List (`/admin/auctions`)
**File**: `src/pages/admin/AdminAuctionsList.tsx`

### Purpose
Monitor and manage all system auctions.

### Layout Requirements
- **Auction Status Tabs**: Active, Scheduled, Completed
- **Auction Table**: With timing and bid information
- **Management Controls**: Start, pause, end auctions

### Table Columns (RTL)
- כלי רכב (Vehicle)
- מחיר התחלתי (Starting Price)
- הצעה נוכחית (Current Bid)
- זמן נותר (Time Remaining)
- משתתפים (Participants)
- סטטוס (Status)
- פעולות (Actions)

### Components Needed
- Status filter tabs
- Countdown timers display
- Bid history preview
- Auction control buttons
- Participant count indicators

### 4.2 Auction Detail (`/admin/auctions/:id`)
**File**: `src/pages/admin/AdminAuctionDetail.tsx`

### Purpose
Detailed auction monitoring and management.

### Layout Requirements
- **Auction Info Panel**: Vehicle and auction details
- **Live Bidding View**: Real-time bid updates
- **Participant List**: Active bidders information
- **Auction Controls**: Admin intervention options

### Components Needed
- Auction information card
- Real-time bidding interface
- Bidder list with activity
- Admin control panel
- Auction history timeline

## 5. Support Management Section

### 5.1 Support Tickets List (`/admin/support`)
**File**: `src/pages/admin/AdminSupportTickets.tsx`

### Purpose
Manage customer support requests and tickets.

### Layout Requirements
- **Ticket Status Filters**: Open, In Progress, Resolved
- **Priority Sorting**: Critical tickets first
- **Agent Assignment**: Ticket routing controls

### Table Columns (RTL)
- מספר כרטיס (Ticket Number)
- נושא (Subject)
- משתמש (User)
- עדיפות (Priority)
- סטטוס (Status)
- נציג (Assigned Agent)
- תאריך פתיחה (Created Date)
- פעולות (Actions)

### Components Needed
- Status and priority filters
- Ticket assignment controls
- Priority badges (critical, high, normal, low)
- Quick action buttons
- Search functionality

### 5.2 Support Ticket Detail (`/admin/support/:id`)
**File**: `src/pages/admin/AdminSupportTicketDetail.tsx`

### Purpose
Detailed support ticket management and resolution.

### Layout Requirements
- **Ticket Information**: User details and issue description
- **Conversation Thread**: Support chat history
- **Response Tools**: Reply and resolution options
- **Ticket Actions**: Close, escalate, reassign

### Components Needed
- Ticket details panel
- Conversation thread display
- Response composition area
- File attachment support
- Status update controls

## 6. Reports Section (`/admin/reports`)
**File**: `src/pages/admin/AdminReports.tsx`

### Purpose
Generate and view system analytics and reports.

### Layout Requirements
- **Report Categories**: Users, Vehicles, Auctions, Revenue
- **Date Range Selectors**: Custom period selection
- **Export Options**: PDF, Excel export functionality
- **Chart Visualizations**: Various data representations

### Components Needed
- Report type selection
- Date range picker (RTL calendar)
- Chart components (bar, line, pie)
- Export functionality buttons
- Data table displays

### Report Types
- User registration and activity reports
- Vehicle listing statistics
- Auction performance metrics
- Revenue and transaction reports
- Support ticket analytics

## 7. Settings Section (`/admin/settings`)
**File**: `src/pages/admin/AdminSettings.tsx`

### Purpose
System configuration and administrative settings.

### Layout Requirements
- **Settings Categories**: System, Users, Auctions, Notifications
- **Configuration Forms**: Various system parameters
- **Save/Cancel Actions**: Form submission controls

### Settings Categories
- **System Settings**: Site configuration, maintenance mode
- **User Settings**: Registration requirements, verification
- **Auction Settings**: Default parameters, rules
- **Notification Settings**: Email templates, SMS configuration

### Components Needed
- Tabbed settings interface
- Form inputs with validation
- Toggle switches for features
- Save confirmation dialogs
- Settings backup/restore options

## 8. Notifications (`/admin/notifications`)
**File**: `src/pages/admin/AdminNotifications.tsx`

### Purpose
Admin-specific notifications and system alerts.

### Layout Requirements
- **Notification Categories**: System alerts, user reports, auction updates
- **Read/Unread Status**: Visual distinction
- **Action Required**: Notifications needing admin response

### Components Needed
- Notification list with categories
- Read/unread indicators
- Action buttons for notifications
- Mark all as read functionality
- Notification preferences

## Common Admin Layout Components

### AdminDesktopHeader
- **Company Logo and Name**: Auto-Hub branding
- **Notifications Dropdown**: System alerts for admin
- **User Profile Component**: 
  - Displays logged-in admin's name (business_name or full_name)
  - Shows admin role (מנהל מערכת/תמיכה/סוחר)
  - Uses `adminClient` for data fetching (not regular supabase client)
  - Dropdown menu with "הפרופיל שלי" (disabled - coming soon) and "התנתק" (logout)
  - Proper error handling with toast notifications

### AdminDesktopSidebar
- **Navigation Menu**: Collapsible sidebar with all admin sections
- **Admin Info**: Current admin user display
- **Menu Item Icons**: Lucide React icons for each section
- **Active State**: Current page highlighting

### Data Tables (Common Specifications)
- **RTL Support**: All tables flow right-to-left
- **Sorting**: Clickable column headers
- **Pagination**: Handle large datasets
- **Search**: Global search functionality
- **Filters**: Column-specific filters
- **Actions**: Row-level action buttons/dropdowns

## RTL (Hebrew) Design Guidelines for Admin

### Table Design
- Headers align right with RTL text
- Action columns positioned on the right
- Sort indicators positioned appropriately for RTL
- Pagination controls flow right-to-left

### Form Layout
- Labels positioned to the right of inputs
- Required field indicators on the right
- Form validation messages in Hebrew
- Submit buttons on the right side

### Navigation
- Sidebar navigation flows from right
- Breadcrumbs display in RTL order
- Tab navigation maintains RTL flow

### Data Display
- Charts and graphs support RTL labels
- Date/time formatting follows Hebrew conventions
- Number formatting maintains proper directionality

### Card and Detail Pages RTL Implementation
**Critical for all admin detail pages:**
- All `Card` and `CardContent` components must include `dir="rtl"`
- Grid containers must have `className="text-right"` 
- Hebrew text elements must have `hebrew-text` class for proper font rendering
- Applied consistently across:
  - `AdminVehicleDetail.tsx`
  - `AdminUserDetail.tsx`
  - `AdminAuctionDetail.tsx`
  - `AdminVehicleRequestDetail.tsx`
  - `AdminSupportTicketDetail.tsx`

### Admin Edge Functions Error Handling
- All edge function errors return Hebrew messages
- Standard error format: `{ error: 'הודעת שגיאה בעברית' }`
- Applied to:
  - `admin-create-user`
  - `admin-add-vehicle`
  - `admin-update-vehicle`
- Consistent error messaging across all admin operations

---
*This specification should be referenced for all admin screen development and updates.*