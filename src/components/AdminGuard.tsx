import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextProvider";
import { getUserProfile } from "../api/user.api";
import Loader from "./Loader";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      // If user is already loaded and authenticated, check their role
      if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
        // User is authenticated but not an admin or moderator
        return;
      }
    } else if (!authLoading && isAuthenticated && !user) {
      // User is authenticated but profile not loaded, fetch it
      fetchUserProfile();
    }
  }, [isAuthenticated, user, authLoading]);

  const fetchUserProfile = async () => {
    try {
      setIsCheckingProfile(true);
      setProfileError(null);

      const response = await getUserProfile();
      const userProfile = response.data?.user;

      if (!userProfile) {
        setProfileError("Failed to load user profile");
        return;
      }

      if (userProfile.role !== "ADMIN" && userProfile.role !== "MODERATOR") {
        // User is not an admin or moderator
        setProfileError(
          "Access denied. Admin or Moderator privileges required."
        );
        return;
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);

      if (error.response?.status === 401) {
        // User is not authenticated or token expired
        setProfileError("Authentication required");
      } else {
        setProfileError("Failed to verify user permissions");
      }
    } finally {
      setIsCheckingProfile(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access the admin panel. Please sign in
              to continue.
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#4444B3] text-white px-6 py-3 rounded-full hover:bg-[#343494] transition font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // If authenticated but not an admin or moderator, show access denied message
  if (
    isAuthenticated &&
    user &&
    user.role !== "ADMIN" &&
    user.role !== "MODERATOR"
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have admin or moderator privileges to access this area.
              Only administrators and moderators can view the admin panel.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-[#4444B3] text-white px-6 py-3 rounded-full hover:bg-[#343494] transition font-medium"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // If there's a profile error (401 or other issues)
  if (profileError) {
    if (profileError === "Authentication required") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="mb-6">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Authentication Required
              </h3>
              <p className="text-gray-600 mb-6">
                Your session has expired. Please sign in again to access the
                admin panel.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#4444B3] text-white px-6 py-3 rounded-full hover:bg-[#343494] transition font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Access Error
              </h3>
              <p className="text-gray-600 mb-6">{profileError}</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-[#4444B3] text-white px-6 py-3 rounded-full hover:bg-[#343494] transition font-medium"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      );
    }
  }

  // If user is authenticated and is an admin or moderator, render the children
  return <>{children}</>;
};

export default AdminGuard;
