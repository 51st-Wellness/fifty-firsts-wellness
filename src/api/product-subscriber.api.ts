import httpClient from "./http";
import { ResponseDto } from "@/types/response.types";

export interface ProductSubscriber {
  id: string;
  userId: string;
  productId: string;
  status: "PENDING" | "NOTIFIED";
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  product?: {
    id: string;
    name: string;
    display?: any;
  };
}

export interface ProductSubscriberQuery {
  productId?: string;
  userId?: string;
  status?: "PENDING" | "NOTIFIED";
  page?: number;
  limit?: number;
}

export interface BulkEmailDto {
  productId: string;
  subject: string;
  message: string;
}

export interface SingleEmailDto {
  subscriberId: string;
  subject: string;
  message: string;
}

// Subscribe to product notifications
export const subscribeToProduct = async (
  productId: string
): Promise<ResponseDto<ProductSubscriber>> => {
  const response = await httpClient.post("/product/store/subscribe", {
    productId,
  });
  return response.data;
};

// Unsubscribe from product notifications
export const unsubscribeFromProduct = async (
  productId: string
): Promise<ResponseDto<null>> => {
  const response = await httpClient.delete(
    `/product/store/subscribe/${productId}`
  );
  return response.data;
};

// Check subscription status
export const checkSubscription = async (
  productId: string
): Promise<
  ResponseDto<{ isSubscribed: boolean; subscription: ProductSubscriber | null }>
> => {
  const response = await httpClient.get(
    `/product/store/subscribe/check/${productId}`
  );
  return response.data;
};

// Get all subscribers (Admin only)
export const getAllSubscribers = async (
  query: ProductSubscriberQuery = {}
): Promise<
  ResponseDto<{
    items: ProductSubscriber[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasMore: boolean;
    };
  }>
> => {
  const params = new URLSearchParams();
  if (query.productId) params.append("productId", query.productId);
  if (query.userId) params.append("userId", query.userId);
  if (query.status) params.append("status", query.status);
  if (query.page) params.append("page", query.page.toString());
  if (query.limit) params.append("limit", query.limit.toString());

  const response = await httpClient.get(
    `/product/store/subscribers/all?${params.toString()}`
  );
  return response.data;
};

// Get single subscriber (Admin only)
export const getSubscriber = async (
  id: string
): Promise<ResponseDto<ProductSubscriber>> => {
  const response = await httpClient.get(`/product/store/subscribers/${id}`);
  return response.data;
};

// Update subscriber (Admin only)
export const updateSubscriber = async (
  id: string,
  data: { status?: "PENDING" | "NOTIFIED" }
): Promise<ResponseDto<ProductSubscriber>> => {
  const response = await httpClient.put(
    `/product/store/subscribers/${id}`,
    data
  );
  return response.data;
};

// Delete subscriber (Admin only)
export const deleteSubscriber = async (
  id: string
): Promise<ResponseDto<null>> => {
  const response = await httpClient.delete(`/product/store/subscribers/${id}`);
  return response.data;
};

// Send bulk email to product subscribers (Admin only)
export const sendBulkEmail = async (
  data: BulkEmailDto
): Promise<ResponseDto<{ totalSent: number; productName: string }>> => {
  const response = await httpClient.post(
    "/product/store/subscribers/bulk-email",
    data
  );
  return response.data;
};

// Send email to single subscriber (Admin only)
export const sendSingleEmail = async (
  data: SingleEmailDto
): Promise<ResponseDto<{ email: string; productName: string }>> => {
  const response = await httpClient.post(
    "/product/store/subscribers/single-email",
    data
  );
  return response.data;
};

// Search store items (minimal data for select)
export const searchStoreItems = async (
  query: string,
  limit: number = 10
): Promise<
  ResponseDto<
    Array<{
      value: string;
      label: string;
      display?: any;
      stock?: number;
      preOrderEnabled?: boolean;
    }>
  >
> => {
  const response = await httpClient.get(
    `/product/store/search/minimal?q=${encodeURIComponent(
      query
    )}&limit=${limit}`
  );
  return response.data;
};
