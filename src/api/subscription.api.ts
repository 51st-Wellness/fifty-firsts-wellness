import http from "./http";
import { ResponseStatus, type ResponseDto } from "../types/response.types";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subscriptionAccess: Array<{
    id: string;
    planId: string;
    accessItem: string;
  }>;
  _count?: {
    subscriptions: number;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentId?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  plan?: SubscriptionPlan;
  payment?: any;
}

export interface CheckoutResponse {
  paymentId: string;
  subscriptionId: string;
  approvalUrl: string;
  amount: number;
  currency: string;
  planName: string;
}

// Admin subscription data interface
export interface AdminSubscriptionData {
  id: string;
  userId: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentId: string;
  providerSubscriptionId: string;
  invoiceId: string;
  billingCycle: number;
  createdAt: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPhone: string;
  userCity: string;
  planName: string;
  planPrice: number;
  planDuration: number;
  planDescription: string;
}

// Pagination interface
export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Admin subscriptions response
export interface AdminSubscriptionsResponse {
  subscriptions: AdminSubscriptionData[];
  pagination: PaginationData;
}

// Get all subscription plans
export const getSubscriptionPlans = async (): Promise<
  SubscriptionPlan[] | undefined
> => {
  const { data } = await http.get<ResponseDto<SubscriptionPlan[]>>(
    "/payment/subscriptions/plans"
  );

  return data.data;
};

// Get user's active subscription
export const getUserActiveSubscription = async (): Promise<{
  success: boolean;
  data: Subscription | null;
  message?: string;
}> => {
  try {
    const { data } = await http.get<ResponseDto<Subscription | null>>(
      "/payment/subscriptions/user/active"
    );

    return {
      success: data.status === ResponseStatus.SUCCESS,
      data: data.data || null,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Failed to fetch active subscription",
    };
  }
};

// Create subscription checkout
export const createSubscriptionCheckout = async (
  planId: string
): Promise<{
  success: boolean;
  data?: CheckoutResponse;
  message?: string;
}> => {
  try {
    const { data } = await http.post<ResponseDto<CheckoutResponse>>(
      "/payment/checkout/subscription",
      { planId }
    );

    return {
      success: data.status === ResponseStatus.SUCCESS,
      data: data.data,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create checkout",
    };
  }
};

// Get payment status
export const getPaymentStatus = async (
  paymentId: string
): Promise<ResponseDto<any>> => {
  const { data } = await http.get<ResponseDto<any>>(
    `/payment/status/${paymentId}`
  );
  return data;
};

// Get user's subscription history
export const getUserSubscriptions = async (): Promise<{
  success: boolean;
  data: Subscription[];
  message?: string;
}> => {
  try {
    const { data } = await http.get<ResponseDto<Subscription[]>>(
      "/payment/subscriptions/user"
    );

    return {
      success: data.status === ResponseStatus.SUCCESS,
      data: data.data || [],
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message || "Failed to fetch subscription history",
    };
  }
};

// Get admin subscriptions with pagination and filters
export const getAdminSubscriptions = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<{
  success: boolean;
  data?: AdminSubscriptionsResponse;
  message?: string;
}> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);

    const { data } = await http.get<ResponseDto<AdminSubscriptionsResponse>>(
      `/payment/admin/subscriptions?${queryParams.toString()}`
    );

    return {
      success: data.status === ResponseStatus.SUCCESS,
      data: data.data,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch admin subscriptions",
    };
  }
};
