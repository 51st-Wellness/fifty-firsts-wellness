import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(() => {
    // Load user data from local storage upon component initialization
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const login = async (email, password) => {
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
    } catch (error) {
      if (error.response) {
        setError(false);
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
  return useContext(AuthContext);
};
