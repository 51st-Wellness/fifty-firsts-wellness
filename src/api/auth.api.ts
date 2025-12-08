import http from "./http";
import type { ResponseDto } from "../types/response.types";
import { User } from "@/types";

// Login
export const login = async (payload: {
  email: string;
  password: string;
  cartItems?: { productId: string; quantity: number }[];
}): Promise<ResponseDto<{ user: User; accessToken: string }>> => {
  const { data } = await http.post("/auth/login", payload);
  return data as ResponseDto<{ user: User; accessToken: string }>;
};

// Sign up a new user
export const signUp = async (payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  cartItems?: { productId: string; quantity: number }[];
}): Promise<ResponseDto<{ email: string }>> => {
  const { data } = await http.post("/auth/signup", payload);
  return data as ResponseDto<{ email: string }>;
};

// Verify email OTP
export const verifyOtp = async (payload: {
  email: string;
  otp: string;
}): Promise<ResponseDto<null>> => {
  const { data } = await http.post("/auth/verify-email", payload);
  return data as ResponseDto<null>;
};

// Request forgot password
export const forgetPassword = async (
  email: string
): Promise<ResponseDto<null>> => {
  const { data } = await http.post("/auth/forget-password", { email });
  return data as ResponseDto<null>;
};

// Reset password
export const resetPassword = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<ResponseDto<null>> => {
  const { data } = await http.post("/auth/reset-password", payload);
  return data as ResponseDto<null>;
};

// Verify email with OTP
export const verifyEmail = async (payload: {
  email: string;
  otp: string;
}): Promise<ResponseDto<{ user: User; accessToken: string }>> => {
  const { data } = await http.post<
    ResponseDto<{ user: User; accessToken: string }>
  >("/auth/verify-email", payload);
  return data;
};

// Resend email verification OTP
export const resendVerification = async (payload: {
  email: string;
}): Promise<ResponseDto<null>> => {
  const { data } = await http.post("/auth/resend-verification", payload);
  return data as ResponseDto<null>;
};

// Google OAuth redirect URL
export const getGoogleAuthUrl = (): string => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3100/api";
  const currentOrigin = window.location.origin;
  return `${baseUrl}/auth/google?origin=${encodeURIComponent(currentOrigin)}`;
};

// Google One Tap authentication
export const googleOneTap = async (payload: {
  token: string;
  cartItems?: { productId: string; quantity: number }[];
}): Promise<ResponseDto<{ user: User; accessToken: string }>> => {
  const { data } = await http.post("/auth/google/onetap", payload);
  return data as ResponseDto<{ user: User; accessToken: string }>;
};
