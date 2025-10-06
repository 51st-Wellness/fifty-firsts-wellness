import { createContext } from "react";
import type { User } from "../types/user.types";

// Update profile payload type
export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  address?: string;
  bio?: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
