import React, { useState } from "react";
import logo from "../assets/images/logo.png"; // replace with your actual logo path
import loginlogo from "../assets/images/loginlogo.png"; // replace with your actual logo path
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "../api/auth.api";
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
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(phone)) {
      newErrors.phone = "Phone must be at least 10 digits";
    }

    // Password validation
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Required fields
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!city) newErrors.city = "City is required";
    if (!address) newErrors.address = "Address is required";
    if (!role) newErrors.role = "Please select a role";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Stop if validation fails
    }

    setLoading(true);
    try {
      await signUp({
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

      toast.success("Signup successful! Please check your email.");
      navigate("/verify-email", { state: { email } });
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
            <h2 className="text-2xl font-bold text-gray-900">
              Create an account!
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Join us now! Your wellness journey begins here.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => {
                    // Allow only digits
                    const value = e.target.value.replace(/\D/g, "");
                    setPhone(value);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone}</p>
                )}
              </div>

              {/* City */}
              <div>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs">{errors.city}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <textarea
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Role */}
              <div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Role</option>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="COACH">COACH</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs">{errors.role}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </span>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
              >
                {loading ? "Signing up..." : "Sign Up"}
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
