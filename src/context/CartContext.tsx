import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  cartAPI,
  CartItemWithRelations,
  AddToCartDto,
  UpdateCartItemDto,
} from "../api/cart.api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContextProvider";
import { getStoreItemPricing } from "../utils/discounts";
import { useGlobalDiscount } from "./GlobalDiscountContext";

// Cart state interface
interface CartState {
  items: CartItemWithRelations[];
  isLoading: boolean;
  error: string | null;
  isCartOpen: boolean;
}

// Cart actions
type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ITEMS"; payload: CartItemWithRelations[] }
  | { type: "ADD_ITEM"; payload: CartItemWithRelations }
  | { type: "UPDATE_ITEM"; payload: CartItemWithRelations }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean };

// Cart context interface
interface CartContextType {
  // State
  items: CartItemWithRelations[];
  isLoading: boolean;
  error: string | null;
  isCartOpen: boolean;

  // Computed values
  totalItems: number;
  totalPrice: number;

  // Actions
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

// Initial state
const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
  isCartOpen: false,
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_ITEMS":
      return { ...state, items: action.payload };

    case "ADD_ITEM":
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = action.payload;
        return { ...state, items: updatedItems };
      } else {
        // Add new item
        return { ...state, items: [...state.items, action.payload] };
      }

    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId ? action.payload : item
        ),
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isCartOpen: !state.isCartOpen };

    case "SET_CART_OPEN":
      return { ...state, isCartOpen: action.payload };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  const { globalDiscount } = useGlobalDiscount();

  // Computed values
  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = state.items.reduce((total, item) => {
    const storeItem = item.product.storeItem;
    if (!storeItem) return total;
    const price = getStoreItemPricing(storeItem, {
      globalDiscount,
    }).currentPrice;
    return total + price * item.quantity;
  }, 0);

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      // Clear cart when user logs out
      dispatch({ type: "CLEAR_CART" });
    }
  }, [isAuthenticated, user]);

  // Refresh cart from server
  const refreshCart = async () => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const response = await cartAPI.getCart();

      if (
        (response.status === "SUCCESS" || response.status === "success") &&
        response.data
      ) {
        dispatch({ type: "SET_ITEMS", payload: response.data.items });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load cart";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error("Error loading cart:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Add item to cart
  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const addToCartDto: AddToCartDto = { productId, quantity };
      const response = await cartAPI.addToCart(addToCartDto);

      if (
        (response.status === "SUCCESS" || response.status === "success") &&
        response.data
      ) {
        dispatch({ type: "ADD_ITEM", payload: response.data });
        toast.success("Item added to cart");

        // Open the cart and refresh its contents to ensure consistency
        dispatch({ type: "SET_CART_OPEN", payload: true });
        await refreshCart();
      }
    } catch (error: any) {
      const backendMessage: string | undefined =
        error?.response?.data?.message ||
        (Array.isArray(error?.response?.data?.message)
          ? error.response.data.message[0]
          : undefined);

      const errorMessage =
        backendMessage ||
        "Failed to add item to cart. Please try again or adjust your cart.";

      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error("Error adding to cart:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const updateDto: UpdateCartItemDto = { quantity };
      const response = await cartAPI.updateCartItem(productId, updateDto);

      if (
        (response.status === "SUCCESS" || response.status === "success") &&
        response.data
      ) {
        dispatch({ type: "UPDATE_ITEM", payload: response.data });
        toast.success("Cart updated");

        // Refresh for consistency
        await refreshCart();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update cart item";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error("Error updating cart item:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await cartAPI.removeFromCart(productId);
      dispatch({ type: "REMOVE_ITEM", payload: productId });
      toast.success("Item removed from cart");

      // Refresh for consistency
      await refreshCart();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove item from cart";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error("Error removing from cart:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await cartAPI.clearCart();
      dispatch({ type: "CLEAR_CART" });
      toast.success("Cart cleared");

      // Refresh for consistency
      await refreshCart();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to clear cart";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error("Error clearing cart:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Cart visibility controls
  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const openCart = () => dispatch({ type: "SET_CART_OPEN", payload: true });
  const closeCart = () => dispatch({ type: "SET_CART_OPEN", payload: false });

  // Utility functions
  const getItemQuantity = (productId: string): number => {
    const item = state.items.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some((item) => item.productId === productId);
  };

  const contextValue: CartContextType = {
    // State
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    isCartOpen: state.isCartOpen,

    // Computed values
    totalItems,
    totalPrice,

    // Actions
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    toggleCart,
    openCart,
    closeCart,
    getItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
