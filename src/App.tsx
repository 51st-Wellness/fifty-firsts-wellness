import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import EmailVerificationGuard from "./components/EmailVerificationGuard";
import ManagementGuard from "./components/ManagementGuard";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import CookieConsent from "./components/CookieConsent";
import { prefetchCriticalRoutes } from "./utils/routePrefetch";

// Lazy load common layout components
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));

// Lazy load all page components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const MarketPlace = lazy(() => import("./pages/marketplace/MarketPlace"));
const ProductDetail = lazy(() => import("./pages/marketplace/ProductDetail"));
const Blog = lazy(() => import("./pages/blog/Blog"));
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));
const AIWellness = lazy(() => import("./pages/AIWellness"));
const Membership = lazy(() => import("./pages/Membership"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const MyAccount = lazy(() => import("./pages/dashboard/MyAccount"));
const OrdersHistory = lazy(() => import("./pages/dashboard/OrdersHistory"));
const OrderDetails = lazy(() => import("./pages/dashboard/OrderDetails"));
const MyCart = lazy(() => import("./pages/dashboard/MyCart"));
const DeliveryAddresses = lazy(() => import("./pages/dashboard/DeliveryAddresses"));
const PersonalWellnessProgrammes = lazy(() => import("./pages/service/PersonalWellnessProgrammes"));
const WellnessProgramDetails = lazy(() => import("./pages/service/WellnessProgramDetails"));
const ProgrammeDetail = lazy(() => import("./pages/programmes/ProgrammeDetail"));
const Podcasts = lazy(() => import("./pages/ResourcesHub/Podcasts"));
const PodcastDetail = lazy(() => import("./pages/ResourcesHub/PodcastDetail"));
const Webinars = lazy(() => import("./pages/ResourcesHub/Webinars"));
const BusinessWellnessProgrammes = lazy(() => import("./pages/service/BusinessWellnessProgrammes"));
const LuceoLounge = lazy(() => import("./pages/service/LuceoLounge"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const TermsAndConditions = lazy(() => import("./pages/legal/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const CheckEmail = lazy(() => import("./pages/auth/CheckEmail"));
const EmailVerification = lazy(() => import("./pages/auth/EmailVerification"));
const PaymentCancel = lazy(() => import("./pages/payment/PaymentCancel"));
const PaymentSuccess = lazy(() => import("./pages/payment/PaymentSuccess"));
const PaymentError = lazy(() => import("./pages/payment/PaymentError"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthSuccess = lazy(() => import("./pages/auth/AuthSuccess"));
const Checkout = lazy(() => import("./pages/payment/Checkout"));

// Management routes (lazy loaded)
const ManagementLayout = lazy(
  () => import("./pages/management/ManagementLayout")
);
const ManagementOverview = lazy(
  () => import("./pages/management/ManagementOverview")
);
const ManagementGeneral = lazy(
  () => import("./pages/management/ManagementGeneral")
);
const ManagementSubscriptions = lazy(
  () => import("./pages/management/ManagementSubscriptions")
);
const ManagementMarketplace = lazy(
  () => import("./pages/management/ManagementMarketplace")
);
const ManagementProgrammes = lazy(
  () => import("./pages/management/ManagementProgrammes")
);
const ManagementUsers = lazy(
  () => import("./pages/management/ManagementUsers")
);

// Wrapper component for routes with Navbar and Footer
const RouteWithLayout: React.FC<{
  children: React.ReactNode;
  showFooter?: boolean;
}> = ({ children, showFooter = true }) => (
  <Suspense fallback={<Loader />}>
    <Navbar />
    {children}
    {showFooter && <Footer />}
  </Suspense>
);

// Scroll to top component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  // Prefetch critical routes on mount
  useEffect(() => {
    prefetchCriticalRoutes();
  }, []);

  return (
    <div className="min-h-screen">
      {/* {location.pathname.startsWith("/admin") ? null : } */}
      <div>
        <Toaster position="top-center" />
        <ScrollToTop />
        <CookieConsent />
        <Routes>
          <Route
            path="/"
            element={
              <RouteWithLayout>
                <Home />
              </RouteWithLayout>
            }
          />
          {/** Removed legacy /homepage route that referenced HomePage.jsx */}
          <Route
            path="/about"
            element={
              <RouteWithLayout>
                <About />
              </RouteWithLayout>
            }
          />
          <Route
            path="/services/personal-wellness"
            element={
              <RouteWithLayout>
                <PersonalWellnessProgrammes />
              </RouteWithLayout>
            }
          />
          <Route
            path="/services/business-wellness"
            element={
              <RouteWithLayout>
                <BusinessWellnessProgrammes />
              </RouteWithLayout>
            }
          />
          <Route
            path="/services/luceo-lounge"
            element={
              <RouteWithLayout>
                <LuceoLounge />
              </RouteWithLayout>
            }
          />
          <Route
            path="/services/program-details"
            element={
              <RouteWithLayout>
                <WellnessProgramDetails />
              </RouteWithLayout>
            }
          />
          <Route
            path="/marketplace"
            element={
              <RouteWithLayout showFooter={false}>
                <MarketPlace />
              </RouteWithLayout>
            }
          />
          <Route
            path="/products/:productId"
            element={
              <RouteWithLayout showFooter={false}>
                <ProductDetail />
              </RouteWithLayout>
            }
          />
          <Route
            path="/programmes"
            element={
              <RouteWithLayout>
                <PersonalWellnessProgrammes />
              </RouteWithLayout>
            }
          />
          <Route
            path="/programmes/:productId"
            element={
              <RouteWithLayout showFooter={false}>
                <ProgrammeDetail />
              </RouteWithLayout>
            }
          />
          <Route
            path="/podcasts"
            element={
              <RouteWithLayout showFooter={false}>
                <Podcasts />
              </RouteWithLayout>
            }
          />
          <Route
            path="/podcasts/:id"
            element={
              <RouteWithLayout>
                <PodcastDetail />
              </RouteWithLayout>
            }
          />
          <Route
            path="/resources/webinars"
            element={
              <RouteWithLayout showFooter={false}>
                <Webinars />
              </RouteWithLayout>
            }
          />
          <Route
            path="/blog"
            element={
              <RouteWithLayout>
                <Blog />
              </RouteWithLayout>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <RouteWithLayout>
                <BlogPost />
              </RouteWithLayout>
            }
          />
          <Route
            path="/ai-wellness"
            element={
              <RouteWithLayout showFooter={false}>
                <AIWellness />
              </RouteWithLayout>
            }
          />
          <Route
            path="/membership"
            element={
              <Suspense fallback={<Loader />}>
                <Membership />
              </Suspense>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <RouteWithLayout showFooter={false}>
                <Subscriptions />
              </RouteWithLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <RouteWithLayout>
                <ContactUs />
              </RouteWithLayout>
            }
          />
          <Route
            path="/cookie-policy"
            element={
              <RouteWithLayout showFooter={false}>
                <CookiePolicy />
              </RouteWithLayout>
            }
          />
          <Route
            path="/terms-and-conditions"
            element={
              <RouteWithLayout showFooter={false}>
                <TermsAndConditions />
              </RouteWithLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <RouteWithLayout showFooter={false}>
                <PrivacyPolicy />
              </RouteWithLayout>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<Loader />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<Loader />}>
                <Signup />
              </Suspense>
            }
          />
          <Route
            path="/auth/success"
            element={
              <Suspense fallback={<Loader />}>
                <AuthSuccess />
              </Suspense>
            }
          />
          <Route
            path="/dashboard"
            element={
              <EmailVerificationGuard>
                <Suspense fallback={<Loader />}>
                  <DashboardLayout />
                </Suspense>
              </EmailVerificationGuard>
            }
          >
            <Route index element={<MyAccount />} />
            <Route path="orders" element={<OrdersHistory />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="addresses" element={<DeliveryAddresses />} />
            <Route path="cart" element={<MyCart />} />
          </Route>
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<Loader />}>
                <ForgotPassword />
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<Loader />}>
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path="/check-email"
            element={
              <Suspense fallback={<Loader />}>
                <CheckEmail />
              </Suspense>
            }
          />
          <Route
            path="/email-verification"
            element={
              <Suspense fallback={<Loader />}>
                <EmailVerification />
              </Suspense>
            }
          />
          <Route
            path="/payment/cancel"
            element={
              <RouteWithLayout>
                <PaymentCancel />
              </RouteWithLayout>
            }
          />
          <Route
            path="/payment/success"
            element={
              <RouteWithLayout>
                <PaymentSuccess />
              </RouteWithLayout>
            }
          />
          <Route
            path="/payment/error"
            element={
              <RouteWithLayout>
                <PaymentError />
              </RouteWithLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <RouteWithLayout>
                  <Checkout />
                </RouteWithLayout>
              </ProtectedRoute>
            }
          />

          {/* Management namespace */}
          <Route
            path="/management"
            element={
              <ManagementGuard>
                <Suspense fallback={<Loader />}>
                  <ManagementLayout />
                </Suspense>
              </ManagementGuard>
            }
          >
            {/* Redirect /management to /management/overview by default */}
            <Route index element={<ManagementOverview />} />
            <Route path="general" element={<ManagementGeneral />} />
            <Route path="subscriptions" element={<ManagementSubscriptions />} />
            <Route path="marketplace" element={<ManagementMarketplace />} />
            <Route path="programmes" element={<ManagementProgrammes />} />
            <Route path="users" element={<ManagementUsers />} />
          </Route>

          {/* 404 Catch-all route - must be last */}
          <Route
            path="*"
            element={
              <Suspense fallback={<Loader />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;

