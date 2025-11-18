import http from "./http";
import type { ResponseDto } from "../types/response.types";
import type { DiscountType } from "../types/marketplace.types";

export interface GlobalDiscountSetting {
  isActive: boolean;
  type: DiscountType;
  value: number;
  minOrderTotal?: number;
  label?: string;
  applied?: boolean;
  amountApplied?: number;
}

export interface UpdateGlobalDiscountPayload {
  isActive: boolean;
  type: DiscountType;
  value: number;
  minOrderTotal?: number;
  label?: string;
}

class SettingsAPI {
  async getGlobalDiscount(): Promise<ResponseDto<GlobalDiscountSetting>> {
    const { data } = await http.get<ResponseDto<GlobalDiscountSetting>>(
      "/settings/global-discount"
    );
    return data;
  }

  async updateGlobalDiscount(
    payload: UpdateGlobalDiscountPayload
  ): Promise<ResponseDto<GlobalDiscountSetting>> {
    const { data } = await http.put<ResponseDto<GlobalDiscountSetting>>(
      "/settings/global-discount",
      payload
    );
    return data;
  }
}

export const settingsAPI = new SettingsAPI();
