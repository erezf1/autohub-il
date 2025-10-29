# Project Specification - Auto-Hub

## Project Overview
Auto-Hub is a B2B digital marketplace platform designed for licensed car dealers in Israel. The system provides a secure, members-only environment where verified dealers can manage inventory, search for vehicles, make offers, participate in auctions, and communicate through an integrated chat system. The platform operates with a Hebrew RTL interface and implements comprehensive user verification and reputation management.

## User Types & Features

### Mobile Users (Dealers/Car Traders)
Licensed car dealers who use the mobile application to:
- **Inventory Management**: Add, edit, and manage vehicle listings with detailed specifications
- **Vehicle Search**: Advanced search with filters (make, model, year, price, location, tags)
- **ISO Requests**: Create "Vehicles Wanted" requests and receive matching offers
- **Auction Participation**: Create auctions for their vehicles and bid on others' auctions
- **Communication**: Internal chat system with contact detail reveal functionality
- **Boost Features**: Priority placement for listings (3-day cycles)
- **Profile Management**: Business profile, trade license verification, ratings

### Admin Users (Web Desktop)
System administrators who manage the platform through a web interface:
- **User Management**: Approve/reject dealer registrations, manage user status
- **Content Moderation**: Review listings, handle reported content
- **Auction Oversight**: Monitor auction activities, resolve disputes
- **Support Management**: Handle support tickets and user reports
- **System Analytics**: View platform metrics, user activities, and business insights
- **Configuration**: Manage system settings, subscription plans, and business rules

### Support Staff (Web Desktop)
Customer support representatives with limited administrative access:
- **Ticket Management**: Handle user support requests and technical issues
- **Investigation Tools**: Access user data for support purposes
- **Moderation Actions**: Handle user reports and content violations
- **Communication**: Internal messaging with users and escalation to admins

## Entities & Data Models

### User Entity
**Core Properties**: ID (UUID), phone_number, password_hash, user_role (dealer/admin/support), status (pending/active/suspended/rejected)
**Profile Properties**: full_name, business_name, location, trade_license, tenure, rating_tier, subscription_type (regular/gold/vip), subscription_valid_until, available_boosts, available_auctions, vehicles_limit
**Relationships**: 1:Many with vehicles, auctions, ISO requests, chat conversations, notifications
**Operations**: Registration, profile updates, status changes, subscription management

### Vehicle Entity
**Core Properties**: ID, owner_id, make_id, model_id, sub_model (vehicle type category), year, kilometers, price, transmission, fuel_type, engine_size, color, images
**Vehicle Type (sub_model)**: Predefined categories - micro (מיקרו), mini (מיני), family (משפחתי), executive (מנהלים), suv (SUV), luxury (יוקרתי), sport (ספורט)
**Status Properties**: status (available/sold/removed), is_boosted, boosted_until, had_severe_crash
**Metadata**: description, test_result_file, previous_owners, tags (through junction table)
**Relationships**: 1:Many with auctions, ISO offers; Many:Many with tags
**Operations**: CRUD operations, search filtering, boost activation, status updates

### Auction Entity
**Core Properties**: ID, vehicle_id, creator_id, auction_type (standard/reserve/buy_now), starting_price, reserve_price, current_highest_bid
**Timing**: auction_start_time, auction_end_time, status (scheduled/active/completed/cancelled)
**Bidding**: bid_count, highest_bidder_id
**Relationships**: 1:Many with auction_bids, 1:1 with vehicle_listings
**Operations**: Create auction, place bids, auto-bid updates, completion handling

### ISO Request Entity (Vehicles Wanted)
**Core Properties**: ID, requester_id, title, description, status (active/completed/expired)
**Search Criteria**: make_id, model_id, year_from, year_to, price_from, price_to, max_kilometers
**Preferences**: transmission_preference, fuel_type_preference, location_id
**Relationships**: 1:Many with ISO offers
**Operations**: Create requests, receive offers, automatic matching, status management

### ISO Offer Entity
**Core Properties**: ID, iso_request_id, vehicle_id, offerer_id, offered_price, message
**Status**: status (pending/accepted/rejected/expired), expires_at
**Relationships**: Many:1 with ISO requests, vehicles, and users
**Operations**: Submit offers, accept/reject offers, expiration handling

### Chat System Entities
**Conversations**: ID, participant_1_id, participant_2_id, vehicle_id, auction_id, iso_request_id, is_details_revealed, details_revealed_by
**Messages**: ID, conversation_id, sender_id, message_content, message_type, is_read, read_at
**Entity-Based**: Each conversation is tied to one entity (vehicle, auction, or ISO request)
**Uniqueness Rule**: One conversation per (user pair + entity) - no duplicates
**Relationships**: Users have many conversations, conversations have many messages
**Operations**: Create conversations, send messages, reveal contact details, mark as read
**Backend Client**: All operations use `dealerClient` for auth session consistency
**Anonymous Display Rules**:
  - Dealer anonymity until details revealed: "סוחר #XXXXX" (5 random digits)
  - Different number per conversation (even for same dealer)
  - Consistent within each conversation
  - Last message shows sender prefix: "אתה:" or "סוחר:"
  - Chat list has no profile pictures (text-focused interface)
  - Auto-refresh on navigation to show current state

### Notification Entities
**User Notifications**: For mobile dealers (registration_approved, auction_outbid, iso_match, message_received, etc.)
**Admin Notifications**: For admin users (new_user_registration, user_report, auction_completed, etc.)
**Properties**: recipient_id, notification_type, title, description, is_read, related_entity_type, related_entity_id
**Operations**: Create notifications, mark as read, real-time updates

### Support Ticket Entity
**Core Properties**: ID, reporter_id, reported_user_id, ticket_type, subject, description, priority, status
**Management**: assigned_to, resolution_notes, resolved_at, category
**Relationships**: 1:Many with support_ticket_messages
**Operations**: Create tickets, assign to staff, update status, add comments

### Lookup Tables
**Vehicle Makes**: Hebrew and English names for car manufacturers
**Vehicle Models**: Per-make vehicle models with Hebrew/English names
**Vehicle Tags**: Categorized tags (condition, category, feature) with colors
**Locations**: Israeli cities and regions for location-based features
**Subscription Plans**: Plan definitions (regular/gold/vip) with max_vehicles, monthly_boosts, monthly_auctions, price_monthly

## Business Rules & Logic

### Subscription Plans & Limits
- **Regular Plan**: Up to 10 vehicles, 5 boosts per month, 5 auctions per month
- **Gold Plan**: Up to 25 vehicles, 10 boosts per month, 10 auctions per month
- **VIP Plan**: Up to 100 vehicles, 99 boosts per month, 99 auctions per month

### Boost System ("Hot Cars")
- **Boost Duration**: Fixed 5-day priority placement in Hot Cars section
- **Optional Hot Sale Price**: Dealers can set special pricing for boosted vehicles
- **Boost Allocation**: Based on subscription plan (stored in `subscription_plans` table)
  - **Regular**: 5 boosts/month
  - **Gold**: 10 boosts/month  
  - **VIP**: 99 boosts/month
- **Boost Counting Logic**: 
  - Uses `get_remaining_boosts(user_id)` RPC function
  - Counts boost activations (not just currently active boosts)
  - Formula: `remaining = monthly_allocation - boosts_activated_this_month`
- **Monthly Reset**: Boost limits refresh at beginning of each month (1st)
- **Visibility**: Users see only other dealers' boosted vehicles (not their own)
- **Communication**: Dealers contact via existing chat system for hot car inquiries
- **Automatic Expiration**: Boosts automatically deactivate after 5 days

**Boost Management Flow**:
1. Dealer navigates to Boost Management screen from Dashboard or Hot Cars tab
2. Views active boosts (if any) at top of screen with countdown timers
3. Clicks prominent "הוסף בוסט חדש" button to activate new boost
4. Vehicle Selection Drawer opens showing eligible (non-boosted) vehicles
5. Selects vehicle → Boost Configuration Dialog appears
6. Optionally sets hot sale price (can keep original price)
7. Confirms activation → Boost activates immediately for 5 days
8. Active Boosts section updates in real-time with new boosted vehicle

### Auction Rules
- Auction types: Standard, Reserve (minimum price), Buy-Now (instant purchase)
- Bidding increments and validation
- Automatic outbid notifications
- Auction completion and winner determination

### User Rating System
- Calculated based on activity volume and response times
- Rating tiers: Bronze, Silver, Gold, Platinum
- Background calculation process for performance

### Security & Verification
- Trade license verification for dealer registration
- Admin approval required for new accounts
- Status management (pending, active, suspended, rejected)
- Audit logging for significant actions

### Communication Rules
- Anonymous initial chat with contact reveal option
- One-way contact reveal (first revealer pays/gets benefits)
- **Smart Button Labels**: Buttons dynamically show "חזרה לצ'אט" (Return to chat) if conversation exists, or "שלח הודעה" (Send message) if no conversation exists
- **Conversation Uniqueness**: One conversation per (user pair + entity) to prevent duplicates
- **Entity-Based Conversations**: All chats linked to specific vehicle, auction, or ISO request
- Real-time messaging with read receipts
- Message read receipts and real-time updates

## Technical Requirements

### Authentication System
- 6-digit password-based authentication (simplified from OTP)
- Phone number as primary identifier
- Role-based access control (dealer/admin/support)
- Session management and security

### Real-time Features
- Live auction bidding with WebSocket connections
- Real-time chat messaging
- Instant notification delivery
- Live counter updates (unread messages, notifications)

### Database Architecture
- **Supabase/PostgreSQL**: Primary database with RLS policies
- **Row Level Security**: User isolation and admin access control
- **Real-time Subscriptions**: For notifications, chat, and auctions
- **Performance Indexes**: Optimized for search and filtering operations

### Mobile RTL Support
- Hebrew right-to-left text flow
- Proper icon and layout positioning for RTL
- Arabic numerals within Hebrew context
- Cultural UI/UX considerations for Israeli market

### File Storage & Management
- Trade license document uploads
- Vehicle image storage (multiple images per listing)
- Test result document uploads
- Profile pictures and business logos

### Search & Filtering
- Advanced vehicle search with multiple criteria
- Full-text search capabilities
- Tag-based categorization and filtering
- Location-based search and results

### Performance & Scalability
- Database indexing for search operations
- Image optimization and lazy loading
- Real-time connection management
- Efficient notification delivery system

## Implementation Architecture

### Mobile System (`/mobile/*`)
- React components with RTL support
- MobileLayout with header and tab navigation
- Real-time subscriptions for notifications and chat
- Camera integration for vehicle photos

### Admin System (`/admin/*`)
- Desktop web interface with AdminDesktopLayout
- Comprehensive management dashboards
- Data visualization and reporting tools
- Batch operations for user and content management

### Shared Components
- UI component library (`/components/ui/*`)
- Utility functions and hooks
- Common types and interfaces
- Shared business logic functions
- **Shared Constants** (`/src/constants/*`):
  - `vehicleTypes.ts`: 7 predefined vehicle categories with Hebrew labels
  - Used across mobile and admin for consistent vehicle type selection
  - Helper function `getVehicleTypeLabel()` for display conversion

### API Integration
- Supabase client configuration
- Database functions and triggers
- Real-time subscription management
- File upload and storage handling

---

*This specification serves as the primary reference for development and feature implementation. All database schema details are documented in `docs/DATABASE_SCHEMA_SPEC.md`.*

---
*This specification serves as the primary reference for development and feature implementation.*