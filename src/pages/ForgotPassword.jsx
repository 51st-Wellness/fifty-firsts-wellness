import React, { useState } from "react";
import loginlogo from "../assets/images/loginlogo.png";
import logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgetPassword } from "../api/auth.api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await forgetPassword(email);

      toast.success(res.message || "Password reset link sent to your email 📧");

      // Redirect after short delay (to OTP or reset page)
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
        // adjust route depending on your flow
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
              Forgot Password
            </div>
            <div className="text-[#667085] text-sm sm:text-base text-center mt-3 mb-6">
              Enter your email and we’ll send you a link to reset your password
            </div>

            <div className="w-full max-w-md mx-auto bg-gray-50 p-6 rounded-lg shadow-sm">
              <form className="space-y-4" onSubmit={handleSubmit}>
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
                    placeholder="johndoe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-[#006666] text-white rounded-full font-medium hover:bg-[#006666]/80 transition disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Submit"}
                </button>

                <div className="text-center">or</div>

                <div className="text-base text-[#475464] flex justify-center whitespace-nowrap">
                  Remember password?{" "}
                  <span>
                    <Link
                      to="/login"
                      className="ml-2 text-[#006666] text-sm font-semibold cursor-pointer"
                    >
                      Login
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

export default ForgotPassword;
