// Store/Marketplace types based on backend schema StoreItem and related Product

export type MediaType = "image" | "video";

export type StoreItemDisplay = {
  url?: string;
  type?: MediaType;
} | null;

export type DiscountType = "NONE" | "PERCENTAGE" | "FLAT";

export type StoreItem = {
  productId: string;
  name: string;
  description?: string | null;
  productUsage?: string | null;
  productBenefits?: string | null;
  productIngredients?: string[] | null;
  price: number;
  oldPrice?: number;
  stock: number;
  display?: StoreItemDisplay;
  images?: string[];
  categories?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  discountType?: DiscountType;
  discountValue?: number;
  discountActive?: boolean;
  discountStart?: string | Date | null;
  discountEnd?: string | Date | null;
  averageRating?: number;
  reviewCount?: number;
};

export type StoreItemListParams = {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  category?: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
  hasPrev: boolean;
};

export type PaginatedStoreItems = {
  items: StoreItem[];
  pagination: PaginationMeta;
};
