Project Specification - Auto-Hub
Project Overview
Auto-Hub is a secure, members-only B2B mobile and web platform designed exclusively for licensed car dealers in Israel. The project's primary goal is to create a centralized and efficient digital ecosystem that streamlines all business-to-business activities within the used car industry. It will replace inefficient communication methods like WhatsApp groups and phone calls with a dedicated, feature-rich environment.
The platform will enable dealers to manage their vehicle inventory, source specific cars for clients, participate in timed auctions, and communicate securely. The entire system is built on a foundation of trust, enforced through a mandatory trade license verification process for all users and a reputation system based on objective data. The platform consists of a mobile application for dealers and a comprehensive web-based admin panel for system management and customer support.
User Types & Features
Mobile Users (Dealers/Car Traders)
Dealers are the primary users of the mobile application (iOS & Android). Their features are focused on daily business operations.
Onboarding & Profile Management:
Secure login via phone number and OTP verification.
One-time registration requiring personal/business details and a trade license upload for admin approval.
Ability to view and edit their own profile information.


Vehicle Inventory Management:
Create, edit, and delete vehicle listings with detailed specifications (including test results and crash history).
Upload multiple images and documents for each vehicle.
View a private list of their own active and sold vehicles.


Marketplace Interaction:
Search the entire platform's vehicle database with advanced filtering.
View detailed pages for vehicles listed by other dealers.
View public profiles of other dealers (showing business name, rating, tenure).


"Vehicles Wanted" (רכבים דרושים) Feature:
Create requests for specific vehicles needed for their clients.
View a public list of all open requests from other dealers.
Receive automatic notifications when a matching vehicle is listed.


Auction Participation:
View a list of all active auctions on the platform.
Place bids on auctions.
Create and manage their own auctions for their vehicles.


Secure Communication:
Engage in private, one-on-one chats with other dealers, initiated from a vehicle or auction page.
Initial chat is anonymous; users can mutually agree to reveal their full names and contact details.
Attach files and images within chats.


System Interaction:
Receive in-app notifications for key events (new messages, auction updates, ISO matches).
Report other users for misconduct.
Contact platform support directly via a dedicated chat.


Admin Users
Admins have full super-user access via the web panel. Their role is to oversee, manage, and configure the entire system.
Full User Management:
View, search, and filter the entire user database.
Approve or decline new dealer registrations after verifying their trade license.
Edit any user's profile information.
Suspend or permanently delete user accounts.


Content Moderation:
View, edit, and delete any vehicle listing, auction, or "Vehicle Wanted" request on the platform.


System Configuration:
Manage global settings, such as vehicle categories, report reasons, and the parameters for the dealer rating algorithm.


Analytics & Reporting:
Access a dashboard with key performance indicators (KPIs).
Generate and export detailed reports on user activity, listings, and revenue.


Support Staff
Support staff have restricted access to the web panel, focused on resolving user issues.
Ticket Management:
View and manage a queue of all incoming support tickets and user reports.
Assign tickets to themselves or other staff members.


Investigation Tools:
View the full profile and activity history of any user involved in a ticket.
Access a read-only version of the chat conversation between dealers related to a report.


Communication & Moderation:
Communicate directly with users via the support chat system.
Take limited moderation actions, such as issuing official warnings or temporarily suspending user privileges (e.g., chat access).
Escalate severe cases to an Admin for final action (e.g., account deletion).


Entities & Data Models
User Entity
Properties: UserID, PhoneNumber, CreationDate, UserRole (Dealer, Admin, Support), Status (Pending, Active, Suspended), FullName, BusinessName, Location, TradeLicenseFile, Tenure (years in business).
Relationships:
A User (Dealer) has many Vehicle Listings.
A User (Dealer) has many Auctions.
A User (Dealer) has many Vehicle Requests.
A User is a participant in many Chat Conversations.


Operations: Create, Read, Update (self for dealers, all for admins), Delete (admins only).
Vehicle Entity
Properties: VehicleID, OwnerUserID (foreign key to User), Make, Model, SubModel, Year, Kilometers, Transmission, Price, Description, Images (array of URLs), Status (Available, Sold, Removed), HadSevereCrash (boolean), TestResultFile (URL).
Relationships:
Belongs to one User.
Can have one Auction.
Can have many Chat Conversations.


Operations: Create, Read, Update, Delete.
Auction Entity
Properties: AuctionID, VehicleID (foreign key), SellerUserID (foreign key), StartPrice, CurrentHighestBid, EndTime, Status (Scheduled, Active, Ended).
Relationships:
Belongs to one Vehicle.
Has many Bids (a separate, simple entity linking a UserID to a bid amount and timestamp).
Can have many Chat Conversations.


Operations: Create, Read, Update (e.g., end time by admin), Delete (by admin).
Vehicle Request Entity
Properties: RequestID, RequestingUserID (foreign key), Query (JSON object with criteria like make, model, year range), MaxBudget, Status (Open, Closed), CreationDate, ClosingTime (optional).
Relationships:
Belongs to one User.


Operations: Create, Read, Update (close/edit), Delete.
Support Ticket Entity
Properties: TicketID, ReportingUserID (foreign key), ReportedUserID (optional foreign key), Reason, Description, Status (New, In Progress, Resolved), AssignedTo_SupportID (optional foreign key).
Relationships:
Belongs to one Reporting User.
Can have a dedicated Chat Conversation between the user and support.


Operations: Create (by dealer), Read/Update (by support/admin).
Business Rules & Logic
User Verification: A user cannot access the platform's core features until their trade license is manually approved by an admin.
Chat Anonymity: All dealer-to-dealer chats are initiated anonymously. A user's real name and phone number are only revealed to the other party after both users explicitly agree to the reveal request within the chat.
Dealer Rating: The rating tier (e.g., Gold, Silver, Bronze) is calculated automatically by the system based on objective, non-editable data: tenure in the business, average vehicle inventory count, and average chat response time. It is not based on user-to-user reviews.
Notifications: The system will generate automated notifications for key events: new chat messages, new auction bids, successful ISO matches, and updates on support tickets.
Data Integrity: A vehicle cannot be deleted if it is part of an active auction. It can only be marked as "Sold" or removed after the auction concludes.
Technical Requirements
Platform: The dealer-facing application must be cross-platform, supporting both iOS and Android from a single codebase (e.g., using React Native or Flutter). The admin panel will be a responsive web application.
Authentication: User login will be passwordless, using a phone number and a One-Time Password (OTP) sent via SMS.
Real-time Features: The chat and auction bidding systems must operate in real-time. This will likely require the use of WebSockets or a similar technology.
Scalability: The architecture should be designed to handle a growing number of users, listings, and real-time connections. A cloud-based infrastructure (e.g., AWS, Google Cloud) is recommended.
Data Storage: A secure and scalable database is required (e.g., PostgreSQL, MongoDB). Secure storage for uploaded files (licenses, vehicle documents) is also necessary (e.g., Amazon S3, Google Cloud Storage).
Language: The primary language for the user-facing application is Hebrew, requiring full RTL (Right-to-Left) layout support.

This specification serves as the primary reference for development and feature implementation.

