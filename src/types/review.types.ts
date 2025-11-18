export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ReviewAuthor = {
  id: string;
  name: string;
  initials: string;
  email?: string | null;
};

export type ProductReview = {
  id: string;
  productId: string;
  orderId: string;
  orderItemId: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  author: ReviewAuthor;
};

export type ReviewSummary = {
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: Record<number, number>;
};

export type AdminReview = ProductReview & {
  userId: string;
};

export type CreateReviewPayload = {
  orderItemId: string;
  rating: number;
  comment: string;
};

// API Response types
export type Review = ProductReview;

export type ReviewQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: "newest" | "oldest" | "rating_high" | "rating_low";
};

export type ProductReviewResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    reviews: ProductReview[];
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasMore: boolean;
      hasPrev: boolean;
    };
  };
};

export type AdminReviewQueryParams = {
  page?: number;
  pageSize?: number;
  status?: ReviewStatus;
  search?: string;
  productId?: string;
  userId?: string;
};

export type AdminReviewResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    reviews: AdminReview[];
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasMore: boolean;
      hasPrev: boolean;
    };
  };
};
