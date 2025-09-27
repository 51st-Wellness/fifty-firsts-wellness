import http from "./http";
import type { ResponseDto } from "../types/response.types";

// Cart types based on backend DTOs
export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartItem {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  storeItem?: StoreItem | null;
}

export interface StoreItem {
  id: string;
  productId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemWithRelations extends CartItem {
  product: Product & {
    storeItem?: StoreItem | null;
  };
  user: Pick<
    User,
    | "id"
    | "email"
    | "firstName"
    | "lastName"
    | "role"
    | "profilePicture"
    | "isActive"
    | "createdAt"
    | "updatedAt"
  >;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  items: CartItemWithRelations[];
}

class CartAPI {
  private baseURL = "/user/cart";

  // Add item to cart
  async addToCart(
    data: AddToCartDto
  ): Promise<ResponseDto<CartItemWithRelations>> {
    const response = await http.post<ResponseDto<CartItemWithRelations>>(
      this.baseURL,
      data
    );
    return response.data;
  }

  // Get user's cart
  async getCart(): Promise<ResponseDto<{ items: CartItemWithRelations[] }>> {
    const response = await http.get<
      ResponseDto<{ items: CartItemWithRelations[] }>
    >(`${this.baseURL}/me`);
    return response.data;
  }

  // Update cart item quantity
  async updateCartItem(
    productId: string,
    data: UpdateCartItemDto
  ): Promise<ResponseDto<CartItemWithRelations>> {
    const response = await http.patch<ResponseDto<CartItemWithRelations>>(
      `${this.baseURL}/${productId}`,
      data
    );
    return response.data;
  }

  // Remove item from cart
  async removeFromCart(productId: string): Promise<ResponseDto<CartItem>> {
    const response = await http.delete<ResponseDto<CartItem>>(
      `${this.baseURL}/${productId}`
    );
    return response.data;
  }

  // Clear entire cart
  async clearCart(): Promise<{
    message: string;
    data: { deletedCount: number };
  }> {
    const response = await http.delete<{
      message: string;
      data: { deletedCount: number };
    }>(this.baseURL);
    return response.data;
  }
}

export const cartAPI = new CartAPI();
