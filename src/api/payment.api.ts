import http from "./http";
import type { ResponseDto } from "../types/response.types";
import type { DiscountType } from "../types/marketplace.types";
import type { PaymentStatusResponse } from "../types/payment";

export interface CartCheckoutPayload {
  deliveryAddressId?: string; // Use existing address
  // Custom address fields (used when creating new address)
  recipientName?: string;
  contactPhone?: string;
  addressLine1?: string;
  postTown?: string;
  postcode?: string;
  deliveryInstructions?: string;
  saveAddress?: boolean; // Whether to save the custom address
}

export interface CartCheckoutSummaryItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  baseUnitPrice?: number;
  lineTotal: number;
  baseLineTotal?: number;
  isPreOrder?: boolean;
  preOrderFulfillmentDate?: string;
  preOrderDepositRequired?: boolean;
  preOrderDepositAmount?: number;
  discount?: {
    isActive: boolean;
    type: DiscountType;
    value: number;
    amountPerUnit: number;
    totalAmount: number;
  };
  image?: { url: string; type: string };
}

export interface CartCheckoutDeliveryDefaults {
  recipientName?: string;
  contactPhone?: string;
  addressLine1?: string;
  postTown?: string;
  postcode?: string;
}

export interface CartCheckoutSummary {
  orderItems: CartCheckoutSummaryItem[];
  totalAmount: number;
  currency: string;
  itemCount: number;
  summary: {
    subtotal: number;
    currency: string;
    itemCount: number;
    totalQuantity: number;
    subtotalBeforeDiscounts?: number;
    productDiscountTotal?: number;
    globalDiscountTotal?: number;
    discountTotal?: number;
  };
  deliveryDefaults?: CartCheckoutDeliveryDefaults;
  pricing?: {
    currency: string;
    baseSubtotal: number;
    subtotalAfterProductDiscounts: number;
    productDiscountTotal: number;
    globalDiscountTotal: number;
    totalDiscount: number;
    grandTotal: number;
  };
  discounts?: {
    productDiscountTotal: number;
    globalDiscount: {
      isActive: boolean;
      type: DiscountType;
      value: number;
      minOrderTotal?: number;
      label?: string;
      applied?: boolean;
      amountApplied?: number;
    };
    totalDiscount: number;
  };
  globalDiscount?: {
    isActive: boolean;
    type: DiscountType;
    value: number;
    minOrderTotal?: number;
    label?: string;
    applied?: boolean;
    amountApplied?: number;
  };
  deliveryAddresses?: Array<{
    id: string;
    recipientName: string;
    contactPhone: string;
    addressLine1: string;
    postTown: string;
    postcode: string;
    deliveryInstructions?: string | null;
    isDefault: boolean;
  }>;
}

export interface CartCheckoutResult {
  paymentId: string;
  orderId: string;
  approvalUrl?: string;
  amount: number;
  currency: string;
  deliveryAddress?: {
    id: string;
    recipientName: string;
    contactPhone: string;
    addressLine1: string;
    postTown: string;
    postcode: string;
    deliveryInstructions?: string | null;
  };
}

class PaymentAPI {
  // Fetch checkout summary plus default delivery information
  async getCartCheckoutSummary(): Promise<ResponseDto<CartCheckoutSummary>> {
    const response = await http.get<ResponseDto<CartCheckoutSummary>>(
      "/payment/checkout/cart/summary"
    );
    return response.data;
  }

  // Initialize checkout for cart items and receive provider approval URL
  async checkoutCart(
    payload: CartCheckoutPayload
  ): Promise<ResponseDto<CartCheckoutResult>> {
    const response = await http.post<ResponseDto<CartCheckoutResult>>(
      "/payment/checkout/cart",
      payload
    );
    return response.data;
  }

  // Retrieve payment status details by ID
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await http.get<PaymentStatusResponse>(
      `/payment/status/${paymentId}`
    );
    return response.data;
  }
}

export const paymentAPI = new PaymentAPI();
