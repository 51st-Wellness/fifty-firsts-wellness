import React, { useContext, useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginApi, googleOneTap } from "../api/auth.api";
import {
  checkAuth,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  logoutUser,
} from "../api/user.api";
import type { User } from "../types/user.types";
import type { UpdateProfilePayload } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { storeAuthToken, getAuthToken, removeAuthToken } from "../lib/utils";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading true to check auth on mount
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if token is valid
      await checkAuth();

      // If check passes, load user profile
      await loadUserProfile();
      setIsAuthenticated(true);
    } catch (error: any) {
      // Token is invalid or expired
      removeAuthToken();
      setIsAuthenticated(false);
      setUser(null);
      setError(null); // Don't show error for expired tokens
    } finally {
      setLoading(false);
    }
  };

  // Load user profile data
  const loadUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true); // Set authenticated state when profile loads successfully
        setError(null);
      }
    } catch (error: any) {
      console.error("Error loading user profile:", error);
      if (error.response?.status === 401) {
        // Token expired, clear auth state
        removeAuthToken();
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  };

  // Login user
  const login = async (
    email: string,
    password: string
  ): Promise<boolean | "verification_required"> => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginApi({ email, password });

      if (response.data?.accessToken) {
        storeAuthToken(response.data.accessToken);
        setIsAuthenticated(true);
        // Set user directly from login response to avoid an immediate refetch
        if (response.data?.user) {
          setUser(response.data.user);
        }

        toast.success("Login successful!");
        return true;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);

      // Check if error is about email verification
      if (errorMessage.toLowerCase().includes("verify your email")) {
        return "verification_required";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }

    return false;
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser(); // Call backend logout
    } catch (error) {
      // Even if backend logout fails, clear local state
      console.error("Logout error:", error);
    } finally {
      // Clear local state
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setLoading(false);
      navigate("/");
      toast.success("Logged out successfully");
    }
  };

  // Update user profile
  const updateProfile = async (
    payload: UpdateProfilePayload
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await updateUserProfile(payload);

      if (response.data?.user) {
        setUser(response.data.user);
        toast.success("Profile updated successfully!");
        return true;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Update profile picture
  const updateProfilePictureHandler = async (file: File): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await updateProfilePicture(file);

      if (response.data?.user) {
        setUser(response.data.user);
        toast.success("Profile picture updated successfully!");
        return true;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Profile picture update failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Google One Tap login
  const loginWithGoogle = async (token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await googleOneTap({ token });

      if (response.data?.accessToken) {
        storeAuthToken(response.data.accessToken);
        setIsAuthenticated(true);
        // Set user directly from login response to avoid an immediate refetch
        if (response.data?.user) {
          setUser(response.data.user);
        }

        toast.success("Google login successful!");
        return true;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Google login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }

    return false;
  };

  // Check if email is verified
  const isEmailVerified = user?.isEmailVerified ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isEmailVerified,
        loading,
        error,
        login,
        logout,
        checkAuthStatus,
        loadUserProfile,
        updateProfile,
        updateProfilePicture: updateProfilePictureHandler,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
