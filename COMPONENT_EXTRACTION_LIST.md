# Component Extraction List

This document lists components that should be extracted from page files to improve modularity, reusability, and maintainability.

## Priority: High (Large Files > 500 lines)

### 1. `src/pages/payment/Checkout.tsx` (1327 lines)

**Components to Extract:**

- **`CheckoutOrderSummary`** (lines ~614-850)
  - Displays order items with quantity controls
  - Shows item images, prices, discounts
  - Handles quantity increment/decrement
  - Shows pre-order badges
  - **Location**: Extract to `src/components/checkout/CheckoutOrderSummary.tsx`

- **`CheckoutAddressSelector`** (lines ~850-1050)
  - Address selection UI (saved addresses vs custom)
  - Address form fields
  - Royal Mail AddressNow integration
  - **Location**: Extract to `src/components/checkout/CheckoutAddressSelector.tsx`

- **`CheckoutShippingSelector`** (lines ~1050-1150)
  - Shipping service selection
  - Shipping options display
  - **Location**: Extract to `src/components/checkout/CheckoutShippingSelector.tsx`

- **`CheckoutSummaryCard`** (lines ~1150-1250)
  - Order totals breakdown
  - Discount display
  - Final pricing summary
  - **Location**: Extract to `src/components/checkout/CheckoutSummaryCard.tsx`

- **`CheckoutEmptyState`** (lines ~526-550)
  - Empty cart message
  - CTA to browse marketplace
  - **Location**: Extract to `src/components/checkout/CheckoutEmptyState.tsx`

**Hooks to Extract:**

- **`useCheckoutSummary`** - Logic for loading and refreshing checkout summary
- **`useAddressNow`** - Royal Mail AddressNow initialization and state management

---

### 2. `src/pages/marketplace/ProductDetail.tsx` (719 lines)

**Components to Extract:**

- **`ProductImageGallery`** (lines ~272-368)
  - Desktop: Main image + vertical thumbnail stack
  - Mobile: Main image + horizontal scrollable thumbnails
  - Image fade transitions
  - **Location**: Extract to `src/components/product/ProductImageGallery.tsx`

- **`ProductInfoSection`** (lines ~390-500)
  - Product title, price, discount badge
  - Rating display
  - Stock status tags
  - Description
  - **Location**: Extract to `src/components/product/ProductInfoSection.tsx`

- **`ProductQuantitySelector`** (lines ~448-480)
  - Quantity input/stepper
  - Stock validation
  - **Location**: Extract to `src/components/product/ProductQuantitySelector.tsx`

- **`ProductActions`** (lines ~480-550)
  - Add to cart button
  - Pre-order button
  - Notify-me button
  - **Location**: Extract to `src/components/product/ProductActions.tsx`

- **`ProductDetailsTabs`** (lines ~550-650)
  - Usage, Benefits, Ingredients sections
  - List/paragraph rendering logic
  - **Location**: Extract to `src/components/product/ProductDetailsTabs.tsx`

- **`RelatedProducts`** (lines ~650-719)
  - Related products carousel/grid
  - **Location**: Extract to `src/components/product/RelatedProducts.tsx`

**Utils to Extract:**

- **`formatProductContent`** - Logic for parsing and formatting usage/benefits (list vs paragraph)

---

### 3. `src/pages/marketplace/MarketPlace.tsx` (827 lines)

**Components to Extract:**

- **`MarketplaceHeader`** (lines ~150-240)
  - Title and description
  - Global discount banner
  - Search bar
  - **Location**: Extract to `src/components/marketplace/MarketplaceHeader.tsx`

- **`MarketplaceFilters`** (lines ~240-400)
  - Category filter chips
  - Price range filter (mobile dropdown)
  - Rating filter (mobile dropdown)
  - **Location**: Extract to `src/components/marketplace/MarketplaceFilters.tsx`

- **`PriceRangeFilter`** (lines ~487-550)
  - Min/max price inputs
  - Clear/Apply buttons
  - **Location**: Extract to `src/components/marketplace/PriceRangeFilter.tsx`

- **`RatingFilter`** (lines ~552-650)
  - Star rating radio buttons
  - Clear/Apply buttons
  - **Location**: Extract to `src/components/marketplace/RatingFilter.tsx`

- **`ProductGrid`** (lines ~400-480)
  - Product cards grid layout
  - Loading skeletons
  - Empty state
  - Error state
  - **Location**: Extract to `src/components/marketplace/ProductGrid.tsx`

- **`LoadMoreButton`** (lines ~436-480)
  - Pagination load more button
  - **Location**: Extract to `src/components/marketplace/LoadMoreButton.tsx`

**Hooks to Extract:**

- **`useMarketplaceFilters`** - Filter state management
- **`useProductPagination`** - Pagination logic

---

## Priority: Medium (Files 300-500 lines)

### 4. `src/pages/dashboard/OrderDetails.tsx` (692 lines)

**Components to Extract:**

- **`OrderHeader`** - Order ID, date, status, tracking button
- **`OrderItemsList`** - List of order items with details
- **`OrderSummary`** - Totals, shipping, discounts
- **`OrderTimeline`** - Order status history/timeline
- **`TrackingButton`** - Track order button with Royal Mail link

**Location**: Extract to `src/components/orders/`

---

### 5. `src/pages/management/ManagementUsers.tsx` (597 lines)

**Components to Extract:**

- **`UserTable`** - User data table with sorting/filtering
- **`UserFilters`** - Filter controls for users
- **`UserActions`** - Action buttons (edit, delete, etc.)
- **`UserModal`** - Create/edit user modal

**Location**: Extract to `src/components/admin/users/`

---

### 6. `src/pages/payment/PaymentSuccess.tsx` (491 lines)

**Components to Extract:**

- **`PaymentSuccessHeader`** - Success message and icon
- **`OrderSummaryCard`** - Order details display
- **`NextStepsCard`** - What happens next information
- **`ActionButtons`** - View order, continue shopping buttons

**Location**: Extract to `src/components/payment/PaymentSuccess/`

---

### 7. `src/pages/payment/PaymentCancel.tsx` (372 lines)

**Components to Extract:**

- **`PaymentCancelHeader`** - Cancel message
- **`RetryCheckoutCard`** - Retry checkout CTA
- **`HelpCard`** - Support/help information

**Location**: Extract to `src/components/payment/PaymentCancel/`

---

### 8. `src/pages/payment/PaymentError.tsx` (305 lines)

**Components to Extract:**

- **`PaymentErrorHeader`** - Error message display
- **`ErrorDetails`** - Error details and troubleshooting
- **`RetryActions`** - Retry or contact support buttons

**Location**: Extract to `src/components/payment/PaymentError/`

---

### 9. `src/pages/ContactUs.tsx` (372 lines)

**Components to Extract:**

- **`ContactForm`** - Contact form with validation
- **`ContactInfo`** - Contact information display (address, phone, etc.)
- **`SocialLinks`** - Social media links section

**Location**: Extract to `src/components/contact/`

---

## Priority: Low (Smaller files, but still beneficial)

### 10. `src/pages/auth/ResetPassword.tsx` (443 lines)

**Components to Extract:**

- **`OTPVerificationForm`** - OTP input and verification
- **`PasswordResetForm`** - New password form
- **`ResendCodeButton`** - Resend code with cooldown

**Location**: Extract to `src/components/auth/`

---

### 11. `src/pages/auth/Signup.tsx` (378 lines)

**Components to Extract:**

- **`SignupForm`** - Signup form fields
- **`PasswordStrengthIndicator`** - If password strength checking exists
- **`TermsCheckbox`** - Terms and conditions checkbox

**Location**: Extract to `src/components/auth/`

---

### 12. `src/pages/auth/EmailVerification.tsx` (245 lines)

**Components to Extract:**

- **`OTPInput`** - OTP input field (if not already extracted)
- **`ResendCodeSection`** - Resend code UI

**Location**: Extract to `src/components/auth/`

---

## Shared/Common Components to Extract

### Form Components

- **`FormField`** - Reusable form field wrapper with label, error, and input
- **`PasswordField`** - Password input with show/hide toggle
- **`PhoneInputField`** - Phone number input with country selector

### UI Components

- **`EmptyState`** - Generic empty state component (icon, message, CTA)
- **`LoadingSkeleton`** - Loading skeleton for various content types
- **`ErrorDisplay`** - Error message display component
- **`StatusBadge`** - Status badge component (pending, in-transit, etc.)

### Layout Components

- **`PageHeader`** - Standard page header with title, description, back button
- **`SectionCard`** - Card wrapper for sections
- **`TwoColumnLayout`** - Responsive two-column layout wrapper

---

## Extraction Guidelines

1. **Start with High Priority files** - Focus on Checkout, ProductDetail, and MarketPlace first
2. **Extract by functionality** - Group related UI and logic together
3. **Create proper folder structure** - Use feature-based folders (e.g., `components/checkout/`, `components/product/`)
4. **Maintain prop interfaces** - Use TypeScript interfaces for all component props
5. **Extract hooks separately** - Business logic should be in custom hooks
6. **Update imports** - Update all imports after extraction
7. **Test after extraction** - Ensure functionality remains intact

---

## File Structure After Extraction

```
src/
├── components/
│   ├── checkout/
│   │   ├── CheckoutOrderSummary.tsx
│   │   ├── CheckoutAddressSelector.tsx
│   │   ├── CheckoutShippingSelector.tsx
│   │   ├── CheckoutSummaryCard.tsx
│   │   └── CheckoutEmptyState.tsx
│   ├── product/
│   │   ├── ProductImageGallery.tsx
│   │   ├── ProductInfoSection.tsx
│   │   ├── ProductQuantitySelector.tsx
│   │   ├── ProductActions.tsx
│   │   ├── ProductDetailsTabs.tsx
│   │   └── RelatedProducts.tsx
│   ├── marketplace/
│   │   ├── MarketplaceHeader.tsx
│   │   ├── MarketplaceFilters.tsx
│   │   ├── PriceRangeFilter.tsx
│   │   ├── RatingFilter.tsx
│   │   ├── ProductGrid.tsx
│   │   └── LoadMoreButton.tsx
│   ├── orders/
│   │   ├── OrderHeader.tsx
│   │   ├── OrderItemsList.tsx
│   │   ├── OrderSummary.tsx
│   │   ├── OrderTimeline.tsx
│   │   └── TrackingButton.tsx
│   ├── auth/
│   │   ├── OTPVerificationForm.tsx
│   │   ├── PasswordResetForm.tsx
│   │   └── ResendCodeButton.tsx
│   └── shared/
│       ├── FormField.tsx
│       ├── PasswordField.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSkeleton.tsx
│       └── ErrorDisplay.tsx
├── hooks/
│   ├── useCheckoutSummary.ts
│   ├── useAddressNow.ts
│   ├── useMarketplaceFilters.ts
│   └── useProductPagination.ts
└── utils/
    └── formatProductContent.ts
```

---

## Notes

- Some components may already exist in the codebase - verify before creating duplicates
- Consider creating a shared `types` folder for component prop interfaces if they're used across multiple components
- Use React.memo for components that receive frequently changing props but don't need to re-render
- Consider using compound components pattern for complex components (e.g., ProductDetailsTabs)

