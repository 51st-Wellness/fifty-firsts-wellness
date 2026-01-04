import http from "./http";
import type { ResponseDto } from "../types/response.types";
import type { User, StoreItem } from "../types";

export type CartType = "standard" | "preorder";

// Cart-specific DTOs
export interface AddToCartDto {
  productId: string;
  quantity: number;
  cartType?: CartType;
}

export interface UpdateCartItemDto {
  quantity: number;
}

// Cart item from backend
export interface CartItem {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
}

// This represents the structure of the 'product' object inside a cart item
export interface ProductInCart {
  id: string;
  type: string;
  pricingModel: string;
  createdAt: string;
  updatedAt: string;
  storeItem: StoreItem | null;
}

// Cart item with full relations from backend
export interface CartItemWithRelations extends CartItem {
  product: ProductInCart;
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
  async getCart(cartType?: CartType): Promise<ResponseDto<{ items: CartItemWithRelations[] }>> {
    const response = await http.get<
      ResponseDto<{ items: CartItemWithRelations[] }>
    >(`${this.baseURL}/me`, { params: { cartType } });
    return response.data;
  }

  // Update cart item quantity
  async updateCartItem(
    productId: string,
    data: UpdateCartItemDto,
    cartType?: CartType
  ): Promise<ResponseDto<CartItemWithRelations>> {
    const response = await http.patch<ResponseDto<CartItemWithRelations>>(
      `${this.baseURL}/${productId}`,
      data,
      { params: { cartType } }
    );
    return response.data;
  }

  // Remove item from cart
  async removeFromCart(productId: string, cartType?: CartType): Promise<ResponseDto<CartItem>> {
    const response = await http.delete<ResponseDto<CartItem>>(
      `${this.baseURL}/${productId}`,
      { params: { cartType } }
    );
    return response.data;
  }

  // Clear entire cart
  async clearCart(cartType?: CartType): Promise<ResponseDto<{ deletedCount: number }>> {
    const response = await http.delete<ResponseDto<{ deletedCount: number }>>(
      `${this.baseURL}/clear`,
      { params: { cartType } }
    );
    return response.data;
  }
}

export const cartAPI = new CartAPI();

