import { createContext } from "react";

interface User {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
  token: string;
  loading: boolean;
  error: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);