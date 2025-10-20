import React from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleOAuthButtonProps {
  text?: string;
  className?: string;
  disabled?: boolean;
}

// Google OAuth button component with browser redirect
const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
  text = "Continue with Google",
  className = "",
  disabled = false,
}) => {
  // Handle Google OAuth redirect
  const handleGoogleSignIn = () => {
    if (disabled) return;

    // Store current location in localStorage to redirect back after auth
    localStorage.setItem(
      "googleAuthRedirectUrl",
      window.location.pathname + window.location.search
    );

    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3100";
    const googleAuthUrl = `${baseUrl}/auth/google`;

    // Redirect to Google OAuth
    window.location.href = googleAuthUrl;
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
