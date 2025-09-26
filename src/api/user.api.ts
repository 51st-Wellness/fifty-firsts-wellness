import http from "./http";
import type { ResponseDto } from "../types/response.types";
import type { User } from "../types/user.types";

// Update profile payload type (for internal use)
type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  address?: string;
  bio?: string;
};

// Get current user profile
export const getUserProfile = async (): Promise<
  ResponseDto<{ user: User }>
> => {
  const client = http();
  const { data } = await client.get("/user/me");
  return data as ResponseDto<{ user: User }>;
};

// Update current user profile
export const updateUserProfile = async (
  payload: UpdateProfilePayload
): Promise<ResponseDto<{ user: User }>> => {
  const client = http();
  const { data } = await client.put("/user/me", payload);
  return data as ResponseDto<{ user: User }>;
};

// Update profile picture
export const updateProfilePicture = async (
  file: File
): Promise<ResponseDto<{ user: User; upload: any }>> => {
  const client = http();
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await client.post("/user/me/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data as ResponseDto<{ user: User; upload: any }>;
};

// Check authentication status
export const checkAuth = async (): Promise<
  ResponseDto<{ authenticated: boolean }>
> => {
  const client = http();
  const { data } = await client.get("/auth/check");
  return data as ResponseDto<{ authenticated: boolean }>;
};

// Logout user
export const logoutUser = async (): Promise<ResponseDto<null>> => {
  const client = http();
  const { data } = await client.post("/auth/logout");
  return data as ResponseDto<null>;
};

export type { User as UserType };
