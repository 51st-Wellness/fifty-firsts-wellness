import httpClient from "./http";

export interface SubscriptionRequest {
  email: string;
  name?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
}

/**
 * Subscribe to newsletter
 */
export const subscribeToNewsletter = async (
  data: SubscriptionRequest
): Promise<SubscriptionResponse> => {
  const response = await httpClient.post("/subscription/newsletter", data);
  return response.data;
};

/**
 * Subscribe to waitlist
 */
export const subscribeToWaitlist = async (
  data: SubscriptionRequest
): Promise<SubscriptionResponse> => {
  const response = await httpClient.post("/subscription/waitlist", data);
  return response.data;
};

/**
 * Unsubscribe from newsletter
 */
export const unsubscribeFromNewsletter = async (
  email: string
): Promise<SubscriptionResponse> => {
  const response = await httpClient.delete(
    `/subscription/newsletter/${encodeURIComponent(email)}`
  );
  return response.data;
};

/**
 * Remove from waitlist
 */
export const removeFromWaitlist = async (
  email: string
): Promise<SubscriptionResponse> => {
  const response = await httpClient.delete(
    `/subscription/waitlist/${encodeURIComponent(email)}`
  );
  return response.data;
};
