import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContextProvider";

interface EmailVerificationGuardProps {
  children: React.ReactNode;
}

const EmailVerificationGuard: React.FC<EmailVerificationGuardProps> = ({
  children,
}) => {
  const { isAuthenticated, isEmailVerified, user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but email not verified, redirect to verification
  if (isAuthenticated && !isEmailVerified) {
    return (
      <Navigate
        to="/email-verification"
        state={{ email: user?.email }}
        replace
      />
    );
  }

  // If authenticated and email verified, render children
  return <>{children}</>;
};

export default EmailVerificationGuard;
