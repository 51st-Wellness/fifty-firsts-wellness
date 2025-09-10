import React, { useState } from "react";
import logo from "../assets/images/logo.png" // replace with your actual logo path
import loginlogo from "../assets/images/loginlogo.png" // replace with your actual logo path
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main>
      <section className="w-full flex flex-col md:flex-row h-screen">
        {/* Left Image (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={loginlogo}
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form */}
        <article className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-10">

          {/* Logo */}
          <div>
            <img className="w-16 mt-8" src={logo} alt="Logo" />
          </div>

          {/* Card */}
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900">Create an account!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Join us now! Your wellness journey begins here.
            </p>

            {/* Form */}
            <form className="space-y-4">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                <p className="text-xs text-gray-400 mt-1">
                  Password must contain at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter password again"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="w-full bg-teal-700 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 transition"
              >
                Signup
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-2 text-sm text-gray-400">or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Signup */}
            <button className=" w-full border border-[#4444B3] px-2 py-2 rounded-full justify-center text-[#4444B3] text-lg font-semibold flex items-center gap-3 hover:bg-[#f5f5ff] transition">
              <FcGoogle className="text-2xl" />
              Signup with Google
            </button>

            {/* Login Link */}
            <p className="text-sm text-center text-gray-600 mt-4">
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
