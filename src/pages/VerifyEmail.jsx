import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOtp } from "../services/auth"; // you'll create this service

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!email || !otp) {
            toast.error("Email and OTP are required!");
            return;
        }

        setLoading(true);
        try {
            const response = await verifyOtp({ email, otp });
            setLoading(false);
            toast.success(response.message || "Email verified successfully!");
            navigate("/login");
        } catch (error) {
            setLoading(false);
            if (error.response) {
                toast.error(error.response.data.message || "Invalid OTP!");
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    return (
        <main className="w-full h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h2>
                <p className="text-sm text-gray-500 mb-6">
                    We sent an OTP code to your email. Enter it below to continue.
                </p>

                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // allow typing
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-700 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 transition disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default VerifyEmail;
