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

// Admin/Moderator: Get all users with pagination and filters
export const getAllUsers = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}): Promise<
  ResponseDto<{
    items: User[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasMore: boolean;
      hasPrev: boolean;
    };
  }>
> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.role) queryParams.append("role", params.role);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());

  const { data } = await http.get(`/user?${queryParams.toString()}`);
  return data as ResponseDto<{
    items: User[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasMore: boolean;
      hasPrev: boolean;
    };
  }>;
};

// Admin/Moderator: Get user by ID
export const getUserById = async (
  id: string
): Promise<ResponseDto<{ user: User }>> => {
  const { data } = await http.get(`/user/${id}`);
  return data as ResponseDto<{ user: User }>;
};

// Admin only: Toggle user active/inactive status
export const toggleUserStatus = async (
  id: string,
  isActive: boolean
): Promise<ResponseDto<{ user: User }>> => {
  const { data } = await http.put(`/user/${id}/status`, { isActive });
  return data as ResponseDto<{ user: User }>;
};

// Admin only: Change user role
export const changeUserRole = async (
  id: string,
  role: "USER" | "ADMIN" | "MODERATOR"
): Promise<ResponseDto<{ user: User }>> => {
  const { data } = await http.put(`/user/role/${id}`, { role });
  return data as ResponseDto<{ user: User }>;
};

export type { User };
