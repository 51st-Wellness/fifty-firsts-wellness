import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContextProvider";
import { checkAuth, getUserProfile } from "../api/user.api";
import { getAuthToken } from "../lib/utils";
import PageLoader from "./ui/PageLoader";

interface ManagementGuardProps {
  children: React.ReactNode;
}

// Guard component for management routes requiring admin/moderator access
const ManagementGuard: React.FC<ManagementGuardProps> = ({ children }) => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAuthAndRole = async () => {
      const token = getAuthToken();

      // If no token, redirect immediately
      if (!token) {
        setShouldRedirect(true);
        setIsVerifying(false);
        return;
      }

      // If already authenticated with user data, check role
      if (isAuthenticated && user) {
        if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
          setProfileError(
            "Access denied. Admin or Moderator privileges required."
          );
        }
        setIsVerifying(false);
        return;
      }

      // Verify authentication with backend
      try {
        await checkAuth();

        // Fetch user profile to check role
        const response = await getUserProfile();
        const userProfile = response.data?.user;

        if (!userProfile) {
          setProfileError("Failed to load user profile");
          setIsVerifying(false);
          return;
        }

        if (userProfile.role !== "ADMIN" && userProfile.role !== "MODERATOR") {
          setProfileError(
            "Access denied. Admin or Moderator privileges required."
          );
        }

        setIsVerifying(false);
      } catch (error: any) {
        console.error("Auth verification failed:", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          setShouldRedirect(true);
        } else {
          setProfileError("Failed to verify user permissions");
        }
        setIsVerifying(false);
      }
    };

    // Only verify if we're still loading auth or not authenticated
    if (authLoading || !isAuthenticated || !user) {
      verifyAuthAndRole();
    } else {
      // Check role if user is already loaded
      if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
        setProfileError(
          "Access denied. Admin or Moderator privileges required."
        );
      }
      setIsVerifying(false);
    }
  }, [isAuthenticated, user, authLoading]);

  // Show loading while verifying authentication
  if (authLoading || isVerifying) {
    return <PageLoader />;
  }

  // If not authenticated, show login message
  if (shouldRedirect || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access the management panel. Please
              sign in to continue.
            </p>
          </div>
          <button
            onClick={() => {
              const redirectPath = location.pathname + location.search;
              const loginPath = `/login?redirect=${encodeURIComponent(
                redirectPath
              )}`;
              navigate(loginPath);
            }}
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
              Only administrators and moderators can view the management panel.
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
                management panel.
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

export default ManagementGuard;
