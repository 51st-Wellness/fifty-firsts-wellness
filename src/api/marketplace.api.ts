// endpoints for marketplace/store items
import http from "./http";
import type {
  StoreItem,
  StoreItemListParams,
} from "../types/marketplace.types";
import type {
  PaginationResponseDto,
  ResponseDto,
} from "../types/response.types";

// Fetch list of store items (paginated)
export const fetchStoreItems = async (
  params: StoreItemListParams = {}
): Promise<PaginationResponseDto<StoreItem>> => {
  const { data } = await http.get("/product/store", { params });
  return data as PaginationResponseDto<StoreItem>;
};

// Fetch a single store item by id
export const fetchStoreItemById = async (
  id: string
): Promise<ResponseDto<StoreItem>> => {
  const { data } = await http.get(`/product/store/${id}`);
  return data as ResponseDto<StoreItem>;
};

// Preorder a product (stub endpoint to be aligned with backend)
export const preorderProduct = async (
  productId: string
): Promise<ResponseDto<{ productId: string; count: number }>> => {
  const { data } = await http.post(`/product/store/${productId}/preorder`);
  return data as ResponseDto<{ productId: string; count: number }>;
};

// Opt into back-in-stock notification
export const notifyWhenAvailable = async (
  productId: string
): Promise<ResponseDto<{ productId: string }>> => {
  const { data } = await http.post(`/product/store/${productId}/notify`);
  return data as ResponseDto<{ productId: string }>;
};

// Create a store item (Admin) - supports FormData for file uploads
export const createStoreItem = async (
  payload:
    | FormData
    | (Partial<StoreItem> & { name: string; price: number; stock: number })
): Promise<ResponseDto<StoreItem>> => {
  const config =
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const { data } = await http.post(`/product/store`, payload, config);
  return data as ResponseDto<StoreItem>;
};

// Update a store item (Admin) - supports FormData for file uploads
export const updateStoreItem = async (
  id: string,
  payload: FormData | Partial<StoreItem>
): Promise<ResponseDto<StoreItem>> => {
  const config =
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const { data } = await http.put(`/product/store/${id}`, payload, config);
  return data as ResponseDto<StoreItem>;
};

// Delete a store item (Admin)
export const deleteStoreItem = async (
  id: string
): Promise<ResponseDto<{ id: string }>> => {
  const { data } = await http.delete(`/product/store/${id}`);
  return data as ResponseDto<{ id: string }>;
};
export type { StoreItem };
