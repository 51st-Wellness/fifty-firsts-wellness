import http from "./http";
import type { ResponseDto } from "../types/response.types";
import type { User } from "../types/user.types";

// Update profile payload type (for internal use)
type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
};

// Delivery Address types
export type CreateDeliveryAddressPayload = {
  recipientName: string;
  contactPhone: string;
  addressLine1: string;
  postTown: string;
  postcode: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
};

export type UpdateDeliveryAddressPayload = {
  recipientName?: string;
  contactPhone?: string;
  addressLine1?: string;
  postTown?: string;
  postcode?: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
};

export type DeliveryAddress = {
  id: string;
  userId: string;
  recipientName: string;
  contactPhone: string;
  addressLine1: string;
  postTown: string;
  postcode: string;
  deliveryInstructions?: string | null;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
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
  const { data } = await http.put<ResponseDto<{ user: User }>>(
    `/user/${id}/status`,
    { isActive }
  );
  return data;
};

// Admin only: Change user role
export const changeUserRole = async (
  id: string,
  role: "USER" | "ADMIN" | "MODERATOR"
): Promise<ResponseDto<{ user: User }>> => {
  const { data } = await http.put<ResponseDto<{ user: User }>>(
    `/user/role/${id}`,
    { role }
  );
  return data as ResponseDto<{ user: User }>;
};

// Admin only: Delete user
export const deleteUser = async (
  id: string
): Promise<ResponseDto<null>> => {
  const { data } = await http.delete(`/user/${id}`);
  return data as ResponseDto<null>;
};

// Delivery Address CRUD operations

// Get all delivery addresses for current user
export const getDeliveryAddresses = async (): Promise<
  ResponseDto<{ addresses: DeliveryAddress[] }>
> => {
  const { data } = await http.get<
    ResponseDto<{ addresses: DeliveryAddress[] }>
  >(`/user/me/delivery-addresses`);
  return data;
};

// Get a single delivery address
export const getDeliveryAddress = async (
  id: string
): Promise<ResponseDto<{ address: DeliveryAddress }>> => {
  const { data } = await http.get(`/user/me/delivery-addresses/${id}`);
  return data as ResponseDto<{ address: DeliveryAddress }>;
};

// Create a new delivery address
export const createDeliveryAddress = async (
  payload: CreateDeliveryAddressPayload
): Promise<ResponseDto<{ address: DeliveryAddress }>> => {
  const { data } = await http.post("/user/me/delivery-addresses", payload);
  return data as ResponseDto<{ address: DeliveryAddress }>;
};

// Update a delivery address
export const updateDeliveryAddress = async (
  id: string,
  payload: UpdateDeliveryAddressPayload
): Promise<ResponseDto<{ address: DeliveryAddress }>> => {
  const { data } = await http.put(`/user/me/delivery-addresses/${id}`, payload);
  return data as ResponseDto<{ address: DeliveryAddress }>;
};

// Delete a delivery address (soft delete)
export const deleteDeliveryAddress = async (
  id: string
): Promise<ResponseDto<null>> => {
  const { data } = await http.delete(`/user/me/delivery-addresses/${id}`);
  return data as ResponseDto<null>;
};

// Order types
export type OrderItemDetail = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  hasReviewed?: boolean; // Added for review status
  product?: {
    id: string;
    type: string;
    pricingModel: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    storeItem?: {
      productId: string;
      name: string;
      description?: string | null;
      price: number;
      stock: number;
      display: { url: string; type: string };
      images: string[];
      categories: string[];
      isFeatured: boolean;
      isPublished: boolean;
      createdAt: string | Date;
      updatedAt: string | Date;
    } | null;
  } | null;
};

export type OrderSummary = {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  paymentId?: string | null;
  deliveryAddressId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  itemCount: number;
  totalQuantity: number;
  paymentStatus?: string | null;
  paymentProvider?: string | null;
  paymentCurrency?: string | null;
  // Click & Drop fields
  clickDropOrderIdentifier?: number | null;
  trackingReference?: string | null;
  packageFormatIdentifier?: string | null;
  serviceCode?: string | null;
  shippingCost?: number | null;
  parcelWeight?: number | null;
  labelBase64?: string | null;
};

export type OrderDetail = OrderSummary & {
  orderItems: OrderItemDetail[];
  deliveryAddress?: {
    id: string;
    userId: string;
    recipientName: string;
    contactPhone: string;
    addressLine1: string;
    postTown: string;
    postcode: string;
    deliveryInstructions?: string | null;
    isDefault: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt?: string | Date | null;
  } | null;
  payment?: {
    id: string;
    provider: string;
    providerRef?: string | null;
    status: string;
    currency: string;
    amount: number;
    metadata?: {
      type?: string;
      receiptUrl?: string;
      [key: string]: any;
    } | null;
    createdAt: string | Date;
    updatedAt: string | Date;
  } | null;
};

// Get all orders for current user
export const getMyOrders = async (): Promise<
  ResponseDto<{ orders: OrderSummary[] }>
> => {
  const { data } = await http.get<ResponseDto<{ orders: OrderSummary[] }>>(
    `/user/orders/me`
  );
  return data;
};

// Get a single order by ID for current user
export const getMyOrder = async (
  id: string
): Promise<ResponseDto<{ order: OrderDetail }>> => {
  const { data } = await http.get<ResponseDto<{ order: OrderDetail }>>(
    `/user/orders/me/${id}`
  );
  return data;
};

// Verify payment status for an order
export const verifyOrderPayment = async (
  orderId: string
): Promise<
  ResponseDto<{ updated: boolean; status: string; message: string }>
> => {
  const { data } = await http.post<
    ResponseDto<{
      updated: boolean;
      status: string;
      message: string;
    }>
  >(`/user/orders/me/${orderId}/verify-payment`);
  return data;
};

// Test: Submit order to Click & Drop
export const submitOrderToClickDrop = async (
  orderId: string
): Promise<ResponseDto<{ message: string }>> => {
  const { data } = await http.post<ResponseDto<{ message: string }>>(
    `/user/orders/me/${orderId}/submit-to-clickdrop`
  );
  return data;
};

// Admin order types
export type AdminOrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "PACKAGING"
  | "IN_TRANSIT"
  | "FULFILLED";

export type AdminOrderCustomer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone?: string | null;
};

export type AdminOrderListItem = OrderSummary & {
  customer: AdminOrderCustomer;
  paymentAmount?: number | null;
  items: {
    productId: string;
    name: string | null;
    quantity: number;
  }[];
};

export type AdminOrderDetail = OrderDetail & {
  customer: AdminOrderCustomer;
};

// Admin: Get all orders
export const getAdminOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: AdminOrderStatus;
  search?: string;
}): Promise<
  ResponseDto<{
    orders: AdminOrderListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>
> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.search) queryParams.append("search", params.search);

  const { data } = await http.get<
    ResponseDto<{
      orders: AdminOrderListItem[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>
  >(`/user/orders/admin?${queryParams.toString()}`);
  return data;
};

// Admin: Get single order
export const getAdminOrder = async (
  orderId: string
): Promise<ResponseDto<{ order: AdminOrderDetail }>> => {
  const { data } = await http.get<ResponseDto<{ order: AdminOrderDetail }>>(
    `/user/orders/admin/${orderId}`
  );
  return data;
};

// Admin: Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: AdminOrderStatus
): Promise<ResponseDto<{ order: AdminOrderDetail }>> => {
  const { data } = await http.put<ResponseDto<{ order: AdminOrderDetail }>>(
    `/user/orders/admin/${orderId}/status`,
    {
      status,
    }
  );
  return data;
};

// Admin: Get pre-orders
export const getPreOrders = async (params?: {
  page?: number;
  limit?: number;
  preOrderStatus?: string;
  search?: string;
}): Promise<
  ResponseDto<{
    orders: AdminOrderListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>
> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.preOrderStatus)
    queryParams.append("preOrderStatus", params.preOrderStatus);
  if (params?.search) queryParams.append("search", params.search);

  const { data } = await http.get<
    ResponseDto<{
      orders: AdminOrderListItem[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>
  >(`/user/orders/admin/pre-orders?${queryParams.toString()}`);
  return data;
};

// Admin: Send bulk email to pre-orders
export const sendBulkEmailToPreOrders = async (data: {
  productId: string;
  subject: string;
  message: string;
  preOrderStatus?: string;
}): Promise<
  ResponseDto<{
    totalSent: number;
    totalPreOrders: number;
    productName: string;
  }>
> => {
  const response = await http.post(
    "/user/orders/admin/pre-orders/bulk-email",
    data
  );
  return response.data;
};

export type { User };
