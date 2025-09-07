Admin Desktop Screens Specification - Auto-Hub
Overview
This document specifies all admin desktop screens for the Auto-Hub application. The admin interface is designed for desktop use with RTL (Hebrew) support and comprehensive management capabilities.
Screen Navigation Structure

AdminDesktopLayout
├── AdminDesktopHeader (Logo, Notifications, User Menu)
├── AdminDesktopSidebar (Navigation Menu)
├── Main Content Area
└── Footer (Copyright)
Navigation Menu Items
לוח בקרה (Dashboard)
עדכונים (Notifications)
ניהול משתמשים (User Management)
ניהול רכבים (Vehicle Management)
רכבים דרושים (Vehicles Wanted)
מכירות פומביות (Auctions)
פניות תמיכה (Support Tickets)
דוחות (Reports) - Visible to Admins only
הגדרות (Settings) - Visible to Admins only
1. Admin Dashboard (/admin)
File: src/pages/admin/AdminDashboard.tsx
Purpose
Main overview screen for administrators with key metrics and quick actions.
Layout Requirements
RTL Grid Layout: Statistics cards in a right-to-left flow.
Charts Section: Visual representation of key data trends.
Recent Activity: A feed showing the latest important activities in the system.
Components & Data
Statistics Cards:
Users: Total active users, new users (last 24h), users pending approval.
Vehicles: Total active listings, new listings awaiting approval.
Auctions: Total active auctions, new auctions created today.
Support: Total open support tickets, new tickets today.
Charts:
User registration trends (e.g., bar chart for the last 7 days).
Vehicle listing trends.
Recent Notifications Feed: A list of the 5 most recent notifications (e.g., "New dealer 'Auto Gal' is awaiting approval"). Each notification is a link to the relevant entity. Includes a "View All" link.
2. User Management Section
2.1 Users List (/admin/users)
File: src/pages/admin/AdminUsersList.tsx
Purpose
Display, filter, and manage all system users.
Layout Requirements
Tabs: Filter the list by status: "כל המשתמשים" (All Users), "ממתינים לאישור" (Pending Approval), "חדשים" (New).
Search and Filters: Search by name/business, filter by plan or status.
Data Table: A sortable, paginated table of users.
Action Buttons: An "+ הוסף משתמש חדש" (Add New User) button.
Table Columns (RTL)
משתמש (User): Profile picture, Full Name, Business Name.
סטטוס (Status): Colored badge (Active, Pending, Suspended).
תוכנית (Plan): Subscription plan (e.g., Premium).
רכבים (Cars): Count of active listings.
מכירות (Auctions): Count of active auctions.
חיפושים (Searches): Count of active "Vehicles Wanted" requests.
פעילות אחרונה (Last Active): Date and time.
פעולות (Actions): Dropdown menu with View, Edit, Approve, Suspend, Delete options.
2.2 User Detail (/admin/users/:id)
File: src/pages/admin/AdminUserDetail.tsx
Purpose
Detailed view and in-depth management of a single user account.
Layout Requirements
User Profile Card: Displays primary user information (photo, name, business, status).
Action Buttons: Prominent buttons for primary actions like Suspend, Activate, Delete.
Tabbed Interface:
Tab 1 - פרטי משתמש (User Details): Displays all user data (phone, location, tenure, trade license). An "Edit Details" button is available.
Tab 2 - רשימת רכבים (Vehicle List): A table of all vehicles listed by this user.
Tab 3 - מכירות פומביות (Auctions): A table of all auctions created by this user.
Tab 4 - רכבים דרושים (Vehicles Wanted): A table of requests created by this user.
3. Vehicle Management Section
3.1 Vehicles List (/admin/vehicles)
File: src/pages/admin/AdminVehiclesList.tsx
Purpose
A unified screen to manage all vehicle listings and approval requests.
Layout Requirements
Tabs: Filter listings by status: "מאושרים" (Approved), "ממתינים לאישור" (Pending), "נדחו" (Rejected).
Advanced Filters: Filter by make, model, year, owner, etc.
Bulk Actions: Checkboxes to select multiple listings for batch approval or rejection.
Table Columns (RTL)
תמונה (Image): Vehicle thumbnail.
יצרן ודגם (Make & Model): Including year.
בעלים (Owner): Name of the dealer.
מחיר (Price).
סטטוס (Status): Approved, Pending, Rejected.
תאריך העלאה (Upload Date).
פעולות (Actions): View, Edit, Approve/Reject.
3.2 Vehicle Detail (/admin/vehicles/:id)
File: src/pages/admin/AdminVehicleDetail.tsx
Purpose
Detailed review and management of a single vehicle listing.
Layout Requirements
Vehicle Gallery: A carousel for all vehicle images.
Specifications Table: A detailed table of all vehicle data.
Owner Information Panel: A card with the owner's details and a link to their profile.
Approval/Rejection Controls: If the vehicle is pending, display prominent "Approve" and "Reject" buttons.
4. Auctions Management Section
4.1 Auctions List (/admin/auctions)
File: src/pages/admin/AdminAuctionsList.tsx
Purpose
Monitor and manage all system auctions.
Layout Requirements
Status Tabs: Filter auctions: "פעילות" (Active), "מתוכננות" (Scheduled), "הסתיימו" (Completed).
Auction Table: A sortable table with key auction data.
Table Columns (RTL)
כלי רכב (Vehicle): Image and title.
מחיר התחלתי (Starting Price).
הצעה נוכחית (Current Bid).
זמן נותר (Time Remaining): A live countdown timer.
משתתפים (Participants): Number of bidders.
סטטוס (Status).
פעולות (Actions): View.
4.2 Auction Detail (/admin/auctions/:id)
File: src/pages/admin/AdminAuctionDetail.tsx
Purpose
Detailed monitoring and management of a single auction.
Layout Requirements
Auction Info Panel: Displays key details about the vehicle and auction rules.
Live Bidding Feed: A real-time log of incoming bids.
Participant List: A list of all bidders and their bid amounts.
Admin Controls: Buttons to Pause, Extend, or Cancel the auction if necessary.
5. Support Management Section
5.1 Support Tickets List (/admin/support)
File: src/pages/admin/AdminSupportTickets.tsx
Purpose
Manage all customer support requests and user-filed reports.
Layout Requirements
Ticket Status Filters: Tabs for "פתוח" (Open), "בטיפול" (In Progress), "סגור" (Resolved).
Assignment Controls: A dropdown on each ticket to assign it to a support agent.
Table Columns (RTL)
מספר כרטיס (Ticket ID).
נושא (Subject).
משתמש מדווח (Reporting User).
סטטוס (Status).
נציג מטפל (Assigned Agent).
תאריך פתיחה (Created Date).
פעולות (Actions): View.
5.2 Support Ticket Detail (/admin/support/:id)
File: src/pages/admin/AdminSupportTicketDetail.tsx
Purpose
Detailed ticket management, investigation, and resolution.
Layout Requirements
Ticket Information Panel: Displays the full issue description and user details.
Conversation Thread: A chat interface for communicating with the reporting user.
Evidence Viewer: A section to review the original chat log between the involved dealers (read-only).
Resolution Form: Fields for internal notes, a dropdown to set the final decision, and action buttons.
6. Reports Section (/admin/reports)
File: src/pages/admin/AdminReports.tsx
Purpose
Generate and view system analytics and reports.
Layout Requirements
Report Selection: A list or dropdown of available report types.
Filter Controls: Date range pickers and other relevant filters.
Data Visualization: Area for displaying charts and data tables.
Export Options: Buttons to export the generated report (PDF, Excel).
7. Settings Section (/admin/settings)
File: src/pages/admin/AdminSettings.tsx
Purpose
Configure global system parameters.
Layout Requirements
Tabbed Interface: Separate tabs for different setting categories (System, Users, Auctions).
Configuration Forms: Forms with input fields, toggles, and dropdowns for each setting.
8. Notifications Screen (/admin/notifications)
File: src/pages/admin/AdminNotifications.tsx
Purpose
View a complete, filterable history of all system notifications.
Layout Requirements
Filter Tabs: Filter notifications by category: "הכל" (All), "לא נקראו" (Unread), "משתמשים" (Users), "דיווחים" (Reports).
Notification List: A scrollable list of all notifications.
List Columns (RTL)
סוג (Type): An icon representing the notification type.
תיאור (Description): The full text of the notification.
תאריך (Date/Time).