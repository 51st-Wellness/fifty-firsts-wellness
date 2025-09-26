// endpoints for marketplace/store items
import http from "./http";
import type {
  PaginatedStoreItems,
  StoreItem,
  StoreItemListParams,
} from "../types/marketplace.types";

// Fetch list of store items (paginated)
export const fetchStoreItems = async (
  params: StoreItemListParams = {}
): Promise<PaginatedStoreItems> => {
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
export const fetchStoreItemById = async (id: string): Promise<StoreItem> => {
  const client = http(); // create axios client
  const { data } = await client.get(`/product/store/${id}`);
  return data?.data;
};

// Create a store item (Admin)
export const createStoreItem = async (
  payload: Partial<StoreItem> & { name: string; price: number; stock: number }
): Promise<StoreItem> => {
  const client = http();
  const { data } = await client.post(`/product/store`, payload);
  return data?.data;
};

// Update a store item (Admin)
export const updateStoreItem = async (
  id: string,
  payload: Partial<StoreItem>
): Promise<StoreItem> => {
  const client = http();
  const { data } = await client.put(`/product/store/${id}`);
  return data?.data;
};

// Delete a store item (Admin)
export const deleteStoreItem = async (
  id: string
): Promise<{ success: boolean }> => {
  const client = http();
  const { data } = await client.delete(`/product/store/${id}`);
  return { success: Boolean(data) };
};
export type { StoreItem };
