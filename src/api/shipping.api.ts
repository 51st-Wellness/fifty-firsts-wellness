import http from "./http";
import type { ResponseDto } from "../types/response.types";

// Weight band configuration
export interface WeightBand {
  maxWeight: number; // in grams
  price: number; // in GBP
}

// Shipping service configuration
export interface ShippingServiceConfig {
  label: string;
  serviceCode: string; // Account-specific Royal Mail service code
  bands: WeightBand[];
  description?: string;
}

// Shipping add-on configuration
export interface ShippingAddOn {
  label: string;
  price: number;
  description?: string;
}

// Complete shipping rates configuration
export interface ShippingRatesConfig {
  services: Record<string, ShippingServiceConfig>;
  addOns?: Record<string, ShippingAddOn>;
  defaultService: string; // Key to services (e.g., 'ROYAL_MAIL_48')
}

class ShippingAPI {
  // Get shipping rates configuration (admin only)
  async getShippingRates(): Promise<ResponseDto<ShippingRatesConfig>> {
    const { data } = await http.get<ResponseDto<ShippingRatesConfig>>(
      "/shipping/rates"
    );
    return data;
  }

  // Update shipping rates configuration (admin only)
  async updateShippingRates(
    config: ShippingRatesConfig
  ): Promise<ResponseDto<{ message: string }>> {
    const { data } = await http.put<ResponseDto<{ message: string }>>(
      "/shipping/rates",
      config
    );
    return data;
  }
}

export const shippingAPI = new ShippingAPI();

