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
  type CartType,
} from "../utils/guestCart";
import { fetchStoreItemById } from "../api/marketplace.api";
import { ResponseStatus } from "../types/response.types";

// Cart state interface
interface CartState {
  standardItems: CartItemWithRelations[];
  preorderItems: CartItemWithRelations[];
  activeTab: CartType;
  isLoading: boolean;
  error: string | null;
  isCartOpen: boolean;
}

// Cart actions
type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_STANDARD_ITEMS"; payload: CartItemWithRelations[] }
  | { type: "SET_PREORDER_ITEMS"; payload: CartItemWithRelations[] }
  | { type: "ADD_ITEM"; payload: { item: CartItemWithRelations; type: CartType } }
  | { type: "UPDATE_ITEM"; payload: { item: CartItemWithRelations; type: CartType } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; type: CartType } }
  | { type: "CLEAR_CART"; payload: CartType }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean }
  | { type: "SET_ACTIVE_TAB"; payload: CartType };

// Cart context interface
interface CartContextType {
  // State
  standardItems: CartItemWithRelations[];
  preorderItems: CartItemWithRelations[];
  activeItems: CartItemWithRelations[]; // Helper for currently active tab
  activeTab: CartType;
  isLoading: boolean;
  error: string | null;
  isCartOpen: boolean;

  // Computed values (for active tab)
  totalItems: number;
  totalPrice: number;

  // Specific totals
  standardTotal: number;
  preorderTotal: number;

  // Actions
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number, type?: CartType) => Promise<void>;
  removeFromCart: (productId: string, type?: CartType) => Promise<void>;
  clearCart: (type?: CartType) => Promise<void>;
  refreshCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setActiveTab: (tab: CartType) => void;
  getItemQuantity: (productId: string, type?: CartType) => number;
  isInCart: (productId: string, type?: CartType) => boolean;
}

// Initial state
const initialState: CartState = {
  standardItems: [],
  preorderItems: [],
  activeTab: "standard",
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

    case "SET_STANDARD_ITEMS":
      return { ...state, standardItems: action.payload };

    case "SET_PREORDER_ITEMS":
      return { ...state, preorderItems: action.payload };

    case "ADD_ITEM": {
      const { item, type } = action.payload;
      const key = type === "standard" ? "standardItems" : "preorderItems";
      const existingItems = state[key];

      const existingItemIndex = existingItems.findIndex(
        (i) => i.productId === item.productId
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...existingItems];
        updatedItems[existingItemIndex] = item;
        return { ...state, [key]: updatedItems };
      } else {
        return { ...state, [key]: [...existingItems, item] };
      }
    }

    case "UPDATE_ITEM": {
      const { item, type } = action.payload;
      const key = type === "standard" ? "standardItems" : "preorderItems";
      return {
        ...state,
        [key]: state[key].map((i) =>
          i.productId === item.productId ? item : i
        ),
      };
    }

    case "REMOVE_ITEM": {
      const { productId, type } = action.payload;
      const key = type === "standard" ? "standardItems" : "preorderItems";
      return {
        ...state,
        [key]: state[key].filter((item) => item.productId !== productId),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        [action.payload === "standard" ? "standardItems" : "preorderItems"]: []
      };

    case "TOGGLE_CART":
      return { ...state, isCartOpen: !state.isCartOpen };

    case "SET_CART_OPEN":
      return { ...state, isCartOpen: action.payload };

    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };

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

  const calculateCartTotal = useCallback((items: CartItemWithRelations[], type: CartType) => {
    // Normal cart: consolidated price calculation
    // Pre-order cart: individual items calculated (though pricing logic is similar, 
    // the UI/Backend will split shipping later)
    return items.reduce((total, item) => {
      const storeItem = item.product.storeItem;
      if (!storeItem) return total;
      const price = getStoreItemPricing(storeItem, {
        globalDiscount,
      }).currentPrice;
      return total + price * item.quantity;
    }, 0);
  }, [globalDiscount]);

  // Computed values
  const standardTotal = calculateCartTotal(state.standardItems, "standard");
  const preorderTotal = calculateCartTotal(state.preorderItems, "preorder");

  const activeItems = state.activeTab === "standard" ? state.standardItems : state.preorderItems;
  const totalItems = activeItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.activeTab === "standard" ? standardTotal : preorderTotal;

  const mapGuestToCartItem = (guestItem: GuestCartItem, storeItem: any): CartItemWithRelations => ({
    id: `guest-${guestItem.productId}`,
    productId: guestItem.productId,
    userId: "guest",
    quantity: guestItem.quantity,
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
  });

  // Load guest carts
  const loadGuestCarts = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const loadType = async (type: CartType) => {
        const guestItems = getGuestCart(type);
        if (guestItems.length === 0) return [];

        const cartItems = await Promise.all(
          guestItems.map(async (gi) => {
            try {
              const res = await fetchStoreItemById(gi.productId);
              return res.data ? mapGuestToCartItem(gi, res.data) : null;
            } catch { return null; }
          })
        );
        return cartItems.filter((i): i is CartItemWithRelations => i !== null);
      };

      const [standard, preorder] = await Promise.all([
        loadType("standard"),
        loadType("preorder")
      ]);

      dispatch({ type: "SET_STANDARD_ITEMS", payload: standard });
      dispatch({ type: "SET_PREORDER_ITEMS", payload: preorder });
    } catch (error) {
      console.error("Error loading guest carts:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Update effect to reload on auth change
  useEffect(() => {
    const init = async () => {
      if (isAuthenticated && user) {
        await refreshCart();
      } else {
        await loadGuestCarts();
      }
    };
    init();
  }, [isAuthenticated, user]);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      await loadGuestCarts();
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // Note: Backend doesn't support dual carts yet, so we map everything 
      // based on item properties for now.
      const response = await cartAPI.getCart();

      if (response.status === ResponseStatus.SUCCESS && response.data) {
        const allItems = response.data.items;

        const standard = allItems.filter(item => {
          const si = item.product.storeItem;
          const isPreorder = si && Boolean(si.preOrderEnabled) && (si.stock ?? 0) <= 0;
          return !isPreorder;
        });

        const preorder = allItems.filter(item => {
          const si = item.product.storeItem;
          return si && Boolean(si.preOrderEnabled) && (si.stock ?? 0) <= 0;
        });

        dispatch({ type: "SET_STANDARD_ITEMS", payload: standard });
        dispatch({ type: "SET_PREORDER_ITEMS", payload: preorder });

        // Sync to local storage
        saveGuestCart(standard.map(i => ({ productId: i.productId, quantity: i.quantity })), "standard");
        saveGuestCart(preorder.map(i => ({ productId: i.productId, quantity: i.quantity })), "preorder");
      }
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.message || "Failed to load cart" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isAuthenticated, loadGuestCarts]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const productResponse = await fetchStoreItemById(productId);
      const storeItem = productResponse.data;
      if (!storeItem) throw new Error("Product not found");

      const isPreorder = Boolean(storeItem.preOrderEnabled) && (storeItem.stock ?? 0) <= 0;
      const type: CartType = isPreorder ? "preorder" : "standard";

      if (!isAuthenticated) {
        addToGuestCart(productId, type, quantity);
        const cartItem = mapGuestToCartItem({ productId, quantity: getGuestCartItemQuantity(productId, type) }, storeItem);
        dispatch({ type: "ADD_ITEM", payload: { item: cartItem, type } });
        dispatch({ type: "SET_ACTIVE_TAB", payload: type });
        dispatch({ type: "SET_CART_OPEN", payload: true });
      } else {
        const response = await cartAPI.addToCart({ productId, quantity });
        if (response.status === ResponseStatus.SUCCESS && response.data) {
          dispatch({ type: "ADD_ITEM", payload: { item: response.data, type } });
          dispatch({ type: "SET_ACTIVE_TAB", payload: type });
          dispatch({ type: "SET_CART_OPEN", payload: true });
          refreshCart().catch(console.error);
        } else {
          throw new Error(response.message || "Failed to add to cart");
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Error adding to cart";
      toast.error(msg);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateCartItem = async (productId: string, quantity: number, type?: CartType) => {
    const cartType = type || state.activeTab;
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      if (!isAuthenticated) {
        updateGuestCartItem(productId, quantity, cartType);
        const existing = (cartType === "standard" ? state.standardItems : state.preorderItems).find(i => i.productId === productId);
        if (existing) {
          dispatch({ type: "UPDATE_ITEM", payload: { item: { ...existing, quantity }, type: cartType } });
        }
        if (quantity <= 0) dispatch({ type: "REMOVE_ITEM", payload: { productId, type: cartType } });
      } else {
        const response = await cartAPI.updateCartItem(productId, { quantity });
        if (response.status === ResponseStatus.SUCCESS && response.data) {
          dispatch({ type: "UPDATE_ITEM", payload: { item: response.data, type: cartType } });
          updateGuestCartItem(productId, quantity, cartType);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeFromCart = async (productId: string, type?: CartType) => {
    const cartType = type || state.activeTab;
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      if (!isAuthenticated) {
        removeFromGuestCart(productId, cartType);
        dispatch({ type: "REMOVE_ITEM", payload: { productId, type: cartType } });
        toast.success("Removed from cart");
      } else {
        await cartAPI.removeFromCart(productId);
        dispatch({ type: "REMOVE_ITEM", payload: { productId, type: cartType } });
        removeFromGuestCart(productId, cartType);
        toast.success("Removed from cart");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Remove failed");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const clearCart = async (type?: CartType) => {
    const cartType = type || state.activeTab;
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      if (!isAuthenticated) {
        clearGuestCart(cartType);
        dispatch({ type: "CLEAR_CART", payload: cartType });
      } else {
        await cartAPI.clearCart();
        dispatch({ type: "CLEAR_CART", payload: cartType });
        clearGuestCart(cartType);
      }
      toast.success(`${cartType === "standard" ? "Standard" : "Pre-order"} cart cleared`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Clear failed");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getItemQuantity = (productId: string, type?: CartType): number => {
    const t = type || state.activeTab;
    const items = t === "standard" ? state.standardItems : state.preorderItems;
    const item = items.find((i) => i.productId === productId);
    return item ? item.quantity : (isAuthenticated ? 0 : getGuestCartItemQuantity(productId, t));
  };

  const isInCart = (productId: string, type?: CartType): boolean => {
    const t = type || state.activeTab;
    const items = t === "standard" ? state.standardItems : state.preorderItems;
    return items.some((i) => i.productId === productId) || (!isAuthenticated && isInGuestCart(productId, t));
  };

  const contextValue: CartContextType = {
    ...state,
    activeItems,
    totalItems,
    totalPrice,
    standardTotal,
    preorderTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    openCart: () => dispatch({ type: "SET_CART_OPEN", payload: true }),
    closeCart: () => dispatch({ type: "SET_CART_OPEN", payload: false }),
    setActiveTab: (payload) => dispatch({ type: "SET_ACTIVE_TAB", payload }),
    getItemQuantity,
    isInCart,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within a CartProvider");
  return context;
};

