import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextProvider";
import toast from "react-hot-toast";

// Auth success page for handling OAuth redirects
const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // If this is a popup window, notify parent and close
        if (window.opener) {
          window.opener.postMessage(
            { type: "GOOGLE_AUTH_SUCCESS" },
            window.location.origin
          );
          window.close();
          return;
        }

        // Check auth status to update the context
        await checkAuthStatus();

        // Show success message
        toast.success("Successfully signed in with Google!");

        // Redirect to home page
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Auth success error:", error);

        // If this is a popup window, notify parent of error
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "Authentication failed",
            },
            window.location.origin
          );
          window.close();
          return;
        }

        toast.error("Authentication failed. Please try again.");
        navigate("/login", { replace: true });
      }
    };

    handleAuthSuccess();
  }, [navigate, checkAuthStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-600">Please wait while we sign you in.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
