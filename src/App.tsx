import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import MarketPlace from "./pages/MarketPlace";
import BlogList from "./pages/BlogList";
// import BlogPost from "./pages/BlogPost";
import Blog from "./pages/Blog";
import AIWellness from "./pages/AIWellness";
import Membership from "./pages/Membership";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PersonalWellnessProgrammes from "./pages/service/PersonalWellnessProgrammes";
import WellnessProgramDetails from "./pages/service/WellnessProgramDetails";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import Podcasts from "./pages/ResourcesHub/Podcasts";
import PodcastDetail from "./pages/ResourcesHub/PodcastDetail";
import Webinars from "./pages/ResourcesHub/Webinars";
import BusinessWellnessProgrammes from "./pages/service/BusinessWellnessProgrammes";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./pages/ResetPassword";
import CheckEmail from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";
import EmailVerification from "./pages/EmailVerification";
import EmailVerificationGuard from "./components/EmailVerificationGuard";
import Loader from "./components/Loader";
import Footer from "./components/Footer";
import BlogPost from "@/pages/BlogPost";

// Admin routes (lazy loaded)
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminGeneral = lazy(() => import("./pages/admin/AdminGeneral"));
const AdminMarketplace = lazy(() => import("./pages/admin/AdminMarketplace"));
const AdminProgrammes = lazy(() => import("./pages/admin/AdminProgrammes"));

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* {location.pathname.startsWith("/admin") ? null : } */}
      <div>
        <Toaster position="top-center" />
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
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <EmailVerificationGuard>
                <Profile />
              </EmailVerificationGuard>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-verification" element={<EmailVerification />} />

          {/* Admin namespace */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<Loader />}>
                <AdminLayout />
              </Suspense>
            }
          >
            {/* Redirect /admin to /admin/overview by default */}
            <Route
              // path="overview"
              index
              element={
                <Suspense fallback={<Loader />}>
                  <AdminOverview />
                </Suspense>
              }
            />
            <Route
              path="general"
              element={
                <Suspense fallback={<Loader />}>
                  <AdminGeneral />
                </Suspense>
              }
            />
            <Route
              path="marketplace"
              element={
                <Suspense fallback={<Loader />}>
                  <AdminMarketplace />
                </Suspense>
              }
            />
            <Route
              path="programmes"
              element={
                <Suspense fallback={<Loader />}>
                  <AdminProgrammes />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
