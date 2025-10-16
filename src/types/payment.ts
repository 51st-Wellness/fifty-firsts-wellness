export interface PaymentDetails {
  paymentId: string;
  status: "PAID" | "PENDING" | "FAILED" | "CANCELLED" | "REFUNDED";
  amount: number;
  currency: string;
  provider: "STRIPE" | "PAYPAL" | "FLUTTERWAVE";
  providerRef?: string;
  metadata: {
    type: "subscription" | "store_checkout";
    planName?: string;
    planId?: string;
    cartItemIds?: string[];
  };
  orders?: PaymentOrder[];
  subscriptions?: PaymentSubscription[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  status: "PAID" | "PENDING" | "FAILED" | "CANCELLED" | "REFUNDED";
  totalAmount: number;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSubscription {
  id: string;
  userId: string;
  planId: string;
  status: "PAID" | "PENDING" | "FAILED" | "CANCELLED" | "REFUNDED";
  startDate: string;
  endDate: string;
  paymentId: string;
  planName?: string;
  planPrice?: number;
  planDuration?: number;
}

export interface PaymentStatusResponse {
  success: boolean;
  message: string;
  data: PaymentDetails;
}
