import React, { useEffect, useState } from "react";
import selflove from "../assets/images/selflove.png";
import logo from "../assets/images/logo.png";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextProvider";
import Cookies from "js-cookie";

interface FormData {
  email: string;
  password: string;
}

// Login page component
const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    // Handle remember me functionality
    if (rememberMe) {
      Cookies.set("savedEmail", email, { expires: 30, path: "/" });
      Cookies.set("savedPassword", password, { expires: 30, path: "/" });
    } else {
      Cookies.remove("savedEmail", { path: "/" });
      Cookies.remove("savedPassword", { path: "/" });
    }

    const success = await login(email, password);
    if (success) {
      navigate("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Load saved credentials if they exist
  useEffect(() => {
    const savedEmail = Cookies.get("savedEmail");
    const savedPassword = Cookies.get("savedPassword");

    if (savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <section className="w-full flex flex-col md:flex-row h-screen">
        {/* Left Image (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={selflove}
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-8">
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center md:text-left mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Welcome Back!
              </h1>
              <p className="text-sm text-gray-600">
                Please enter your details to access your account
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3 w-3 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                    />
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-brand-green text-xs font-medium hover:text-brand-green-dark transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-brand-green text-white py-2.5 px-4 rounded-lg font-medium hover:bg-brand-green-dark transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  Sign In
                  <ArrowRight size={16} />
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FcGoogle size={18} />
                  Sign in with Google
                </button>

                <div className="text-center text-gray-600 text-xs">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-brand-green font-medium hover:text-brand-green-dark transition-colors"
                  >
                    Create an account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
