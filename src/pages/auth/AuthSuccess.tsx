import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContextProvider";
import { storeAuthToken } from "../../lib/utils";
import http from "../../api/http";
// Auth success page for handling OAuth redirects
const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { loadUserProfile } = useAuth();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Extract token from URL parameters
        const token = searchParams.get("token");

        if (token) {
          // Store the auth token - the existing interceptor will automatically pick this up
          storeAuthToken(token);
          await loadUserProfile();
        }

        // Get the stored redirect URL from localStorage
        const redirectUrl =
          localStorage.getItem("googleAuthRedirectUrl") || "/";

        // Clean up localStorage
        localStorage.removeItem("googleAuthRedirectUrl");

        // Redirect to the stored URL or default to home
        const targetUrl =
          redirectUrl &&
          ["/login", "/signup", "/email-verification", "/"].includes(
            redirectUrl as string
          )
            ? "/"
            : redirectUrl;
        navigate(targetUrl, { replace: true });
      } catch (error) {
        console.error("Auth success error:", error);
        // If auth check fails, redirect to login
        navigate("/login", { replace: true });
      }
    };

    // Small delay to ensure page is fully loaded
    const timer = setTimeout(handleAuthSuccess, 100);

    return () => clearTimeout(timer);
  }, [navigate, loadUserProfile, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
        <h2
          className="text-xl font-semibold text-gray-900 mb-2"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Completing sign in...
        </h2>
        <p className="text-gray-600">Please wait while we sign you in.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
