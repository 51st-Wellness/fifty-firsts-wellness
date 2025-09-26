import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import MarketPlace from "./pages/MarketPlace";
import Blog from "./pages/Blog";
import AIWellness from "./pages/AIWellness";
import Membership from "./pages/Membership";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PersonalWellnessProgrammes from "./pages/service/PersonalWellnessProgrammes";
import WellnessProgramDetails from "./pages/service/WellnessProgramDetails";
import Podcasts from "./pages/ResourcesHub/Podcasts";
import Webinars from "./pages/ResourcesHub/Webinars";
import BusinessWellnessProgrammes from "./pages/service/BusinessWellnessProgrammes";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./pages/ResetPassword";
import CheckEmail from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";
import Loader from "./components/Loader";

// Admin routes (lazy loaded)
const AdminLayout = lazy(() => import("./pages/AdminLayout"));
const AdminOverview = lazy(() => import("./pages/AdminOverview"));
const AdminMarketplace = lazy(() => import("./pages/AdminMarketplace"));

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/services/personal-wellness"
            element={<PersonalWellnessProgrammes />}
          />
          <Route
            path="/services/business-wellness"
            element={<BusinessWellnessProgrammes />}
          />
          <Route
            path="/services/program-details"
            element={<WellnessProgramDetails />}
          />
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/resources/podcasts" element={<Podcasts />} />
          <Route path="/resources/webinars" element={<Webinars />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/ai-wellness" element={<AIWellness />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Admin namespace */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<Loader />}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route
              path="overview"
              element={
                <Suspense fallback={<Loader />}>
                  <AdminOverview />
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
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
