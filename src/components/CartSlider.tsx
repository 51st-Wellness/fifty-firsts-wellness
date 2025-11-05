import React from "react";
import { Link } from "react-router-dom";
import {
  SwipeableDrawer,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";
import { Button } from "./ui/button";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, X } from "lucide-react";
import { CartItemWithRelations } from "../api/cart.api";

interface CartSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSlider: React.FC<CartSliderProps> = ({ isOpen, onClose }) => {
  const {
    items,
    isLoading,
    totalItems,
    totalPrice,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // iOS needs these flags for smoother swipe behavior
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const CartItem: React.FC<{ item: CartItemWithRelations }> = ({ item }) => {
    // Correctly access nested storeItem data
    const { product, quantity } = item;
    const storeItem = product.storeItem;

    // Return null if storeItem is missing to prevent crashes
    if (!storeItem) {
      return null;
    }

    const category = storeItem.categories?.[0] || "Uncategorized";

    return (
      <div className="relative bg-white rounded-xl p-4 flex items-start gap-4">
        {/* Image left */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          {storeItem.display?.url ? (
            <img
              src={storeItem.display.url}
              alt={storeItem.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Top right of image: product name, category below */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {storeItem.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1">Category: {category}</p>

          {/* Bottom right of image: quantity controls */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => handleQuantityChange(item.productId, quantity - 1)}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-brand-green hover:bg-brand-green-dark flex items-center justify-center disabled:opacity-50"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.productId, quantity + 1)}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-brand-green hover:bg-brand-green-dark flex items-center justify-center disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Top right of card: price */}
        <div className="absolute top-4 right-4">
          <div className="text-sm font-semibold text-gray-900">{formatPrice(storeItem.price)}</div>
        </div>

        {/* Bottom right of card: delete icon */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => removeFromCart(item.productId)}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      onOpen={() => {}} // We don't need to handle open since we control it via cart context
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      keepMounted
      PaperProps={{
        sx: {
          width: isMobile ? "100vw" : 480,
          height: "100vh",
          pb: isMobile ? "env(safe-area-inset-bottom)" : 0,
          backdropFilter: isMobile ? "saturate(180%) blur(8px)" : "none",
          boxShadow: "none",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header (sticky) */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 2,
            py: 1.5,
          }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            <span className="font-semibold text-lg text-gray-900">
              Shopping Cart ({totalItems})
            </span>
          </div>
          <IconButton
            aria-label="Close cart"
            onClick={onClose}
            size="large"
            className="hover:opacity-80"
          >
            <X className="w-5 h-5" />
          </IconButton>
        </Box>

        {/* Body (scrollable) */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            bgcolor: "#F9FAFB", // A light grey background
            p: 2,
          }}
        >
          {items.length === 0 ? (
            // Empty Cart
            <div className="flex flex-col items-center justify-center h-full px-6 py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-center text-sm">
                Add some items to your cart to get started
              </p>
            </div>
          ) : (
            // Cart Items with separators, no shadows
            <div className="bg-white rounded-xl divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="">
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              px: 2,
              py: 2,
              bgcolor: "grey.50",
            }}
          >
            {/* Total */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">
                Total:
              </span>
              <span className="text-xl font-bold text-brand-green">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white font-semibold rounded-full py-2 sm:py-3 text-sm"
                disabled={isLoading}
              >
                Checkout
              </Button>
              <Link to="/dashboard/cart" onClick={onClose} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-brand-green text-brand-green hover:bg-brand-green/5 font-semibold rounded-full py-2 sm:py-3 text-sm"
                  disabled={isLoading}
                >
                  Go to Cart
                </Button>
              </Link>
            </div>
          </Box>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
          </div>
        )}
      </Box>
    </SwipeableDrawer>
  );
};

export default CartSlider;
