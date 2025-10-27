import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "../lib/validation";
import { forgetPassword } from "../api/auth.api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/images/logo-with-name.png";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const watchedFields = watch();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const response = await forgetPassword(data.email);

      toast.success(
        response.message || "Password reset code sent to your email!"
      );

      setHasSubmitted(true); // Mark that user has submitted the form

      // Redirect to reset password page with email
      setTimeout(() => {
        navigate("/reset-password", { state: { email: data.email } });
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset code";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
            <img
              src={logo}
              alt="Fifty Firsts Wellness"
              className="h-12 w-auto"
            />
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
              Forgot Password
            </h1>
            <p className="text-sm text-gray-600">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="johndoe@example.com"
                {...register("email")}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !watchedFields.email}
              className="w-full bg-brand-green text-white py-3 px-6 rounded-full font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              {loading ? "Sending..." : "Submit"}
            </button>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-600">
              Remember password?{" "}
              <Link
                to="/login"
                className="text-brand-green font-semibold hover:text-brand-green-dark transition-colors"
              >
                Login
              </Link>
            </div>
          </form>

          {/* Help Text - Only show after first submission */}
          {hasSubmitted && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Check your spam folder if you don't receive the email within a
                few minutes.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
