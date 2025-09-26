import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckEmail = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login page after 5 seconds
        const timer = setTimeout(() => {
            navigate("/login");
        }, 7000);

        return () => clearTimeout(timer); // cleanup
    }, [navigate]);

    return (
        <main className="w-full h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">
                    Verify your email
                </h2>
                <p className="text-gray-600 mb-6">
                    We’ve sent a confirmation link to your email. Please check your inbox
                    to verify your account.
                </p>
                <p className="text-sm text-gray-500">
                    Redirecting you to the login page in 5 seconds...
                </p>
                <button
                    onClick={() => navigate("/login")}
                    className="mt-6 w-full bg-teal-700 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 transition"
                >
                    Go to Login Now
                </button>
            </div>
        </main>
    );
};

export default CheckEmail;
