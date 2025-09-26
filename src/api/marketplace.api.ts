// endpoints for marketplace/store items
import http from "./http";

// Fetch list of store items (paginated)
export const fetchStoreItems = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    isFeatured?: boolean;
    isPublished?: boolean;
  } = {}
) => {
  const client = http(); // create axios client
  const { data } = await client.get("/product/store", { params });
  // Backend wraps in ResponseDto; extract items & pagination if present
  const payload = data?.data ?? {};
  // normalize backend pagination contract
  const items = payload?.data ?? payload?.items ?? [];
  const meta = payload?.meta ?? payload?.pagination ?? {};
  return {
    items,
    pagination: {
      total: meta.total ?? 0,
      page: meta.page ?? params.page ?? 1,
      pageSize: meta.pageSize ?? meta.limit ?? params.limit ?? 12,
      totalPages: meta.totalPages ?? 0,
      hasMore: Boolean(
        meta.hasMore ?? (meta.page ?? 1) < (meta.totalPages ?? 0)
      ),
      hasPrev: Boolean((meta.page ?? 1) > 1),
    },
  };
};

// Fetch a single store item by id
export const fetchStoreItemById = async (id: string) => {
  const client = http(); // create axios client
  const { data } = await client.get(`/product/store/${id}`);
  return data?.data;
};

export type StoreItem = {
  productId: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  display?: { url?: string; type?: "image" | "video" } | null;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
};
