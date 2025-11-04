# E-Commerce Platform Requirements (Marketplace & Shop Build)

## 1. Core Product & Inventory Features

### Backend Logic

#### Pre-Order Functionality
*   Implement a mechanism for users to pre-order products directly from the product card view.
*   Track and store a "Pre-Order Metric" for each product (e.g., total number of pre-orders).
*   Total aggregation of all pre-ordered products must be available for reporting.

#### Out-of-Stock Notifications (Waitlist)
*   When a product's stock quantity is 0, activate a notification feature for that product (e.g., changing the state of a bell icon).
*   Users who opt-in must be added to a product-specific waitlist, which needs to integrate with the "Maileroo email marketing list".
*   The system must automatically trigger a notification email to the waitlist when the product's stock is updated to be greater than 0 via the Admin Portal.
*   Once stock is available, the notification feature must be automatically deactivated/greyed out, and the corresponding Maileroo list or notification queue should be cleared/switched off.

### Frontend UX

#### Product Card Actions
*   Display clear actions for users to "Pre-Order" and to activate the "Out-of-Stock Notification" (bell icon).
*   The bell icon's state must visually reflect the product's stock level.

## 2. Customer Dashboard & Experience

### Backend Logic

#### Comprehensive Activity Tracking
Every user action within the marketplace must be tracked and made visible on their dedicated **User Dashboard**. This includes:
*   List of all **Pre-Ordered Products**.
*   Record of activated **In-Stock Notifications** (waitlists for out-of-stock items).
*   General **New Product Notifications** (the main "Join Our Waitlist" for new offerings).

### Frontend UX

#### Dedicated Cart Page
*   Clicking the site-wide cart icon must navigate the user to a dedicated **Shopping Cart page** as per the initial Figma design by Abiola. This page should be a central reference point accessible from the user's dashboard area.

## 3. Shipping & Checkout Logistics (UK Focus)

### Backend Logic

#### UK-Only Shipping
*   Initial setup must support shipping within the UK only.

#### Royal Mail Integration
Integrate with Royal Mail services for:
*   **Shipment Tracking**: Generate and store tracking information for customer orders.
*   **Address Validation**: Utilise the **Royal Mail Address API** during checkout to ensure address accuracy.

#### Address Management
*   User addresses should **not** be pre-populated from the initial dashboard profile. Address entry and validation must be a required step during the **checkout process** to leverage the Royal Mail Address API effectively.

## 4. Admin Portal Features

The client's **Admin Dashboard** requires dedicated sections for managing core e-commerce functions.

### Discount Management
*   Create a dedicated section for applying discounts.
*   The client must be able to input a **percentage value (%)** for the discount.
*   The system must automatically **calculate** the discounted price and **reflect** this change on the product's frontend display (e.g., showing a strikethrough on the original price).

### Product Review Management
If customer reviews are implemented, the Admin Dashboard needs a **Reviews Section** that provides:
*   A list of all reviews, visible per product.
*   Details for each review: **Customer Name, Date, and Time.**
*   Functionality to **delete (remove)** specific reviews.
*   **Search and Filter** functionality (e.g., search by keywords/offensive terms, filter by date).

### User Management (Account Deactivation/Deletion)
*   Implement functionality to **completely delete user accounts** from the database to manage data volume (e.g., for test accounts).
*   Ensure that when a user account is **deactivated** and then later **reactivated**, their **complete history** (order history, site activity, etc.) remains intact and accessible.

