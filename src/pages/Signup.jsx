import React, { useState } from "react";
import logo from "../assets/images/logo.png"; // replace with your actual logo path
import loginlogo from "../assets/images/loginlogo.png"; // replace with your actual logo path
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "../services/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await signUp({
        email,
        password,
        firstName,
        lastName,
        city,
        phone,
        address,
        bio,
        role,
      });
      setLoading(false);
      toast.success(response.message || "Signup successful!");
      navigate("/check-email");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.message || "Signup failed!");
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
            src={loginlogo}
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form */}
        <article className="w-full md:w-1/2 h-screen flex flex-col justify-center sm:p-10 bg-gray-50">
          {/* Logo */}
          <div>
            <img className="w-16 mb-6" src={logo} alt="Logo" />
          </div>

          {/* Card */}
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm overflow-y-auto max-h-[85vh]">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900">Create an account!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Join us now! Your wellness journey begins here.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Phone + City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Address */}
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Bio */}
              <textarea
                placeholder="Bio"
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>

              {/* Role */}
              <input
                type="text"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                disabled={loading}
                className="w-full bg-teal-700 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 transition disabled:opacity-50"
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-2 text-sm text-gray-400">or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Signup */}
            <button className="w-full border border-[#4444B3] px-2 py-2 rounded-full justify-center text-[#4444B3] text-lg font-semibold flex items-center gap-3 hover:bg-[#f5f5ff] transition">
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
