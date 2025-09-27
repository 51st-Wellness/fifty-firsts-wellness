import React, { useState } from "react";
import selflove from "../assets/images/selflove.png"; // hero image
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "../api/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { storeAuthToken } from "../lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "../lib/validation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../styles/phone-input.css";

// Signup page component
const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const watchedFields = watch();

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      setLoading(false);

      toast.success("Signup successful! Please check your email.");
      navigate("/verify-email", { state: { email: data.email } });
    } catch (error: any) {
      setLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Signup failed!");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <main className="w-full flex">
      <section className="w-full flex flex-col md:flex-row h-screen">
        {/* Left Image */}
        <div className="hidden md:block md:w-1/2 h-screen">
          <img
            src={selflove}
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form */}
        <article className="w-full md:w-1/2 h-screen flex flex-col justify-center p-4 sm:p-6 bg-gray-50">
          {/* Card */}
          <div className="w-full max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-sm overflow-y-auto max-h-[95vh]">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900">
              Create an account!
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Join us now! Your wellness journey begins here.
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {/* First Name */}
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.firstName
                      ? "border-red-500"
                      : watchedFields.firstName && !errors.firstName
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName")}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.lastName
                      ? "border-red-500"
                      : watchedFields.lastName && !errors.lastName
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("email")}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.email
                      ? "border-red-500"
                      : watchedFields.email && !errors.email
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <PhoneInput
                  international
                  defaultCountry="US"
                  placeholder="Phone Number"
                  value={watchedFields.phone}
                  onChange={(value) => setValue("phone", value || "")}
                  className={`phone-input ${
                    errors.phone
                      ? "error"
                      : watchedFields.phone && !errors.phone
                      ? "success"
                      : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.password
                      ? "border-red-500"
                      : watchedFields.password && !errors.password
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : watchedFields.confirmPassword && !errors.confirmPassword
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </span>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-2 text-xs text-gray-400">or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Signup */}
            <button className="w-full border border-[#4444B3] px-3 py-2.5 rounded-lg justify-center text-[#4444B3] text-sm font-medium flex items-center gap-2 hover:bg-[#f5f5ff] transition">
              <FcGoogle className="text-lg" />
              Signup with Google
            </button>

            {/* Login Link */}
            <p className="text-xs text-center text-gray-600 mt-3">
              Already have an account?{" "}
              <a href="/login" className="text-teal-700 font-semibold">
                Login
              </a>
            </p>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Signup;
