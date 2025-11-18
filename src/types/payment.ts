export interface PaymentMetadata {
  type: "subscription" | "store_checkout";
  planName?: string;
  planId?: string;
  cartItemIds?: string[];
  deliveryDetails?: {
    recipientName?: string;
    contactPhone?: string;
    addressLine1?: string;
    postTown?: string;
    postcode?: string;
    deliveryInstructions?: string;
  };
  orderSummary?: {
    totalAmount: number;
    currency: string;
    itemCount: number;
  };
  orderItems?: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

export interface PaymentOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  storeItemName: string | null;
  storeItemImage: Record<string, unknown> | null;
}

export interface PaymentDetails {
  paymentId: string;
  status: "PAID" | "PENDING" | "FAILED" | "CANCELLED" | "REFUNDED";
  amount: number;
  currency: string;
  provider: "STRIPE" | "PAYPAL" | "FLUTTERWAVE";
  providerRef?: string;
  metadata: PaymentMetadata;
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
  items?: PaymentOrderItem[];
  deliveryAddress?: {
    id: string;
    recipientName: string;
    contactPhone: string;
    addressLine1: string;
    postTown: string;
    postcode: string;
    deliveryInstructions?: string | null;
  } | null;
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
