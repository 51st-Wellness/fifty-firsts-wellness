import axios from 'axios'; 
import http from '../helpers/http';

export const signUp = async (payload) => {
    const response = await http().post("/auth/signup", payload);
    return response.data;
}

// verify OTP
export const verifyOtp = async (data) => {
    const response = await http().post("/auth/verify-email", data);
    return response.data;
};



export const forgetPassword = async (email) => {
    try {
        const response = await http().post("/auth/forget-password", { email });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Failed to send reset link");
        } else {
            throw new Error("Network error");
        }
    }
};

export const resetPassword = async ({ email, otp, newPassword }) => {
    try {
        const response = await http().post("/auth/reset-password", {
            email,
            otp,
            newPassword,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Failed to reset password");
        } else {
            throw new Error("Network error");
        }
    }
};
