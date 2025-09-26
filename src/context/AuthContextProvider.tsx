import React, { useContext, useState, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface User {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  token?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(() => {
    // Load user data from local storage upon component initialization
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string>("");
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await loginApi({ email, password });

      if (response?.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        setIsLoggedIn(true);
        setUser(response.data);
        setToken(response.data.token);
        setLoading(false);

        return true; // ✅ success
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }

    return false; //
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
        token,
        loading,
        error,
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
