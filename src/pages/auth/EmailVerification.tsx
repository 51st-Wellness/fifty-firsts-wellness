import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { verifyEmail, resendVerification } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContextProvider";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import logo from "../../assets/images/logo-with-name.png";
import { storeAuthToken } from "../../lib/utils";
import LoadingButton from "../../components/ui/LoadingButton";

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
  const [hasClickedResend, setHasClickedResend] = useState(false);

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
      // If no email available, redirect to signup
      navigate("/signup");
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
      const response = await verifyEmail({
        email,
        otp: data.otp,
      });

      if (response.status === "success" || response.status === "SUCCESS") {
        const { accessToken } = response.data!;
        storeAuthToken(accessToken);
        await loadUserProfile();
        toast.success(response.message);
        navigate("/");
      } else {
        toast.error((response.error?.cause as string) || "Verification failed");
      }
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
    setHasClickedResend(true); // Mark that user has clicked resend (regardless of success/failure)

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
    <main className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Fifty Firsts Wellness" className="h-12" />
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-green mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-brand-green" />
            </div>
            <h1
              className="text-3xl font-semibold text-gray-900 mb-3"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-gray-900 font-semibold mt-1">{email}</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-semibold text-gray-700 mb-2"
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
                className={`w-full border-2 rounded-xl px-4 py-3.5 text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-green transition-all ${
                  errors.otp
                    ? "border-red-500 bg-red-50"
                    : watchedFields.otp && !errors.otp
                    ? "border-brand-green bg-brand-green/5"
                    : "border-gray-300 bg-gray-50"
                }`}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-2 font-medium">
                  {errors.otp.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Verifying..."
              disabled={!watchedFields.otp || watchedFields.otp.length !== 6}
              fullWidth
              rounded="xl"
              className="py-3.5 text-base shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              Verify Email
            </LoadingButton>
          </form>

          {/* Resend Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm font-medium mb-4">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={resendLoading || resendCooldown > 0}
              className="w-full flex items-center justify-center gap-2 text-brand-green hover:text-brand-green-dark font-semibold text-sm py-2.5 px-4 rounded-lg hover:bg-brand-green/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
            </button>
          </div>

          {/* Help Text - Only show after first resend */}
          {hasClickedResend && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                Check your spam folder if you don't see the email
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default EmailVerification;
