# Auto-Hub Project Development Guidelines

## MANDATORY: Pre-Development File Review
Before making ANY changes to the Auto-Hub project, you MUST review these specification files:

1. **PROJECT_SPEC.md** - Core project requirements, user types, entities, and business rules
2. **docs/MOBILE_SCREENS_SPEC.md** - Complete mobile screen specifications with RTL requirements
3. **docs/ADMIN_SCREENS_SPEC.md** - Complete admin screen specifications with desktop RTL requirements  
4. **DEVELOPMENT_PROMPT.md** - Development guidelines and RTL implementation patterns

## CRITICAL: RTL (Hebrew) Requirements
This is a Hebrew RTL application. Every component must:
- Support right-to-left text flow (`dir="rtl"`)
- Position icons on the LEFT side of text (opposite of LTR)
- Use RTL-appropriate margins, padding, and spacing
- Implement proper Hebrew text handling and Arabic numerals within RTL context

## Architecture Separation
- **Mobile System**: `/mobile/*` routes using `MobileLayout`
- **Admin System**: `/admin/*` routes using `AdminDesktopLayout`  
- **NO Cross-Dependencies**: Mobile and Admin components are completely separate
- **Shared UI Only**: Only `/components/ui/*` components can be shared between systems

## Development Process
1. **Check Specifications**: Always reference the spec files before coding
2. **Follow RTL Patterns**: Use the patterns defined in `DEVELOPMENT_PROMPT.md`
3. **Update Documentation**: If requirements change, update the relevant spec files
4. **Maintain Consistency**: Ensure all screens follow the established patterns
5. **Mock Data First**: Implement with mock data before adding real API integration

## File Update Requirements
When implementing new features or changing requirements:
- Update `PROJECT_SPEC.md` if entities, business rules, or user types change
- Update screen specification files if UI/UX requirements change  
- Maintain consistency across all documentation
- Add new screens or components to the appropriate specification files

This ensures all development is aligned with project requirements and maintains consistency across the entire application.

## Current Implementation Status

### ✅ **Complete Mobile Screens (13/13)**
All mobile screens are now fully implemented:

1. **DashboardScreen** (`/mobile/`) - Main dashboard with stats and activity
2. **CarSearchScreen** (`/mobile/search`) - Vehicle search with filters
3. **ChatListScreen** (`/mobile/chats`) - List of chat conversations
4. **ChatDetailScreen** (`/mobile/chat/:id`) - Individual chat interface
5. **NotificationListScreen** (`/mobile/notifications`) - System notifications
6. **AuctionListScreen** (`/mobile/auctions`) - List of auctions
7. **AuctionDetailScreen** (`/mobile/auction/:id`) - Auction details and bidding
8. **VehicleDetailScreen** (`/mobile/vehicle/:id`) - Detailed vehicle information
9. **AddVehicleScreen** (`/mobile/add-vehicle`) - Multi-step vehicle creation form
10. **AddAuctionScreen** (`/mobile/add-auction`) - Multi-step auction creation form
11. **MyProfileScreen** (`/mobile/profile`) - User profile and settings
12. **ISORequestsScreen** (`/mobile/car-search-requests`) - ISO requests management
13. **NotFound** (`/mobile/*`) - 404 error page

### ✅ **Complete Admin Screens (14/14)**
All admin screens are implemented:

1. **AdminDashboard** (`/admin/`) - Main admin dashboard
2. **AdminUsersList** (`/admin/users`) - Users management list
3. **AdminUserDetail** (`/admin/users/:id`) - Individual user details
4. **AdminVehiclesList** (`/admin/vehicles`) - Vehicles management list
5. **AdminVehicleDetail** (`/admin/vehicles/:id`) - Individual vehicle details
6. **AdminVehicleRequestsList** (`/admin/vehicle-requests`) - Vehicle requests list
7. **AdminVehicleRequestDetail** (`/admin/vehicle-requests/:id`) - Request details
8. **AdminAuctionsList** (`/admin/auctions`) - Auctions management list
9. **AdminAuctionDetail** (`/admin/auctions/:id`) - Individual auction details
10. **AdminSupportTickets** (`/admin/support`) - Support tickets list
11. **AdminSupportTicketDetail** (`/admin/support/:id`) - Ticket details
12. **AdminReports** (`/admin/reports`) - Analytics and reporting
13. **AdminSettings** (`/admin/settings`) - System configuration
14. **AdminNotifications** (`/admin/notifications`) - Admin notifications

## Key Implementation Details

### Mobile Screen Features
- **RTL-first design** with proper Hebrew text support
- **Multi-step forms** for complex operations (Add Vehicle, Add Auction)
- **Real-time chat interface** with message history
- **Auction bidding** with live countdown timers
- **Comprehensive vehicle details** with image galleries
- **Navigation consistency** across all screens
- **Mock data integration** ready for API replacement

### Navigation Architecture
```
/mobile/
├── / (Dashboard)
├── /search (Car Search)
├── /chats (Chat List)
├── /chat/:id (Chat Detail)
├── /notifications (Notifications)
├── /auctions (Auction List)
├── /auction/:id (Auction Detail)
├── /vehicle/:id (Vehicle Detail)
├── /add-vehicle (Add Vehicle Form)
├── /add-auction (Add Auction Form)
├── /profile (User Profile)
├── /car-search-requests (ISO Requests)
└── /* (Not Found)

/admin/
├── / (Dashboard)
├── /users (Users List)
├── /users/:id (User Detail)
├── /vehicles (Vehicles List)
├── /vehicles/:id (Vehicle Detail)
├── /vehicle-requests (Requests List)
├── /vehicle-requests/:id (Request Detail)
├── /auctions (Auctions List)
├── /auctions/:id (Auction Detail)
├── /support (Support List)
├── /support/:id (Support Detail)
├── /reports (Reports)
├── /settings (Settings)
└── /notifications (Notifications)
```

### Design System Usage
All screens use the established design system:
- **Semantic color tokens** from `index.css`
- **RTL spacing** with `space-x-reverse` patterns
- **Card interactions** with `card-interactive` class
- **Hebrew typography** with `hebrew-text` class
- **Consistent loading states** and error handling
- **Mobile-first responsive** design patterns

### Mock Data Patterns
Each screen includes realistic Hebrew mock data:
- **User information** with Hebrew names
- **Vehicle specifications** in Hebrew
- **Chat conversations** in Hebrew
- **Auction details** with proper pricing
- **Form validation** with Hebrew messages

This implementation provides a complete, fully functional Auto-Hub application interface ready for backend integration.