import React, { useState } from "react";
import logo from "../assets/images/logo-with-name.png";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../lib/validation";
import GoogleOAuthButton from "../components/GoogleOAuthButton";

// Login page component
const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;

    const result = await login(email, password);
    if (result === true) {
      navigate("/");
    } else if (result === "verification_required") {
      // Show info message and redirect to email verification page
      setTimeout(() => {
        navigate("/email-verification", { state: { email } });
      }, 1500); // Small delay to let user read the message
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image (hidden on mobile) */}
      <div
        className="hidden md:block md:w-1/2 relative"
        style={{
          backgroundImage: "url(/assets/homepage/hero-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "55% center",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-4">
            <Link to="/">
              <img
                src={logo}
                alt="Fifty Firsts Wellness"
                className="h-12 w-auto hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-green mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Welcome back!
            </h1>
            <p className="text-sm text-gray-600">
              Please enter your details to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="johndoe@example.com"
                  {...register("email")}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Privacy & Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register("agreeToTerms")}
                className="mt-1 h-4 w-4 text-white border-gray-300 rounded accent-brand-green-light"
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-600 leading-relaxed"
              >
                I have read and agree to the{" "}
                <Link
                  to="/privacy-policy"
                  className="text-brand-green hover:text-brand-green-dark underline"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  to="/terms-and-conditions"
                  className="text-brand-green hover:text-brand-green-dark underline"
                >
                  Terms & Conditions
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs">
                {errors.agreeToTerms.message}
              </p>
            )}

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-brand-green text-sm font-medium hover:text-brand-green-dark transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-brand-green text-white py-3 px-6 rounded-full font-semibold hover:bg-brand-green-dark transition-colors"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Login
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Google Login */}
            <GoogleOAuthButton text="Sign in with Google" />

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-green font-semibold hover:text-brand-green-dark transition-colors"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
