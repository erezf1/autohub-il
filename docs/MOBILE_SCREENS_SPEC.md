Mobile Screens Specification - Auto-Hub
Overview
This document specifies all mobile screens for the Auto-Hub application. The mobile app is designed for dealers and car traders with a full RTL (Hebrew) interface and is intended to be the primary tool for their daily business operations.
Screen Navigation Flow
code
Code
MobileLayout (RTL)
├── MobileHeader (Logo, Notifications, Chat)
├── Main Content Area
└── MobileTabBar (Bottom Navigation)
1. Dashboard Screen (/dashboard)
File: src/pages/mobile/DashboardScreen.tsx
Purpose
The main landing screen after login, providing a quick overview of important activities and serving as a launchpad for common tasks.
Components & Data
Greeting: "בוקר טוב, [שם הסוחר]".
Updates Widget: A card with two clickable rows:
"הודעות צ'אט חדשות" (New Chat Messages) with a count of unread messages.
"התראות חדשות" (New Notifications) with a count of new notifications.
My Activity Widget: A card with two clickable rows:
"מודעות פעילות" (Active Listings) with the count of the user's active vehicle listings.
"רכבים דרושים" (Vehicles Wanted) with the count of the user's open requests.
Auctions Widget:
A clickable row: "מכירות פעילות" (Active Auctions) showing the total count of active auctions on the platform.
A preview list of "המכירות שלי" (My Auctions) showing the user's own active auctions with end date and highest bid.
User Actions
Tap any row in the widgets to navigate to the corresponding screen (e.g., Chat List, Notifications List, My Vehicles, etc.).
2. Vehicle Search Screen (/search)
File: src/pages/mobile/CarSearchScreen.tsx
Purpose
Allows dealers to search, filter, and discover all available vehicles listed by other users on the platform.
Components & Data
Search Bar: An input field with placeholder text "חפש לפי יצרן, דגם...".
Filter Button: An icon button to open an advanced filtering modal.
Quick Filter Chips: A horizontal, scrollable list of chips for common categories (e.g., "רכבי יוקרה", "רכבי שטח").
Results List: A vertically scrollable list of vehicle cards, each displaying:
Vehicle Image
Title (Make, Model, Year)
Key Details (Mileage, Transmission)
Price
User Actions
Enter text to perform a keyword search.
Tap the filter icon to open advanced filter options.
Tap a quick filter chip to apply a predefined filter.
Tap any vehicle card to navigate to the Vehicle Details Screen (8.1).
3. Vehicles Wanted Screen (/requests)
File: src/pages/mobile/VehiclesWantedScreen.tsx
Purpose
To view all open vehicle requests from the community and to manage one's own requests.
Layout & Components
Tab Navigation: Two tabs:
"כל הבקשות" (All Requests): (Default View) A list of all "Vehicles Wanted" requests from other dealers.
"הבקשות שלי" (My Requests): A list of requests created by the current user.
Request List Items: Each item in the list displays:
Request Title (e.g., "טויוטה קורולה 2020").
Requesting User's Business Name.
Creation Date.
Floating Action Button (+): A circular button to create a new request.
User Actions
Toggle between the "All" and "My" tabs.
Tap the floating (+) button to navigate to the Add/Edit Vehicle Wanted Screen (8.4).
4. Auctions Screen (/auctions)
File: src/pages/mobile/AuctionsScreen.tsx
Purpose
To discover and participate in active auctions and to manage one's own auctions.
Layout & Components
Tab Navigation: Two tabs:
"מכירות פעילות" (Active Auctions): (Default View) A list of all active auctions on the platform.
"המכירות שלי" (My Auctions): A list of auctions created by the current user.
Auction Cards: Each card displays:
Vehicle Image
Vehicle Title
Current Highest Bid amount.
A live countdown timer showing the time remaining.
User Actions
Toggle between the "Active" and "My" tabs.
Tap any auction card to navigate to the Auction Detail Screen (8.5 for bidding, 8.6 for managing).
5. My Vehicles Screen (/my-vehicles)
File: src/pages/mobile/MyVehiclesScreen.tsx
Purpose
To manage the user's own inventory of vehicle listings.
Layout & Components
Screen Title: "הרכבים שלי".
My Cars List: A scrollable list of the user's listings. Each item shows:
Vehicle Thumbnail
Vehicle Title
Status (e.g., "פעיל", "נמכר")
A Chat Badge with the count of unread messages for that vehicle.
Floating Action Button (+): A plus icon.
User Actions
Tap a list item to navigate to the Add/Edit Vehicle Screen (8.2).
Tap the chat badge to open a filtered Chat List Screen (6.0).
Tap the floating (+) button to navigate to the Add/Edit Vehicle Screen (8.2).
6. Chat List Screen (/chats)
File: src/pages/mobile/ChatListScreen.tsx
Purpose
To display and manage all of the user's conversations.
Layout & Components
Screen Title: "צ'אטים".
Chat List: A scrollable list of conversations. Each item shows:
Chat Subject (e.g., "המכירה שלך: #342").
Other Party's Name (anonymous or revealed).
Last message preview.
Timestamp.
Unread message badge.
User Actions
Tap a conversation to navigate to the Chat Conversation Screen (8.7).
7. My Profile & Settings Screen (/profile)
File: src/pages/mobile/MyProfileScreen.tsx
Purpose
Allows the user to view their account status and edit their personal and business information.
Layout & Components
Screen Title: "הפרופיל והגדרות".
Account Info Section: Displays non-editable data like Status ("פעיל") and current Plan.
Editable Info Section: Displays fields for Full Name, Business Name, Location, etc.
Edit Icon: An icon to toggle editing mode for the fields above.
Action Links: Links for "Support," "Terms of Use," and "Log Out."
User Actions
Tap the Edit Icon to enable editing of profile fields.
Save or cancel changes after editing.
Tap "Log Out" to sign out of the application.
8. Secondary & Action Screens
8.1. Vehicle Details Screen (/vehicles/:id): Displays all information for a vehicle listed by another dealer. Contains "Start Chat" and "View Dealer Profile" buttons.
8.2. Add/Edit Vehicle Screen (/my-vehicles/edit/:id or /my-vehicles/add): A full-page form for creating or modifying a vehicle listing.
8.3. Dealer Profile Screen (/dealers/:id): A public view of another dealer's profile, showing their Business Name, Rating, and Tenure. Contains a "Report User" button.
8.4. Add/Edit Vehicle Wanted Screen (/requests/edit/:id or /requests/add): A form for creating or modifying a "Vehicle Wanted" request.
8.5. Auction Screen (Bidder View) (/auctions/:id): A detailed view of an auction where the user can place bids.
8.6. My Auction Management Screen (/my-auctions/:id): A detailed view of the user's own auction, showing all bids and management options.
8.7. Chat Conversation Screen (/chats/:id): The screen for a single conversation, with message history, input bar, and the reveal-details workflow.
8.8. Notifications Screen (/notifications): A dedicated screen showing a full, filterable list of all user notifications.