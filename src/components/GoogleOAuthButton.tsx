import React from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleOAuthButtonProps {
  text?: string;
  className?: string;
  disabled?: boolean;
}

// Google OAuth button component with popup support
const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
  text = "Continue with Google",
  className = "",
  disabled = false,
}) => {
  // Handle Google OAuth popup
  const handleGoogleSignIn = () => {
    if (disabled) return;

    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3100";
    const currentOrigin = window.location.origin;
    const googleAuthUrl = `${baseUrl}/auth/google`;

    // Open Google OAuth in popup
    const popup = window.open(
      googleAuthUrl,
      "google-signin",
      "width=500,height=600,scrollbars=yes,resizable=yes,left=" +
        (window.screen.width / 2 - 250) +
        ",top=" +
        (window.screen.height / 2 - 300)
    );

    // Listen for popup close
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Refresh the page to update auth status
        window.location.reload();
      }
    }, 1000);

    // Listen for messages from popup (if backend sends postMessage)
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        popup?.close();
        clearInterval(checkClosed);
        window.location.reload();
      } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
        popup?.close();
        clearInterval(checkClosed);
        console.error("Google auth error:", event.data.error);
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup listener when popup closes
    const originalCheckClosed = checkClosed;
    const enhancedCheckClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(enhancedCheckClosed);
        clearInterval(originalCheckClosed);
        window.removeEventListener("message", handleMessage);
        window.location.reload();
      }
    }, 1000);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled}
      className={`w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ fontFamily: '"League Spartan", sans-serif' }}
    >
      <FcGoogle size={20} />
      {text}
    </button>
  );
};

export default GoogleOAuthButton;
