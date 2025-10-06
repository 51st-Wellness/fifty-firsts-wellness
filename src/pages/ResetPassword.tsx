import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  resetPassword as resetPasswordApi,
  forgetPassword,
} from "../api/auth.api";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff, Lock, RefreshCw } from "lucide-react";
import selflove from "../assets/images/selflove.png";
import StepIndicator from "../components/ui/StepIndicator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";

// Step 1: OTP Verification Schema
const otpVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

// Step 2: Password Reset Schema
const passwordResetSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type OtpVerificationData = z.infer<typeof otpVerificationSchema>;
type PasswordResetData = z.infer<typeof passwordResetSchema>;

const ResetPassword: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [verifiedData, setVerifiedData] = useState<OtpVerificationData | null>(
    null
  );

  const navigate = useNavigate();
  const location = useLocation();

  const steps = ["Verify Code", "New Password"];

  // Step 1 Form (OTP Verification)
  const otpForm = useForm<OtpVerificationData>({
    resolver: zodResolver(otpVerificationSchema),
    mode: "onChange",
  });

  // Step 2 Form (Password Reset)
  const passwordForm = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema),
    mode: "onChange",
  });

  // Set email from location state
  useEffect(() => {
    if (location.state?.email) {
      otpForm.setValue("email", location.state.email);
    }
  }, [location.state, otpForm]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const onOtpSubmit = async (data: OtpVerificationData) => {
    setVerifiedData(data);
    setCurrentStep(2);
  };

  const onPasswordSubmit = async (data: PasswordResetData) => {
    if (!verifiedData) return;

    setLoading(true);
    try {
      await resetPasswordApi({
        email: verifiedData.email,
        otp: verifiedData.otp,
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
    const email = otpForm.getValues("email");
    if (resendCooldown > 0 || !email) return;

    setResendLoading(true);
    try {
      await forgetPassword(email);
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

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setVerifiedData(null);
    passwordForm.reset();
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
            onClick={() =>
              currentStep === 1
                ? navigate("/forgot-password")
                : handleBackToStep1()
            }
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors self-start"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">
              {currentStep === 1 ? "Back" : "Previous Step"}
            </span>
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
                {currentStep === 1
                  ? "Enter the verification code sent to your email"
                  : "Create your new password"}
              </p>
            </div>

            {/* Step Indicator */}
            <StepIndicator
              currentStep={currentStep}
              totalSteps={2}
              steps={steps}
            />

            {/* Form Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              {currentStep === 1 ? (
                /* Step 1: OTP Verification */
                <form
                  onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                  className="space-y-4"
                >
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
                      {...otpForm.register("email")}
                      className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors ${
                        otpForm.formState.errors.email
                          ? "border-red-500"
                          : otpForm.watch("email") &&
                            !otpForm.formState.errors.email
                          ? "border-brand-green"
                          : "border-gray-300"
                      }`}
                      readOnly={!!location.state?.email}
                    />
                    {otpForm.formState.errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {otpForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* OTP Input */}
                  <div className="text-center">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Verification Code
                    </label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otpForm.watch("otp") || ""}
                        onChange={(value) => otpForm.setValue("otp", value)}
                        className="justify-center"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {otpForm.formState.errors.otp && (
                      <p className="text-red-500 text-xs mt-1">
                        {otpForm.formState.errors.otp.message}
                      </p>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    type="submit"
                    disabled={
                      !otpForm.watch("otp") ||
                      otpForm.watch("otp")?.length !== 6
                    }
                    className="w-full bg-brand-green text-white py-3 rounded-lg font-medium hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>

                  {/* Resend Section */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-gray-600 text-xs mb-2">
                        Didn't receive the code?
                      </p>
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={
                          resendLoading ||
                          resendCooldown > 0 ||
                          !otpForm.watch("email")
                        }
                        className="inline-flex items-center gap-1 text-brand-green hover:text-brand-green-dark font-medium text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resendLoading ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3" />
                        )}
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : "Resend Code"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* Step 2: Password Reset */
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
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
                        {...passwordForm.register("newPassword")}
                        className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors ${
                          passwordForm.formState.errors.newPassword
                            ? "border-red-500"
                            : passwordForm.watch("newPassword") &&
                              !passwordForm.formState.errors.newPassword
                            ? "border-brand-green"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordForm.formState.errors.newPassword.message}
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
                        {...passwordForm.register("confirmPassword")}
                        className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors ${
                          passwordForm.formState.errors.confirmPassword
                            ? "border-red-500"
                            : passwordForm.watch("confirmPassword") &&
                              !passwordForm.formState.errors.confirmPassword
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
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordForm.formState.errors.confirmPassword.message}
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
              )}
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
