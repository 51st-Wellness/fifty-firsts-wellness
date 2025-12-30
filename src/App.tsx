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
  <>
    <Suspense fallback={<Loader />}>
      <Navbar />
    </Suspense>
    <Suspense fallback={<Loader />}>{children}</Suspense>
    {showFooter && (
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    )}
  </>
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
                <Suspense fallback={<Loader />}>
                  <Home />
                </Suspense>
              </RouteWithLayout>
            }
          />
          {/** Removed legacy /homepage route that referenced HomePage.jsx */}
          <Route
            path="/about"
            element={
              <RouteWithLayout>
                <Suspense fallback={<Loader />}>
                  <About />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/services/personal-wellness"
            element={
              <RouteWithLayout>
                <Suspense fallback={<Loader />}>
                  <PersonalWellnessProgrammes />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/services/business-wellness"
            element={
              <RouteWithLayout>
                <Suspense fallback={<Loader />}>
                  <BusinessWellnessProgrammes />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/services/program-details"
            element={
              <RouteWithLayout>
                <Suspense fallback={<Loader />}>
                  <WellnessProgramDetails />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/marketplace"
            element={
              <RouteWithLayout showFooter={false}>
                <Suspense fallback={<Loader />}>
                  <MarketPlace />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/products/:productId"
            element={
              <RouteWithLayout showFooter={false}>
                <Suspense fallback={<Loader />}>
                  <ProductDetail />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/programmes"
            element={
              <RouteWithLayout>
                <Suspense fallback={<Loader />}>
                  <PersonalWellnessProgrammes />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/programmes/:productId"
            element={
              <RouteWithLayout showFooter={false}>
                <Suspense fallback={<Loader />}>
                  <ProgrammeDetail />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/podcasts"
            element={
              <RouteWithLayout showFooter={false}>
                <Suspense fallback={<Loader />}>
                  <Podcasts />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/podcasts/:id"
            element={
              <RouteWithLayout>
                <Suspense fallback={<Loader />}>
                  <PodcastDetail />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/resources/webinars"
            element={
              <RouteWithLayout showFooter={false}>
                <Suspense fallback={<Loader />}>
                  <Webinars />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/blog"
            element={
              <RouteWithLayout>
                <Suspense fallback={<Loader />}>
                  <Blog />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <RouteWithLayout>
                <Suspense fallback={<Loader />}>
                  <BlogPost />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/ai-wellness"
            element={
              <RouteWithLayout showFooter={false}>
                <Suspense fallback={<Loader />}>
                  <AIWellness />
                </Suspense>
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
                <Suspense fallback={<Loader />}>
                  <Subscriptions />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <RouteWithLayout showFooter={false}>
                <Suspense fallback={<Loader />}>
                  <ContactUs />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/cookie-policy"
            element={
              <RouteWithLayout showFooter={false}>
                <Suspense fallback={<Loader />}>
                  <CookiePolicy />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/terms-and-conditions"
            element={
              <RouteWithLayout showFooter={false}>
                <Suspense fallback={<Loader />}>
                  <TermsAndConditions />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <RouteWithLayout showFooter={false}>
                <Suspense fallback={<Loader />}>
                  <PrivacyPolicy />
                </Suspense>
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
            <Route
              index
              element={
                <Suspense fallback={<Loader />}>
                  <MyAccount />
                </Suspense>
              }
            />
            <Route
              path="orders"
              element={
                <Suspense fallback={<Loader />}>
                  <OrdersHistory />
                </Suspense>
              }
            />
            <Route
              path="orders/:orderId"
              element={
                <Suspense fallback={<Loader />}>
                  <OrderDetails />
                </Suspense>
              }
            />
            <Route
              path="addresses"
              element={
                <Suspense fallback={<Loader />}>
                  <DeliveryAddresses />
                </Suspense>
              }
            />
            <Route
              path="cart"
              element={
                <Suspense fallback={<Loader />}>
                  <MyCart />
                </Suspense>
              }
            />
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
                <Suspense fallback={<Loader />}>
                  <PaymentCancel />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/payment/success"
            element={
              <RouteWithLayout>
                <Suspense fallback={<Loader />}>
                  <PaymentSuccess />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/payment/error"
            element={
              <RouteWithLayout>
                <Suspense fallback={<Loader />}>
                  <PaymentError />
                </Suspense>
              </RouteWithLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <RouteWithLayout>
                  <Suspense fallback={<Loader />}>
                    <Checkout />
                  </Suspense>
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
            <Route
              // path="overview"
              index
              element={
                <Suspense fallback={<Loader />}>
                  <ManagementOverview />
                </Suspense>
              }
            />
            <Route
              path="general"
              element={
                <Suspense fallback={<Loader />}>
                  <ManagementGeneral />
                </Suspense>
              }
            />
            <Route
              path="subscriptions"
              element={
                <Suspense fallback={<Loader />}>
                  <ManagementSubscriptions />
                </Suspense>
              }
            />
            <Route
              path="marketplace"
              element={
                <Suspense fallback={<Loader />}>
                  <ManagementMarketplace />
                </Suspense>
              }
            />
            <Route
              path="programmes"
              element={
                <Suspense fallback={<Loader />}>
                  <ManagementProgrammes />
                </Suspense>
              }
            />
            <Route
              path="users"
              element={
                <Suspense fallback={<Loader />}>
                  <ManagementUsers />
                </Suspense>
              }
            />
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
