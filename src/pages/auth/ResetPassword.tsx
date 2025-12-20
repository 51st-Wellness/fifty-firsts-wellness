import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  resetPassword as resetPasswordApi,
  forgetPassword,
} from "../../api/auth.api";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff, RefreshCw } from "lucide-react";
import StepIndicator from "../../components/ui/StepIndicator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../components/ui/input-otp";
import LoadingButton from "../../components/ui/LoadingButton";

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

  const [otpLoading, setOtpLoading] = useState<boolean>(false);

  const onOtpSubmit = async (data: OtpVerificationData) => {
    setOtpLoading(true);
    try {
      setVerifiedData(data);
      setCurrentStep(2);
    } finally {
      setOtpLoading(false);
    }
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
          {/* Back Button */}
          <button
            onClick={() =>
              currentStep === 1
                ? navigate("/forgot-password")
                : handleBackToStep1()
            }
            className="flex items-center gap-2 text-gray-600 hover:text-brand-green mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">
              {currentStep === 1 ? "Back" : "Previous Step"}
            </span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Reset Password
            </h1>
            <p className="text-sm text-gray-600">
              {currentStep === 1
                ? "Enter the verification code sent to your email"
                : "Create your new password"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={2}
              steps={steps}
            />
          </div>

          {/* Form */}
          <div>
              {currentStep === 1 ? (
                /* Step 1: OTP Verification */
                <form
                  onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                  className="space-y-5"
                >
                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email address"
                      {...otpForm.register("email")}
                      className={`w-full border-2 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-colors ${
                        otpForm.formState.errors.email
                          ? "border-red-500 bg-red-50"
                          : otpForm.watch("email") &&
                            !otpForm.formState.errors.email
                          ? "border-brand-green bg-brand-green/5"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      readOnly={!!location.state?.email}
                    />
                    {otpForm.formState.errors.email && (
                      <p className="text-red-500 text-xs mt-2">
                        {otpForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* OTP Input */}
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      Verification Code
                    </label>
                    <div className="flex justify-start">
                      <InputOTP
                        maxLength={6}
                        value={otpForm.watch("otp") || ""}
                        onChange={(value) => otpForm.setValue("otp", value)}
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
                      <p className="text-red-500 text-xs mt-2">
                        {otpForm.formState.errors.otp.message}
                      </p>
                    )}
                  </div>

                  {/* Next Button */}
                  <LoadingButton
                    type="submit"
                    loading={otpLoading}
                    loadingText="Verifying..."
                    disabled={
                      !otpForm.watch("otp") ||
                      otpForm.watch("otp")?.length !== 6
                    }
                    fullWidth
                    className="py-3.5 px-6"
                  >
                    Next
                  </LoadingButton>

                  {/* Resend Section */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-3">
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
                        className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                </form>
              ) : (
                /* Step 2: Password Reset */
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-5"
                >
                  {/* New Password Input */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        placeholder="Enter new password"
                        {...passwordForm.register("newPassword")}
                        className={`w-full border-2 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-colors ${
                          passwordForm.formState.errors.newPassword
                            ? "border-red-500 bg-red-50"
                            : passwordForm.watch("newPassword") &&
                              !passwordForm.formState.errors.newPassword
                            ? "border-brand-green bg-brand-green/5"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-red-500 text-xs mt-2">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        {...passwordForm.register("confirmPassword")}
                        className={`w-full border-2 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-colors ${
                          passwordForm.formState.errors.confirmPassword
                            ? "border-red-500 bg-red-50"
                            : passwordForm.watch("confirmPassword") &&
                              !passwordForm.formState.errors.confirmPassword
                            ? "border-brand-green bg-brand-green/5"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-2">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    loadingText="Resetting Password..."
                    fullWidth
                    className="py-3.5 px-6"
                  >
                    Reset Password
                  </LoadingButton>
                </form>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Having trouble? Check your spam folder or{" "}
                <Link to="/contact" className="text-brand-green hover:text-brand-green-dark font-medium">
                  contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  };
  
export default ResetPassword;
