import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContextProvider";
import { checkAuth, getUserProfile } from "../api/user.api";
import { getAuthToken } from "../lib/utils";
import PageLoader from "./ui/PageLoader";
import { Lock, XCircle, AlertTriangle } from "lucide-react";

interface ManagementGuardProps {
  children: React.ReactNode;
}

// Utility component for carded pages
const CenteredCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  button?: React.ReactNode;
}> = ({ icon, title, description, button }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md mx-auto px-6">
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4" style={{ height: 56 }}>
          {icon}
        </div>
        <h3
          className="text-2xl font-semibold text-gray-800 mb-2"
          style={{
            fontFamily: '"League Spartan", "Arial Rounded MT Bold", Arial, sans-serif',
            letterSpacing: 0.3,
          }}
        >
          {title}
        </h3>
        <p className="text-gray-600 mb-6">{description}</p>
      </div>
      {button}
    </div>
  </div>
);

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

      if (!token) {
        setShouldRedirect(true);
        setIsVerifying(false);
        return;
      }

      if (isAuthenticated && user) {
        if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
          setProfileError(
            "Access denied. Admin or Moderator privileges required."
          );
        }
        setIsVerifying(false);
        return;
      }

      try {
        await checkAuth();
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

    if (authLoading || !isAuthenticated || !user) {
      verifyAuthAndRole();
    } else {
      if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
        setProfileError(
          "Access denied. Admin or Moderator privileges required."
        );
      }
      setIsVerifying(false);
    }
  }, [isAuthenticated, user, authLoading]);

  if (authLoading || isVerifying) {
    return <PageLoader />;
  }

  // If not authenticated, show login message
  if (shouldRedirect || !isAuthenticated) {
    return (
      <CenteredCard
        icon={<Lock className="h-14 w-14 text-gray-400" />}
        title="Authentication Required"
        description="You need to be logged in to access the management panel. Please sign in to continue."
        button={
          <button
            onClick={() => {
              const redirectPath = location.pathname + location.search;
              const loginPath = `/login?redirect=${encodeURIComponent(redirectPath)}`;
              navigate(loginPath);
            }}
            className="bg-brand-green hover:bg-brand-green/90 text-white px-6 py-3 rounded-full transition font-medium"
            style={{
              fontFamily: '"League Spartan", "Arial Rounded MT Bold", Arial, sans-serif',
              fontWeight: 600,
              fontSize: 18,
              boxShadow: "0 1px 2px rgba(18,183,106,0.1)",
            }}
          >
            Sign In
          </button>
        }
      />
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
      <CenteredCard
        icon={<XCircle className="h-14 w-14 text-red-400" />}
        title="Access Denied"
        description="You don't have admin or moderator privileges to access this area. Only administrators and moderators can view the management panel."
        button={
          <button
            onClick={() => navigate("/")}
            className="bg-[#4444B3] text-white px-6 py-3 rounded-full hover:bg-[#343494] transition font-medium"
            style={{
              fontFamily: '"League Spartan", "Arial Rounded MT Bold", Arial, sans-serif',
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            Go to Homepage
          </button>
        }
      />
    );
  }

  // If there's a profile error (401 or other issues)
  if (profileError) {
    if (profileError === "Authentication required") {
      return (
        <CenteredCard
          icon={<Lock className="h-14 w-14 text-gray-400" />}
          title="Authentication Required"
          description="Your session has expired. Please sign in again to access the management panel."
          button={
            <button
              onClick={() => navigate("/login")}
              className="bg-brand-green hover:bg-brand-green/90 text-white px-6 rounded-full transition font-medium"
              style={{
                fontFamily: '"League Spartan", "Arial Rounded MT Bold", Arial, sans-serif',
                fontWeight: 600,
                fontSize: 18,
                boxShadow: "0 1px 2px rgba(18,183,106,0.1)",
              }}
            >
              Sign In
            </button>
          }
        />
      );
    } else {
      return (
        <CenteredCard
          icon={<AlertTriangle className="h-14 w-14 text-yellow-500" />}
          title="Access Error"
          description={profileError}
          button={
            <button
              onClick={() => navigate("/")}
              className="bg-[#4444B3] text-white px-6 py-3 rounded-full hover:bg-[#343494] transition font-medium"
              style={{
                fontFamily: '"League Spartan", "Arial Rounded MT Bold", Arial, sans-serif',
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              Go to Homepage
            </button>
          }
        />
      );
    }
  }

  // If user is authenticated and is an admin or moderator, render the children
  return <>{children}</>;
};

export default ManagementGuard;
