// Guest cart utilities for localStorage
// Stores cart items when user is not logged in

export interface GuestCartItem {
  productId: string;
  quantity: number;
}

const GUEST_CART_KEY = "fifty_firsts_guest_cart";

/**
 * Get all items from guest cart in localStorage
 */
export const getGuestCart = (): GuestCartItem[] => {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Handle legacy format (object with items array)
    if (!Array.isArray(parsed) && parsed.items) {
      return parsed.items.filter(
        (item: any) =>
          item &&
          typeof item.productId === "string" &&
          typeof item.quantity === "number" &&
          item.quantity > 0
      );
    }
    
    // Handle array format
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item: any) =>
          item &&
          typeof item.productId === "string" &&
          typeof item.quantity === "number" &&
          item.quantity > 0
      );
    }
    
    return [];
  } catch (error) {
    console.error("Error reading guest cart from localStorage:", error);
    return [];
  }
};

/**
 * Save guest cart items to localStorage
 */
export const saveGuestCart = (items: GuestCartItem[]): void => {
  try {
    const validItems = items.filter(
      (item) =>
        item &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
    
    // Store as simple array
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(validItems));
  } catch (error) {
    console.error("Error saving guest cart to localStorage:", error);
  }
};

/**
 * Add item to guest cart (or update quantity if exists)
 */
export const addToGuestCart = (
  productId: string,
  quantity: number = 1
): void => {
  const items = getGuestCart();
  const existingIndex = items.findIndex(
    (item) => item.productId === productId
  );

  if (existingIndex >= 0) {
    // Update existing item quantity
    items[existingIndex].quantity += quantity;
  } else {
    // Add new item
    items.push({
      productId,
      quantity,
    });
  }

  saveGuestCart(items);
};

/**
 * Update guest cart item quantity
 */
export const updateGuestCartItem = (
  productId: string,
  quantity: number
): void => {
  if (quantity <= 0) {
    removeFromGuestCart(productId);
    return;
  }

  const items = getGuestCart();
  const existingIndex = items.findIndex(
    (item) => item.productId === productId
  );

  if (existingIndex >= 0) {
    items[existingIndex].quantity = quantity;
    saveGuestCart(items);
  }
};

/**
 * Remove item from guest cart
 */
export const removeFromGuestCart = (productId: string): void => {
  const items = getGuestCart().filter(
    (item) => item.productId !== productId
  );
  saveGuestCart(items);
};

/**
 * Clear guest cart
 */
export const clearGuestCart = (): void => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (error) {
    console.error("Error clearing guest cart:", error);
  }
};

/**
 * Get quantity of a specific item in guest cart
 */
export const getGuestCartItemQuantity = (productId: string): number => {
  const items = getGuestCart();
  const item = items.find((item) => item.productId === productId);
  return item ? item.quantity : 0;
};

/**
 * Check if item is in guest cart
 */
export const isInGuestCart = (productId: string): boolean => {
  return getGuestCartItemQuantity(productId) > 0;
};

