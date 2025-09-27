import http from "./http";
import type { ResponseDto } from "../types/response.types";
import { User } from "@/types";

// Login
export const login = async (payload: {
  email: string;
  password: string;
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
