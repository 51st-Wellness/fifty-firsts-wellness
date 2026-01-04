// Guest cart utilities for localStorage
// Stores cart items when user is not logged in

export interface GuestCartItem {
  productId: string;
  quantity: number;
}

export type CartType = "standard" | "preorder";

const GUEST_CART_KEYS: Record<CartType, string> = {
  standard: "fifty_firsts_guest_cart_standard",
  preorder: "fifty_firsts_guest_cart_preorder",
};

// For backward compatibility during transition
const LEGACY_GUEST_CART_KEY = "fifty_firsts_guest_cart";

/**
 * Get all items from guest cart in localStorage by type
 */
export const getGuestCart = (type: CartType = "standard"): GuestCartItem[] => {
  try {
    // If we're looking for standard and the standard key doesn't exist, 
    // try to migrate from the legacy key
    if (type === "standard" && !localStorage.getItem(GUEST_CART_KEYS.standard)) {
      const legacy = localStorage.getItem(LEGACY_GUEST_CART_KEY);
      if (legacy) {
        localStorage.setItem(GUEST_CART_KEYS.standard, legacy);
        localStorage.removeItem(LEGACY_GUEST_CART_KEY);
      }
    }

    const stored = localStorage.getItem(GUEST_CART_KEYS[type]);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    // Handle legacy format in the new key or array format
    const items = Array.isArray(parsed) ? parsed : (parsed.items || []);

    return items.filter(
      (item: any) =>
        item &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
  } catch (error) {
    console.error(`Error reading guest cart (${type}) from localStorage:`, error);
    return [];
  }
};

/**
 * Save guest cart items to localStorage by type
 */
export const saveGuestCart = (items: GuestCartItem[], type: CartType = "standard"): void => {
  try {
    const validItems = items.filter(
      (item) =>
        item &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );

    localStorage.setItem(GUEST_CART_KEYS[type], JSON.stringify(validItems));
  } catch (error) {
    console.error(`Error saving guest cart (${type}) to localStorage:`, error);
  }
};

/**
 * Add item to guest cart by type
 */
export const addToGuestCart = (
  productId: string,
  type: CartType = "standard",
  quantity: number = 1
): void => {
  const items = getGuestCart(type);
  const existingIndex = items.findIndex(
    (item) => item.productId === productId
  );

  if (existingIndex >= 0) {
    items[existingIndex].quantity += quantity;
  } else {
    items.push({
      productId,
      quantity,
    });
  }

  saveGuestCart(items, type);
};

/**
 * Update guest cart item quantity by type
 */
export const updateGuestCartItem = (
  productId: string,
  quantity: number,
  type: CartType = "standard"
): void => {
  if (quantity <= 0) {
    removeFromGuestCart(productId, type);
    return;
  }

  const items = getGuestCart(type);
  const existingIndex = items.findIndex(
    (item) => item.productId === productId
  );

  if (existingIndex >= 0) {
    items[existingIndex].quantity = quantity;
    saveGuestCart(items, type);
  }
};

/**
 * Remove item from guest cart by type
 */
export const removeFromGuestCart = (productId: string, type: CartType = "standard"): void => {
  const items = getGuestCart(type).filter(
    (item) => item.productId !== productId
  );
  saveGuestCart(items, type);
};

/**
 * Clear guest cart by type
 */
export const clearGuestCart = (type: CartType = "standard"): void => {
  try {
    localStorage.removeItem(GUEST_CART_KEYS[type]);
  } catch (error) {
    console.error(`Error clearing guest cart (${type}):`, error);
  }
};

/**
 * Get quantity of a specific item in guest cart by type
 */
export const getGuestCartItemQuantity = (productId: string, type: CartType = "standard"): number => {
  const items = getGuestCart(type);
  const item = items.find((item) => item.productId === productId);
  return item ? item.quantity : 0;
};

/**
 * Check if item is in guest cart by type
 */
export const isInGuestCart = (productId: string, type: CartType = "standard"): boolean => {
  return getGuestCartItemQuantity(productId, type) > 0;
};


