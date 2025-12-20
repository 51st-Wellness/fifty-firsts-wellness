import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import MarketPlace from "./pages/marketplace/MarketPlace";
import ProductDetail from "./pages/marketplace/ProductDetail";
import Blog from "./pages/blog/Blog";
import AIWellness from "./pages/AIWellness";
import Membership from "./pages/Membership";
import Subscriptions from "./pages/Subscriptions";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import MyAccount from "./pages/dashboard/MyAccount";
import OrdersHistory from "./pages/dashboard/OrdersHistory";
import OrderDetails from "./pages/dashboard/OrderDetails";
import MyCart from "./pages/dashboard/MyCart";
import DeliveryAddresses from "./pages/dashboard/DeliveryAddresses";
import PersonalWellnessProgrammes from "./pages/service/PersonalWellnessProgrammes";
import WellnessProgramDetails from "./pages/service/WellnessProgramDetails";
import ProgrammeDetail from "./pages/programmes/ProgrammeDetail";
import Podcasts from "./pages/ResourcesHub/Podcasts";
import PodcastDetail from "./pages/ResourcesHub/PodcastDetail";
import Webinars from "./pages/ResourcesHub/Webinars";
import BusinessWellnessProgrammes from "./pages/service/BusinessWellnessProgrammes";
import CookiePolicy from "./pages/legal/CookiePolicy";
import TermsAndConditions from "./pages/legal/TermsAndConditions";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./pages/auth/ResetPassword";
import CheckEmail from "./pages/auth/CheckEmail";
import EmailVerification from "./pages/auth/EmailVerification";
import EmailVerificationGuard from "./components/EmailVerificationGuard";
import ManagementGuard from "./components/ManagementGuard";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import Footer from "./components/Footer";
import BlogPost from "./pages/blog/BlogPost";
import CookieConsent from "./components/CookieConsent";

import PaymentCancel from "./pages/payment/PaymentCancel";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentError from "./pages/payment/PaymentError";
import NotFound from "./pages/NotFound";
import AuthSuccess from "./pages/auth/AuthSuccess";
import Checkout from "./pages/payment/Checkout";

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
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />
          {/** Removed legacy /homepage route that referenced HomePage.jsx */}
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            }
          />
          <Route
            path="/services/personal-wellness"
            element={
              <>
                <Navbar />
                <PersonalWellnessProgrammes />
                <Footer />
              </>
            }
          />
          <Route
            path="/services/business-wellness"
            element={
              <>
                <Navbar />
                <BusinessWellnessProgrammes />
                <Footer />
              </>
            }
          />
          <Route
            path="/services/program-details"
            element={
              <>
                <Navbar />
                <WellnessProgramDetails />
                <Footer />
              </>
            }
          />
          <Route
            path="/marketplace"
            element={
              <>
                <Navbar />
                <MarketPlace />
              </>
            }
          />
          <Route
            path="/products/:productId"
            element={
              <>
                <Navbar />
                <ProductDetail />
              </>
            }
          />
          <Route
            path="/programmes"
            element={
              <>
                <Navbar />
                <PersonalWellnessProgrammes />
                <Footer />
              </>
            }
          />
          <Route
            path="/programmes/:productId"
            element={
              <>
                <Navbar />
                <ProgrammeDetail />
              </>
            }
          />
          <Route
            path="/podcasts"
            element={
              <>
                <Navbar />
                <Podcasts />
                {/* <Footer /> */}
              </>
            }
          />
          <Route
            path="/podcasts/:id"
            element={
              <>
                <Navbar />
                <PodcastDetail />
                <Footer />
              </>
            }
          />
          <Route
            path="/resources/webinars"
            element={
              <>
                <Navbar />
                <Webinars />
              </>
            }
          />
          <Route
            path="/blog"
            element={
              <>
                <Navbar />
                <Blog />
                <Footer />
              </>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <>
                <Navbar />
                <BlogPost />
                <Footer />
              </>
            }
          />
          <Route
            path="/ai-wellness"
            element={
              <>
                <Navbar />
                <AIWellness />
              </>
            }
          />
          <Route path="/membership" element={<Membership />} />
          <Route
            path="/subscriptions"
            element={
              <>
                <Navbar />
                <Subscriptions />
              </>
            }
          />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="/cookie-policy"
            element={
              <>
                <Navbar />
                <CookiePolicy />
              </>
            }
          />
          <Route
            path="/terms-and-conditions"
            element={
              <>
                <Navbar />
                <TermsAndConditions />
              </>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <>
                <Navbar />
                <PrivacyPolicy />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route
            path="/dashboard"
            element={
              <EmailVerificationGuard>
                <DashboardLayout />
              </EmailVerificationGuard>
            }
          >
            <Route index element={<MyAccount />} />
            <Route path="orders" element={<OrdersHistory />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="addresses" element={<DeliveryAddresses />} />
            <Route path="cart" element={<MyCart />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route
            path="/payment/cancel"
            element={
              <>
                <Navbar />
                <PaymentCancel />
                <Footer />
              </>
            }
          />
          <Route
            path="/payment/success"
            element={
              <>
                <Navbar />
                <PaymentSuccess />
                <Footer />
              </>
            }
          />
          <Route
            path="/payment/error"
            element={
              <>
                <Navbar />
                <PaymentError />
                <Footer />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Navbar />
                <Checkout />
                <Footer />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
