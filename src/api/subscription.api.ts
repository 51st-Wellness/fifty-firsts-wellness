import http from "./http";
import type { ResponseDto } from "../types/response.types";

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

// Get all subscription plans
export const getSubscriptionPlans = async (): Promise<
  SubscriptionPlan[] | undefined
> => {
  const { data } = await http.get<ResponseDto<SubscriptionPlan[]>>(
    "/payment/subscriptions/plans"
  );

  return data.data;

  throw new Error(data.message || "Failed to fetch subscription plans");
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
      success: data.status === "SUCCESS" || data.status === "success",
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
      success: data.status === "SUCCESS" || data.status === "success",
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
      success: data.status === "SUCCESS" || data.status === "success",
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
