import http from "./http";

// Login
export const login = async (payload: { email: string; password: string }) => {
  const { data } = await http().post("/auth/login", payload);
  return data;
};

// Sign up a new user
export const signUp = async (payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  city: string;
  phone: string;
  address: string;
  bio?: string;
  role: string;
}) => {
  const { data } = await http().post("/auth/signup", payload);
  return data;
};

// Verify email OTP
export const verifyOtp = async (payload: { email: string; otp: string }) => {
  const { data } = await http().post("/auth/verify-email", payload);
  return data;
};

// Request forgot password
export const forgetPassword = async (email: string) => {
  const { data } = await http().post("/auth/forget-password", { email });
  return data;
};

// Reset password
export const resetPassword = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const { data } = await http().post("/auth/reset-password", payload);
  return data;
};
