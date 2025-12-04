import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
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
import {
  getGuestCart,
  saveGuestCart,
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  clearGuestCart,
  getGuestCartItemQuantity,
  isInGuestCart,
  type GuestCartItem,
} from "../utils/guestCart";
import { fetchStoreItemById } from "../api/marketplace.api";
import { ResponseStatus } from "../types/response.types";

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

  // Load guest cart from localStorage and convert to CartItemWithRelations format
  const loadGuestCart = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const guestItems = getGuestCart();

      if (guestItems.length === 0) {
        dispatch({ type: "SET_ITEMS", payload: [] });
        return;
      }

      // Fetch product details for each guest cart item
      const cartItems: CartItemWithRelations[] = await Promise.all(
        guestItems.map(async (guestItem) => {
          try {
            const productResponse = await fetchStoreItemById(
              guestItem.productId
            );
            const storeItem = productResponse.data;

            if (!storeItem) {
              return null;
            }

            // Create a CartItemWithRelations-like structure for guest cart
            const cartItem: CartItemWithRelations = {
              id: `guest-${guestItem.productId}`,
              productId: guestItem.productId,
              userId: "guest",
              quantity: guestItem.quantity,
              createdAt: guestItem.addedAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product: {
                id: storeItem.productId,
                type: "STORE",
                pricingModel: "ONE_TIME",
                createdAt: storeItem.createdAt || new Date().toISOString(),
                updatedAt: storeItem.updatedAt || new Date().toISOString(),
                storeItem: storeItem,
              },
              user: {
                id: "guest",
                email: "",
                firstName: "",
                lastName: "",
                role: "USER",
                profilePicture: null,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            };
            return cartItem;
          } catch (error) {
            console.error(
              `Failed to fetch product ${guestItem.productId}:`,
              error
            );
            return null;
          }
        })
      );

      // Filter out null items (failed fetches)
      const validItems = cartItems.filter(
        (item): item is CartItemWithRelations => item !== null
      );
      dispatch({ type: "SET_ITEMS", payload: validItems });
    } catch (error) {
      console.error("Error loading guest cart:", error);
      dispatch({ type: "SET_ITEMS", payload: [] });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Sync guest cart to server when user logs in
  const syncGuestCartToServer = useCallback(async () => {
    const guestItems = getGuestCart();
    if (guestItems.length === 0) {
      clearGuestCart();
      return;
    }

    try {
      // First, fetch the current server cart to compare
      const serverCartResponse = await cartAPI.getCart();
      const serverItems = serverCartResponse.data?.items || [];

      // Create a map of server cart items for quick lookup
      const serverItemsMap = new Map(
        serverItems.map((item) => [item.productId, item.quantity])
      );

      let syncedCount = 0;

      // Process each guest cart item
      for (const guestItem of guestItems) {
        try {
          const serverQuantity = serverItemsMap.get(guestItem.productId);

          if (serverQuantity !== undefined) {
            // Item exists on server - intelligently merge quantities
            // Use max to handle cases where user modified quantity offline
            const maxQuantity = Math.max(serverQuantity, guestItem.quantity);

            // Only update if guest has more items than server
            if (guestItem.quantity > serverQuantity) {
              const quantityToAdd = guestItem.quantity - serverQuantity;

              await cartAPI.addToCart({
                productId: guestItem.productId,
                quantity: quantityToAdd,
              });
              syncedCount++;
            }
            // If server has more or equal, keep server quantity (no action needed)
          } else {
            // Item doesn't exist on server - add it
            await cartAPI.addToCart({
              productId: guestItem.productId,
              quantity: guestItem.quantity,
            });
            syncedCount++;
          }
        } catch (error) {
          console.error(
            `Failed to sync item ${guestItem.productId} to server:`,
            error
          );
          // Continue with other items even if one fails
        }
      }

      // Clear guest cart after successful sync
      clearGuestCart();

      if (syncedCount > 0) {
        toast.success("Your cart items have been saved");
      }
    } catch (error) {
      console.error("Error syncing guest cart to server:", error);
      // Don't clear guest cart if sync fails - user can try again
    }
  }, []);

  // Load cart when user logs in or load guest cart when logged out
  useEffect(() => {
    const initializeCart = async () => {
      if (isAuthenticated && user) {
        // Sync guest cart to server when user logs in (await to ensure sync completes)
        try {
          await syncGuestCartToServer();
        } catch (error) {
          console.error("Error syncing guest cart:", error);
          // Continue to refresh cart even if sync fails
        }
        // Always refresh cart from server to update UI (even if sync failed)
        await refreshCart();
      } else {
        // Load guest cart from localStorage when logged out
        await loadGuestCart();
      }
    };

    initializeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // Refresh cart from server (authenticated) or localStorage (guest)
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      // For guests, reload from localStorage
      await loadGuestCart();
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const response = await cartAPI.getCart();

      if (response.status === ResponseStatus.SUCCESS && response.data) {
        dispatch({ type: "SET_ITEMS", payload: response.data.items });

        // Sync server cart to localStorage for consistency
        const serverItems: GuestCartItem[] = response.data.items.map(
          (item) => ({
            productId: item.productId,
            quantity: item.quantity,
            addedAt: item.createdAt,
          })
        );
        saveGuestCart(serverItems);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load cart";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error("Error loading cart:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isAuthenticated, loadGuestCart]);

  // Add item to cart
  // For guests: stores in localStorage
  // For authenticated users: stores on server and syncs to localStorage
  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      if (!isAuthenticated) {
        // Guest cart: store in localStorage
        addToGuestCart(productId, quantity);

        // Fetch product details to add to state
        try {
          const productResponse = await fetchStoreItemById(productId);
          const storeItem = productResponse.data;

          if (storeItem) {
            const cartItem: CartItemWithRelations = {
              id: `guest-${productId}`,
              productId: productId,
              userId: "guest",
              quantity: getGuestCartItemQuantity(productId),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product: {
                id: storeItem.productId,
                type: "STORE",
                pricingModel: "ONE_TIME",
                createdAt: storeItem.createdAt || new Date().toISOString(),
                updatedAt: storeItem.updatedAt || new Date().toISOString(),
                storeItem: storeItem,
              },
              user: {
                id: "guest",
                email: "",
                firstName: "",
                lastName: "",
                role: "USER",
                profilePicture: null,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            };

            // Check if item already exists in state
            const existingIndex = state.items.findIndex(
              (item) => item.productId === productId
            );

            if (existingIndex >= 0) {
              dispatch({ type: "UPDATE_ITEM", payload: cartItem });
            } else {
              dispatch({ type: "ADD_ITEM", payload: cartItem });
            }

            dispatch({ type: "SET_CART_OPEN", payload: true });
          }
        } catch (error) {
          console.error("Failed to fetch product details:", error);
          toast.error("Item added to cart, but couldn't load details");
        }
      } else {
        // Authenticated: use server API
        const addToCartDto: AddToCartDto = { productId, quantity };
        const response = await cartAPI.addToCart(addToCartDto);

        if (response.status === ResponseStatus.SUCCESS && response.data) {
          // Refresh cart from server to ensure UI is in sync (this also syncs to localStorage)
          await refreshCart();

          // Open the cart after refresh completes
          dispatch({ type: "SET_CART_OPEN", payload: true });
        } else {
          const errorMessage = response.message || "Failed to add item to cart";
          dispatch({ type: "SET_ERROR", payload: errorMessage });
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      }
    } catch (error: any) {
      // Only handle errors for authenticated users (server errors)
      if (isAuthenticated) {
        const backendMessageRaw =
          error?.response?.data?.message ||
          (Array.isArray(error?.response?.data?.message)
            ? error.response.data.message[0]
            : undefined);

        const errorMessage =
          backendMessageRaw ||
          error?.message ||
          "Failed to add item to cart. Please try again.";

        dispatch({ type: "SET_ERROR", payload: errorMessage });
        toast.error(errorMessage);
        console.error("Error adding to cart:", error);
        throw error;
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      if (!isAuthenticated) {
        // Guest cart: update localStorage
        updateGuestCartItem(productId, quantity);

        // Update state
        const existingItem = state.items.find(
          (item) => item.productId === productId
        );
        if (existingItem) {
          const updatedItem: CartItemWithRelations = {
            ...existingItem,
            quantity: quantity,
            updatedAt: new Date().toISOString(),
          };
          dispatch({ type: "UPDATE_ITEM", payload: updatedItem });
        }

        if (quantity <= 0) {
          dispatch({ type: "REMOVE_ITEM", payload: productId });
        }
      } else {
        // Authenticated: use server API
        const updateDto: UpdateCartItemDto = { quantity };
        const response = await cartAPI.updateCartItem(productId, updateDto);

        if (response.status === ResponseStatus.SUCCESS && response.data) {
          dispatch({ type: "UPDATE_ITEM", payload: response.data });
          toast.success("Cart updated");

          // Sync to localStorage
          updateGuestCartItem(productId, quantity);

          // Refresh for consistency
          await refreshCart();
        }
      }
    } catch (error: any) {
      if (isAuthenticated) {
        const errorMessage =
          error.response?.data?.message || "Failed to update cart item";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        toast.error(errorMessage);
        console.error("Error updating cart item:", error);
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      if (!isAuthenticated) {
        // Guest cart: remove from localStorage
        removeFromGuestCart(productId);
        dispatch({ type: "REMOVE_ITEM", payload: productId });
        toast.success("Item removed from cart");
      } else {
        // Authenticated: use server API
        await cartAPI.removeFromCart(productId);
        dispatch({ type: "REMOVE_ITEM", payload: productId });
        toast.success("Item removed from cart");

        // Sync to localStorage
        removeFromGuestCart(productId);

        // Refresh for consistency
        await refreshCart();
      }
    } catch (error: any) {
      if (isAuthenticated) {
        const errorMessage =
          error.response?.data?.message || "Failed to remove item from cart";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        toast.error(errorMessage);
        console.error("Error removing from cart:", error);
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      if (!isAuthenticated) {
        // Guest cart: clear localStorage
        clearGuestCart();
        dispatch({ type: "CLEAR_CART" });
        toast.success("Cart cleared");
      } else {
        // Authenticated: use server API
        await cartAPI.clearCart();
        dispatch({ type: "CLEAR_CART" });
        toast.success("Cart cleared");

        // Sync to localStorage
        clearGuestCart();

        // Refresh for consistency
        await refreshCart();
      }
    } catch (error: any) {
      if (isAuthenticated) {
        const errorMessage =
          error.response?.data?.message || "Failed to clear cart";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        toast.error(errorMessage);
        console.error("Error clearing cart:", error);
      }
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
    if (item) return item.quantity;
    // Fallback to guest cart if not authenticated
    if (!isAuthenticated) {
      return getGuestCartItemQuantity(productId);
    }
    return 0;
  };

  const isInCart = (productId: string): boolean => {
    if (state.items.some((item) => item.productId === productId)) {
      return true;
    }
    // Fallback to guest cart if not authenticated
    if (!isAuthenticated) {
      return isInGuestCart(productId);
    }
    return false;
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
