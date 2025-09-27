import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormData } from "../lib/validation";
import {
  resetPassword as resetPasswordApi,
  forgetPassword,
} from "../api/auth.api";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff, Lock, RefreshCw } from "lucide-react";
import selflove from "../assets/images/selflove.png";

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const watchedFields = watch();

  // Set email from location state
  useEffect(() => {
    if (location.state?.email) {
      setValue("email", location.state.email);
    }
  }, [location.state, setValue]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      await resetPasswordApi({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      toast.success("Password reset successfully! 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !watchedFields.email) return;

    setResendLoading(true);
    try {
      await forgetPassword(watchedFields.email);
      toast.success("Reset code sent to your email");
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend code";
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setValue("otp", value);
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
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green/20 to-brand-purple/20"></div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/forgot-password")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors self-start"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>

          <div className="max-w-sm mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-brand-green" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Reset Your Password
              </h1>
              <p className="text-gray-600 text-sm">
                Enter the code sent to your email and create a new password.
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
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors ${
                      errors.email
                        ? "border-red-500"
                        : watchedFields.email && !errors.email
                        ? "border-brand-green"
                        : "border-gray-300"
                    }`}
                    readOnly={!!location.state?.email}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* OTP Input */}
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    {...register("otp")}
                    onChange={handleOtpChange}
                    className={`w-full border rounded-lg px-4 py-3 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors ${
                      errors.otp
                        ? "border-red-500"
                        : watchedFields.otp && !errors.otp
                        ? "border-brand-green"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.otp.message}
                    </p>
                  )}
                </div>

                {/* New Password Input */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      placeholder="Enter new password"
                      {...register("newPassword")}
                      className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors ${
                        errors.newPassword
                          ? "border-red-500"
                          : watchedFields.newPassword && !errors.newPassword
                          ? "border-brand-green"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      {...register("confirmPassword")}
                      className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : watchedFields.confirmPassword &&
                            !errors.confirmPassword
                          ? "border-brand-green"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-green text-white py-3 rounded-lg font-medium hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>

              {/* Resend Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm mb-3">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={
                    resendLoading || resendCooldown > 0 || !watchedFields.email
                  }
                  className="w-full flex items-center justify-center gap-2 text-brand-green hover:text-brand-green-dark font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend Code"}
                </button>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Having trouble? Check your spam folder or contact support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
