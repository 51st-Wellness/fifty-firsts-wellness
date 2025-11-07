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
import MarketPlace from "./pages/MarketPlace";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import AIWellness from "./pages/AIWellness";
import Membership from "./pages/Membership";
import Subscriptions from "./pages/Subscriptions";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import MyAccount from "./pages/dashboard/MyAccount";
import OrdersHistory from "./pages/dashboard/OrdersHistory";
import OrderDetails from "./pages/dashboard/OrderDetails";
import MyCart from "./pages/dashboard/MyCart";
import MarketplaceActivity from "./pages/dashboard/MarketplaceActivity";
import PersonalWellnessProgrammes from "./pages/service/PersonalWellnessProgrammes";
import WellnessProgramDetails from "./pages/service/WellnessProgramDetails";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import Podcasts from "./pages/ResourcesHub/Podcasts";
import PodcastDetail from "./pages/ResourcesHub/PodcastDetail";
import Webinars from "./pages/ResourcesHub/Webinars";
import BusinessWellnessProgrammes from "./pages/service/BusinessWellnessProgrammes";
import CookiePolicy from "./pages/CookiePolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./pages/ResetPassword";
import CheckEmail from "./pages/CheckEmail";
import EmailVerification from "./pages/EmailVerification";
import EmailVerificationGuard from "./components/EmailVerificationGuard";
import ManagementGuard from "./components/ManagementGuard";
import Loader from "./components/Loader";
import Footer from "./components/Footer";
import BlogPost from "@/pages/BlogPost";
import CookieConsent from "./components/CookieConsent";

import PaymentCancel from "./pages/PaymentCancel";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import AuthSuccess from "./pages/AuthSuccess";

// Management routes (lazy loaded)
const ManagementLayout = lazy(() => import("./pages/management/ManagementLayout"));
const ManagementOverview = lazy(() => import("./pages/management/ManagementOverview"));
const ManagementGeneral = lazy(() => import("./pages/management/ManagementGeneral"));
const ManagementSubscriptions = lazy(
  () => import("./pages/management/ManagementSubscriptions")
);
const ManagementMarketplace = lazy(() => import("./pages/management/ManagementMarketplace"));
const ManagementProgrammes = lazy(() => import("./pages/management/ManagementProgrammes"));
const ManagementUsers = lazy(() => import("./pages/management/ManagementUsers"));

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
            <Route path="cart" element={<MyCart />} />
            <Route path="marketplace" element={<MarketplaceActivity />} />
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
