# Fifty Firsts Wellness

A comprehensive wellness platform and e-commerce marketplace built with React and TypeScript, offering personalized wellness programs, product marketplace, educational resources, and administrative management tools.

## 🚀 Features

### Customer-Facing Features

- **Wellness Marketplace**
  - Product browsing with category filtering
  - Pre-order functionality for upcoming products
  - Out-of-stock notifications and waitlist management
  - Product reviews and ratings
  - Shopping cart with persistent storage
  - Secure checkout with Royal Mail address verification
  - Order tracking and history

- **Wellness Programs**
  - Personal wellness programs
  - Business wellness programs
  - Luceo Lounge wellness hub (Red Light Therapy & Contrast Therapy)
  - Program details and enrollment
  - Subscription management

- **Resources Hub**
  - Blog with rich content
  - Podcast library with Mux video integration
  - Webinar access
  - Educational content

- **User Dashboard**
  - Account management
  - Order history and tracking
  - Delivery address management
  - Shopping cart
  - Marketplace activity tracking (pre-orders, notifications)

- **Authentication & Security**
  - Email verification
  - Password reset functionality
  - Google OAuth integration
  - Protected routes
  - Cookie consent management

### Administrative Features

- **Management Dashboard**
  - Overview with analytics and metrics
  - User growth charts and statistics
  - Quick action shortcuts

- **User Management**
  - User listing with filtering (role, status)
  - User details and activity tracking
  - User activation/deactivation
  - Bulk operations

- **Marketplace Management**
  - Product CRUD operations
  - Category management
  - Global and individual discount management
  - Shipping settings and services
  - Pre-order tracking
  - Product notification management

- **Content Management**
  - Programme management
  - Blog post management
  - Subscription management
  - Review moderation

- **Order Management**
  - Order listing and filtering
  - Order details and status updates
  - Shipping management

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM 7.8.1
- **UI Libraries**:
  - Material-UI (MUI) 7.3.2
  - Tailwind CSS 3.4.17
  - Headless UI 2.2.9
  - Radix UI components
  - Lucide React icons
- **State Management**: React Context API
- **Form Handling**: React Hook Form 7.63.0 with Zod validation
- **Data Visualization**: Recharts 3.5.1
- **HTTP Client**: Axios 1.11.0
- **Notifications**: React Hot Toast 2.6.0
- **Video**: Mux Player React 3.6.1
- **Rich Text**: Strapi Blocks React Renderer

### Development Tools

- **Language**: TypeScript 5.9.2
- **Linting**: ESLint 9.33.0
- **Code Quality**: Husky (Git hooks)
- **Styling**: PostCSS, Autoprefixer
- **Date Handling**: date-fns 4.1.0

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Git

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/51st-Wellness/fifty-firsts-wellness.git
cd fifty-firsts-wellness
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add required environment variables (API endpoints, keys, etc.)

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be generated in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 📁 Project Structure

```
fifty-firsts-wellness/
├── public/                 # Static assets
│   ├── assets/           # Images, icons, and other assets
│   └── services/         # Service-related assets
├── src/
│   ├── api/              # API service layer
│   │   ├── auth.api.ts
│   │   ├── marketplace.api.ts
│   │   ├── payment.api.ts
│   │   └── ...
│   ├── components/       # Reusable components
│   │   ├── admin/       # Admin-specific components
│   │   ├── checkout/    # Checkout components
│   │   ├── home/        # Homepage components
│   │   ├── marketplace/ # Marketplace components
│   │   ├── product/     # Product components
│   │   ├── reviews/     # Review components
│   │   ├── subscription/# Subscription components
│   │   └── ui/          # UI primitives
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # User dashboard pages
│   │   ├── management/  # Admin management pages
│   │   ├── marketplace/ # Marketplace pages
│   │   ├── service/     # Service pages (Wellness Programs, Luceo Lounge)
│   │   └── ...
│   ├── services/        # Service layer
│   ├── styles/          # Global styles
│   ├── theme/           # Theme configuration
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── docs/                 # Documentation
│   └── Luceo-Lounge.md  # Luceo Lounge service documentation
├── emails/               # Email templates
├── eslint.config.js      # ESLint configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.js        # Vite configuration
└── package.json         # Project dependencies
```

## 🎨 Design System

### Brand Colors

- **Brand Green**: `#00969b` (Primary brand color)
- **Brand Purple**: `#5f42e5` (Secondary brand color)

### Typography

- **Primary Font**: Quicksand (sans-serif)
- **Heading Font**: Playfair Display (serif)
- **Accent Font**: Poppins (sans-serif)
- **UI Font**: League Spartan (sans-serif)

### Responsive Breakpoints

- Mobile: Default (< 640px)
- Tablet: `sm` (640px+)
- Desktop: `md` (768px+), `lg` (1024px+), `xl` (1280px+)

## 🔐 Authentication & Authorization

The application implements role-based access control:

- **Public Routes**: Home, About, Marketplace, Blog, etc.
- **Protected Routes**: User dashboard, checkout
- **Admin Routes**: Management dashboard (requires admin role)
- **Email Verification**: Required for accessing protected features

## 🛒 E-Commerce Features

### Shopping Cart
- Persistent cart storage
- Guest cart support
- Quantity management
- Discount application.

### Checkout Process
- Royal Mail address verification (UK addresses)
- Multiple payment methods
- Order confirmation
- Email notifications

### Product Management
- Pre-order system
- Stock management
- Out-of-stock notifications
- Product reviews and ratings
- Category organization

## 📧 Email System

The platform includes comprehensive email templates for:
- Account activation/deactivation
- Password reset
- Order confirmations
- Product availability notifications
- Subscription renewals
- Newsletter subscriptions
- Contact form submissions

## 🧪 Testing

Run type checking:
```bash
npm run typecheck
```

Run linting:
```bash
npm run lint
```


## 📝 Environment Variables

Create a `.env` file with the following variables (example):

```env
VITE_API_BASE_URL=your_api_url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
# Add other required environment variables
```

## 🚢 Deployment

The project is configured for deployment on Vercel. The `vercel.json` configuration file handles routing and build settings.

### Build Optimization

- Code splitting with React lazy loading
- Image lazy loading with IntersectionObserver
- Route prefetching for improved perceived performance
- API response caching with TTL
- Component memoization (React.memo, useMemo, useCallback)
- Font loading optimization (deferred non-critical fonts)
- Dynamic script loading for third-party services
- Asset optimization
- Tree shaking
- Production minification

## 🌟 Services

### Luceo Lounge

A wellness hub offering evidence-based light and temperature therapies:

- **Red Light Therapy (Photobiomodulation)**: Uses low-level wavelengths of red and near-infrared light to stimulate cellular repair, enhance circulation, and promote tissue rejuvenation
- **Contrast Therapy**: Alternating hot and cold immersion therapy using sauna pods, steam pods, and cold plunge tubs for physical recovery and nervous system strengthening

The Luceo Lounge service page provides comprehensive information about both therapies, their benefits, how they work, and the wellness philosophy behind the treatments.

## 📄 License

This project is private and proprietary.


