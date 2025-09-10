import React, { useState } from "react";
import loginlogo from "../assets/images/loginlogo.png";
import logo from "../assets/images/logo.png";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data: ", formData);
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

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
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-10">
          <div>
            <img className="w-16 mt-8" src={logo} alt="Logo" />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-[#000407] font-medium text-3xl sm:text-4xl text-center">
              Welcome Back!
            </div>
            <div className="text-[#667085] text-sm sm:text-base text-center mb-6">
              Please enter your details to access your account
            </div>

            <div className="w-full max-w-md mx-auto bg-gray-50 p-6 rounded-lg shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded-md px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-3 flex items-center mt-5 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                  <Link
                    to="/forgot-password"
                    className="ml-2 text-[#006666] text-sm justify-end flex font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </Link>
                {/* Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#006666] text-white rounded-full font-medium hover:bg-[#006666]/80 transition"
                >
                  Login
                </button>

                <div className="text-center">or</div>

                <div className="border border-[#4444B3] px-2 py-2 rounded-full justify-center text-[#4444B3] text-lg font-semibold flex items-center gap-3 hover:bg-[#f5f5ff] transition">
                  <FcGoogle className="text-2xl" />
                  Login with Google
                </div>
                <div className="text-base text-[#475464] flex justify-center whitespace-nowrap">
                  Don’t have an account?{" "}

                  <span>
                    <Link
                      to="/signup"
                      className="ml-2 text-[#006666] font-semibold cursor-pointer"
                    >
                      Create an account
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
