import http from "./http";
import type { ResponseDto } from "../types/response.types";
import type { PaymentStatusResponse } from "../types/payment";

export interface CartCheckoutPayload {
  contactName?: string;
  contactPhone?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryInstructions?: string;
}

export interface CartCheckoutSummaryItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image?: { url: string; type: string };
}

export interface CartCheckoutDeliveryDefaults {
  contactName?: string;
  contactPhone?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
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
  };
  deliveryDefaults: CartCheckoutDeliveryDefaults;
}

export interface CartCheckoutResult {
  paymentId: string;
  orderId: string;
  approvalUrl?: string;
  amount: number;
  currency: string;
  deliveryDetails: {
    contactName?: string;
    contactPhone?: string;
    deliveryAddress?: string;
    deliveryCity?: string;
    deliveryInstructions?: string;
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
