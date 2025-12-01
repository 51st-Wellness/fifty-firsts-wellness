import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContextProvider";
import { checkAuth } from "../api/user.api";
import { getAuthToken } from "../lib/utils";
import PageLoader from "./ui/PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Component to protect routes that require authentication
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = getAuthToken();

      // If no token, redirect immediately
      if (!token) {
        setShouldRedirect(true);
        setIsVerifying(false);
        return;
      }

      // If already authenticated with user data, no need to verify
      if (isAuthenticated && user) {
        setIsVerifying(false);
        return;
      }

      // Verify authentication with backend
      try {
        await checkAuth();
        // Auth check passed, wait for user profile to load
        setIsVerifying(false);
      } catch (error: any) {
        console.error("Auth verification failed:", error);
        // Only redirect if it's a clear auth failure (401, 403)
        if (error.response?.status === 401 || error.response?.status === 403) {
          setShouldRedirect(true);
        }
        setIsVerifying(false);
      }
    };

    // Only verify if we're still loading auth or not authenticated
    if (authLoading || !isAuthenticated) {
      verifyAuth();
    } else {
      setIsVerifying(false);
    }
  }, [isAuthenticated, user, authLoading]);

  // Show loader while verifying authentication
  if (authLoading || isVerifying) {
    return <PageLoader />;
  }

  // Redirect to login if not authenticated
  if (shouldRedirect || !isAuthenticated) {
    const redirectPath = location.pathname + location.search;
    const loginPath = `/login?redirect=${encodeURIComponent(redirectPath)}`;
    return <Navigate to={loginPath} replace />;
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
