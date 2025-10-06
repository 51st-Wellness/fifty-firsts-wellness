import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { verifyEmail, resendVerification } from "../api/auth.api";
import { useAuth } from "../context/AuthContextProvider";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";

// Validation schema for OTP
const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

const EmailVerification: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [email, setEmail] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();
  const { user, loadUserProfile } = useAuth();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
  });

  const watchedFields = watch();

  // Get email from location state or user context
  useEffect(() => {
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (user?.email) {
      setEmail(user.email);
    } else {
      // If no email available, redirect to login
      navigate("/login");
    }
  }, [location.state, user, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-focus on OTP input
  useEffect(() => {
    const otpInput = document.getElementById("otp");
    if (otpInput) {
      otpInput.focus();
    }
  }, []);

  const onSubmit = async (data: OtpFormData) => {
    setLoading(true);
    try {
      await verifyEmail({
        email,
        otp: data.otp,
      });

      toast.success("Email verified successfully!");

      // Reload user profile to get updated verification status
      await loadUserProfile();

      // Redirect to home or dashboard
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Verification failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    try {
      await resendVerification({ email });
      toast.success("Verification code sent to your email");
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
        </button>

        {/* Verification Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-brand-green" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-gray-900 font-medium">{email}</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* OTP Input */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Verification Code
              </label>
              <input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength={6}
                {...register("otp")}
                onChange={handleOtpChange}
                className={`w-full border rounded-lg px-4 py-3 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-green ${
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading || !watchedFields.otp || watchedFields.otp.length !== 6
              }
              className="w-full bg-brand-green text-white py-3 rounded-lg font-medium hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={resendLoading || resendCooldown > 0}
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

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Check your spam folder if you don't see the email
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmailVerification;
