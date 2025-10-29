# Project Specification - Auto-Hub

## Version: 3.1 (Final)
## Date: May 24, 2024

# 1. Introduction and Goals

## 1.1. Background

The used car market in Israel is characterized by a multitude of players (dealerships and independent traders) operating in a decentralized manner. Currently, communication and commerce between dealers are conducted through inefficient means. The lack of a central, reliable platform makes sourcing vehicles difficult, creates liquidity problems, and slows down transactions.

## 1.2. General Product Description

Auto-Hub is a secure, members-only B2B digital platform (mobile app & web panel) exclusively for licensed car dealers. It will serve as a marketplace allowing dealers to manage their business activity efficiently and securely. The system requires identity verification via a "Trade License". Each dealer receives a personal profile to manage their vehicle inventory, search for vehicles, submit offers, and participate in auctions. An internal chat system and an automated reputation system will help build trust within the community.

## 1.3. Target Audience

Car dealers and dealership managers in Israel who hold a valid "סחר תו" (Trade License).

# 2. Main Workflows

## 2.1. User Registration and Approval

- Dealer: Downloads the app and initiates registration with a phone number and 6-digit password.
- Dealer: Fills out a profile and uploads a trade license. Account status becomes "Pending Approval."
- System: Notifies admins of the new registration.
- Admin: Verifies the dealer's details and trade license.
- Admin: Contacts the dealer externally (e.g., via WhatsApp) for subscription payment.
- Admin: Upon payment, approves the user and assigns the subscription plan and validity date.
- System: Notifies the user that their account is active.

## 2.2. Listing a Vehicle for Sale

- Dealer: Taps "Add," fills out the vehicle details form, and uploads media.
- System: Publishes the listing and checks for matches with "Vehicles Wanted" requests.

## 2.3. Using a "Boost"

- Dealer: Selects a listing and taps "Boost."
- System: Verifies available boosts, activates the boost for 5 days, decrements the user's count, and prioritizes the listing. The boost is automatically removed after 5 days.

## 2.4. Creating an Auction

- Dealer: Selects a vehicle and chooses "Create Auction."
- System: Verifies available auctions in the user's plan.
- Dealer: Sets the starting price and duration.
- System: Publishes the auction and manages notifications for bids and completion.

## 2.5. Reporting a User

- Dealer (Reporter): Taps "Report User" on another dealer's profile and fills out a form.
- System: Creates a support ticket and notifies the support team.
- Support Rep: Investigates the report, reviews evidence (including read-only chat logs), and takes appropriate action.
- System: Notifies the reported user if an action is taken.

# 3. User Types & Features

## 3.1. Car Dealer (Mobile User)

The primary user of the application, operating via a mobile device (iOS/Android).

- Onboarding & Profile: Secure login, one-time registration for admin approval, and management of personal profile information.
- Inventory Management: Create, edit, and delete vehicle listings.
- Marketplace Activity: Advanced search and viewing of vehicle pages and public dealer profiles.
- "Vehicles Wanted": Create and manage public requests for specific vehicles.
- Auctions: Create auctions and participate in others' auctions.
- Communication: Anonymous 1-on-1 chats with a mutual detail-reveal mechanism.
- Support: File specific reports against other users and contact general support for technical help.

## 3.2. System Admin (Web User)

A super-user with full access to the web-based admin panel.

- Full User Management: Approve, decline, suspend, and delete all user accounts.
- Full Content Management: Edit and delete any content in the system (listings, requests, auctions).
- System Configuration: Manage subscription plans, vehicle makes/models, and notification templates.
- Analytics & Reports: Access a real-time data dashboard and generate reports.

## 3.3. Customer Support (Web User)

A user with restricted admin panel access, focused on resolving user issues.

- Ticket Management: Handle incoming support tickets and user reports.
- Investigation Tools: View user profiles and relevant chat logs (read-only).
- Moderation Actions: Issue warnings and temporary suspensions.

# 4. Entities, Data Models & Permissions

This section details the core entities of the system and defines the viewing and editing permissions for each data field.

## 4.1. User Entity

| Property     | Data Type    | Who Can See           | Who Can Change          | Notes                                              |
| ------------ | ------------ | --------------------- | ----------------------- | -------------------------------------------------- |
| UserID       | Unique ID    | All                   | System                  | Primary key, generated by the system.              |
| PhoneNumber  | Text, Unique | Owner, Admin, Support | Owner (on registration) | Used for login; available for other users to call. |
| CreationDate | Timestamp    | Admin, Support        | System                  | Set automatically on registration.                 |
| UserRole     | Enum         | Admin, Support        | Admin                   | Role (Dealer, Admin, etc.).                        |
| Status       | Enum         | Owner, Admin, Support | Admin                   | Status (Pending, Active, Suspended).               |

## 4.2. User Profile Entity

| Property               | Data Type | Who Can See    | Who Can Change                     | Notes                                                              |
| ---------------------- | --------- | -------------- | ---------------------------------- | ------------------------------------------------------------------ |
| FullName               | Text      | Owner, Admin   | Editable by user in their profile. |                                                                    |
| BusinessName           | Text      | All            | Owner, Admin                       | Publicly visible name of the dealership.                           |
| Location               | Text      | Owner, Admin   |                                    |                                                                    |
| TradeLicenseFile       | URL       | Admin, Support | Owner (on registration)            |                                                                    |
| Tenure                 | Number    | All            | Admin                              | Years in business, set by admin during approval.                   |
| AvgResponseTime        | Number    | Admin          | System                             | Calculated by background process. Seen as part of the user rating. |
| RatingTier             | Enum      | All            | System                             | Calculated by background process.                                  |
| SubscriptionType       | Enum      | Owner, Admin   |                                    | The user's current subscription plan.                              |
| SubscriptionValidUntil | Date      | Owner, Admin   |                                    |                                                                    |
| BoostsList             | Array     | Owner, Admin   | System                             | List of used boosts, updated automatically.                        |
| AuctionsList           | Array     | Owner, Admin   | System                             | List of created auctions, updated automatically.                   |

## 4.3. Vehicle Listing Entity

| Property         | Data Type       | Who Can See           | Who Can Change     | Notes                           |
| ---------------- | --------------- | --------------------- | ------------------ | ------------------------------- |
| VehicleID        | Unique ID       | All                   | System             | Primary key.                    |
| OwnerUserID      | Foreign Key     | System, Admin, Support| System             | Links to the User who owns the listing. |
| VehicleType      | Enum            | All                   | Owner, Admin       | Car or Motorcycle.              |
| Make             | Text            | All                   | Owner, Admin       |                                 |
| Model            | Text            | All                   | Owner, Admin       |                                 |
| SubModel         | Enum (7 types)  | All                   | Owner, Admin       | Vehicle category: micro, mini, family, executive, suv, luxury, sport. Displayed as dropdown with Hebrew labels. |
| Year             | Number          | All                   | Owner, Admin       |                                 |
| Kilometers       | Number          | All                   | Owner, Admin       |                                 |
| Transmission     | Enum            | All                   | Owner, Admin       | Manual, Automatic, Tiptronic.   |
| FuelType         | Enum            | All                   | Owner, Admin       | Gasoline, Diesel, Hybrid, Electric. |
| EngineSize       | NUMERIC         | All                   | Owner, Admin       | Engine size in cubic centimeters (cc), no upper limit. Database stores as NUMERIC type. |
| Price            | Number          | All                   | Owner, Admin       |                                 |
| Description      | Text            | All                   | Owner, Admin       |                                 |
| Images           | Array of URLs   | All                   | Owner, Admin       |                                 |
| Tags             | Array of Strings| All                   | Owner, Admin       | e.g., "After Accident", "Luxury Car". |
| TestResultFile   | URL             | All                   | Owner, Admin       |                                 |
| HadSevereCrash   | Boolean         | All                   | Owner, Admin       |                                 |
| Status           | Enum            | All                   | System, Owner, Admin| Available, Sold, Removed.      |
| CreationDate     | Timestamp       | All                   | System             |                                 |
| IsBoosted        | Boolean         | All                   | System             | Managed by the Boost process.   |
| BoostedUntil     | Timestamp       | All                   | System             | Managed by the Boost process.   |

## 4.4. Auction Entity

| Property  | Data Type | Who Can See | Who Can Change | Notes        |
| --------- | --------- | ----------- | -------------- | ------------ |
| AuctionID | Unique ID | All         | System         | Primary key. |

# 5. Business Rules & Logic

- **Subscription Plans:**
  - Regular: Up to 10 vehicles, 5 boosts, 5 auctions per month.
  - Gold: Up to 25 vehicles, 10 boosts, 10 auctions per month.
  - VIP: Up to 100 vehicles, 99 boosts, 99 auctions per month.
- **Boost Logic:** A boost is active for 5 days and grants priority placement.
- **Search Categories:** Quick search will include: "עד ₪50,000", "אחרי תאונה", "רכבי יוקרה", "אופנועים".

# 6. System Processes

## 6.1. User Rating Calculation

A background process will periodically calculate and update dealer ratings based on objective metrics like activity volume and average chat response time. This process will update the RatingTier and AvgResponseTime fields for each dealer.

## 6.2. System Notifications

| Trigger Event | Notification Content | Recipient(s) |
| ------------- | -------------------- | ------------ |
| Registration Approved | "Your Auto-Hub account has been approved!" | The new user |
| New User Awaiting Approval | "New user, [Dealer Name], is awaiting approval." | All Admins |
| New "Vehicle Wanted" Match | "New match for your request for [Vehicle Name]." | The request owner |
| Outbid in Auction | "A higher bid was placed on [Vehicle Name]." | The outbid participant |
| New Bid on Own Auction | "A new bid was received on your auction for [Vehicle Name]." | The auction owner |
| Subscription Expiring Soon | "Your subscription will expire in 7 days." | The user |
| New Support Ticket/Report | "New report filed against [Reported Dealer]." | All Admins & Support Staff |
| Admin Warning/Suspension | "You have received a message from the support team." | The user receiving the action |

# 7. Technical Requirements

- **Platforms:** Cross-platform mobile app (iOS/Android) and a web admin panel.
- **Authentication:** 
  - Mobile Users: Phone number + 6-digit password authentication
  - Admin Users: Phone number + 6-digit password with separate session storage
  - Separate auth clients: `supabase` client for mobile, `adminClient` for admin panel
- **Real-time:** Chat and auctions must use real-time technology (e.g., WebSockets).
- **Audit Log:** The system must log all significant user and admin actions (user ID, action type, entity, timestamp).
- **Shared Components:** Predefined constants for vehicle types and other enumerated values stored in `src/constants/` directory

# 8. MVP Limitations & Clarifications

- **Payments & Billing:** All subscription payments will be handled externally. Admins will manually update user subscription statuses in the admin panel.
- **Website/Landing Page:** This project does not include the development of a marketing website or landing page.
- **AI/LM Integration:** Language model and AI features are out of scope for the initial MVP. These may be added in future phases.

---
*This PRD serves as the comprehensive specification for Auto-Hub development and implementation.*