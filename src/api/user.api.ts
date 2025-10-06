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
  const { data } = await http.get("/user/me");
  return data as ResponseDto<{ user: User }>;
};

// Update current user profile
export const updateUserProfile = async (
  payload: UpdateProfilePayload
): Promise<ResponseDto<{ user: User }>> => {
  const { data } = await http.put("/user/me", payload);
  return data as ResponseDto<{ user: User }>;
};

// Update profile picture
export const updateProfilePicture = async (
  file: File
): Promise<ResponseDto<{ user: User; upload: any }>> => {
  // Update profile picture with file upload
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await http.post("/user/me/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data as ResponseDto<{ user: User; upload: any }>;
};
export const checkAuth = async (): Promise<
  ResponseDto<{ authenticated: boolean }>
> => {
  const { data } = await http.get("/auth/check");
  return data as ResponseDto<{ authenticated: boolean }>;
};

// Logout user
export const logoutUser = async (): Promise<ResponseDto<null>> => {
  const { data } = await http.post("/auth/logout");
  return data as ResponseDto<null>;
};

export type { User as UserType };
