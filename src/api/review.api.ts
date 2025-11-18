// Review API endpoints
import http from "./http";
import type {
  Review,
  ReviewSummary,
  ProductReviewResponse,
  ReviewQueryParams,
  AdminReviewQueryParams,
  AdminReviewResponse,
} from "../types/review.types";
import type {
  ResponseDto,
  PaginationResponseDto,
} from "../types/response.types";

// Create a review for a product (from order item)
export const createReview = async (
  productId: string,
  orderItemId: string,
  payload: { rating: number; comment: string }
): Promise<ResponseDto<Review>> => {
  const { data } = await http.post(`/review/product/${productId}`, {
    ...payload,
    orderItemId,
  });
  return data as ResponseDto<Review>;
};

// Get reviews for a specific product (public - only approved reviews)
export const getProductReviews = async (
  productId: string,
  params?: ReviewQueryParams
): Promise<ProductReviewResponse> => {
  const { data } = await http.get(`/review/product/${productId}`, { params });
  return data as ProductReviewResponse;
};

// Get review summary (average rating, count) for a product
export const getProductReviewSummary = async (
  productId: string
): Promise<ResponseDto<ReviewSummary>> => {
  const { data } = await http.get(`/review/product/${productId}/summary`);
  return data as ResponseDto<ReviewSummary>;
};

// Get review summaries for multiple products (for marketplace cards)
export const getProductReviewSummaries = async (
  productIds: string[]
): Promise<ResponseDto<Record<string, ReviewSummary>>> => {
  const { data } = await http.post("/review/products/summaries", {
    productIds,
  });
  return data as ResponseDto<Record<string, ReviewSummary>>;
};

// Check if user has already reviewed a product from an order item
export const checkUserReviewForOrderItem = async (
  orderItemId: string
): Promise<ResponseDto<{ hasReviewed: boolean; reviewId?: string }>> => {
  const { data } = await http.get(`/review/order-item/${orderItemId}/check`);
  return data as ResponseDto<{ hasReviewed: boolean; reviewId?: string }>;
};

// Admin: Get all reviews with filters
export const getAdminReviews = async (
  params?: AdminReviewQueryParams
): Promise<AdminReviewResponse> => {
  const { data } = await http.get("/admin/review", { params });
  return data as AdminReviewResponse;
};

// Admin: Update review status (approve/reject)
export const updateReviewStatus = async (
  reviewId: string,
  status: "APPROVED" | "REJECTED"
): Promise<ResponseDto<Review>> => {
  const { data } = await http.put(`/admin/review/${reviewId}/status`, {
    status,
  });
  return data as ResponseDto<Review>;
};

// Admin: Delete a review
export const deleteReview = async (
  reviewId: string
): Promise<ResponseDto<{ id: string }>> => {
  const { data } = await http.delete(`/admin/review/${reviewId}`);
  return data as ResponseDto<{ id: string }>;
};
