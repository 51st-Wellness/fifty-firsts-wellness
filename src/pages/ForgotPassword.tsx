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
import { ArrowLeft, Mail, Send } from "lucide-react";
import selflove from "../assets/images/selflove.png";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <section className="w-full flex flex-col md:flex-row h-screen">
        {/* Left Image (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={selflove}
            alt="Reset Password Illustration"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-brand-green/20"></div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors self-start"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back to Login</span>
          </button>

          <div className="max-w-sm mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-brand-purple" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600 text-sm">
                No worries! Enter your email and we'll send you a reset code.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email address"
                    {...register("email")}
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple transition-colors ${
                      errors.email
                        ? "border-red-500"
                        : watchedFields.email && !errors.email
                        ? "border-brand-purple"
                        : "border-gray-300"
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
                  className="w-full bg-brand-purple text-white py-3 rounded-lg font-medium hover:bg-brand-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Reset Code
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-brand-purple font-medium hover:text-brand-purple-dark transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Check your spam folder if you don't receive the email within a
                few minutes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
