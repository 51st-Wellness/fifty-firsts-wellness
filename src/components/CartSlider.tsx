import React from "react";
import { useNavigate } from "react-router-dom";
import {
  SwipeableDrawer,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Button } from "./ui/button";
import { useCart } from "../context/CartContext";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  X,
  Package,
  Info,
} from "lucide-react";
import { CartItemWithRelations } from "../api/cart.api";
import { useGlobalDiscount } from "../context/GlobalDiscountContext";

interface CartSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSlider: React.FC<CartSliderProps> = ({ isOpen, onClose }) => {
  const {
    activeItems,
    activeTab,
    setActiveTab,
    standardItems,
    preorderItems,
    isLoading,
    totalItems,
    totalPrice,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { globalDiscount } = useGlobalDiscount();

  // iOS needs these flags for smoother swipe behavior
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId, activeTab);
    } else {
      await updateCartItem(productId, newQuantity, activeTab);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleCheckoutRedirect = () => {
    onClose();
    navigate("/checkout", { state: { cartType: activeTab } });
  };

  // Mock shipping logic for pre-orders as specified in requirements
  const PREORDER_SHIPPING_FEE = 4.19;
  const estimatedPreorderShipping = (preorderItems || []).reduce(
    (acc, item) => acc + PREORDER_SHIPPING_FEE * item.quantity,
    0
  );

  const CartItem: React.FC<{ item: CartItemWithRelations }> = ({ item }) => {
    const { product, quantity } = item;
    const storeItem = product.storeItem;

    if (!storeItem) return null;

    const category = storeItem.categories?.[0] || "Uncategorized";
    const unitPrice = storeItem.price ?? 0;
    const lineTotal = unitPrice * quantity;

    return (
      <div className="relative bg-white rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          {storeItem.display?.url ? (
            <img
              src={storeItem.display.url}
              alt={storeItem.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-20 sm:pr-24">
          <h4
            className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            {storeItem.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1 leading-snug">
            Category: {category}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => handleQuantityChange(item.productId, quantity - 1)}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-brand-green hover:bg-brand-green-dark flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.productId, quantity + 1)}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-brand-green hover:bg-brand-green-dark flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute top-4 right-4 text-right space-y-0.5 sm:space-y-1 min-w-[80px] sm:min-w-[100px]">
          <div className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
            {formatPrice(unitPrice)}
            <span className="ml-1 text-[10px] sm:text-xs text-gray-500">
              ea
            </span>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 leading-tight">
            Subtotal: {formatPrice(lineTotal)}
          </div>
        </div>

        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => removeFromCart(item.productId, activeTab)}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 p-1.5 sm:p-2 rounded-full hover:bg-red-50 disabled:opacity-50 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
      onOpen={() => {}}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      keepMounted
      PaperProps={{
        sx: {
          width: isMobile ? "100vw" : 480,
          height: isMobile ? "100dvh" : "100vh",
          pb: 0,
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
          position: "relative",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 2,
            pt: 1.5,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span
                className="font-semibold text-lg text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Cart
              </span>
            </div>
            <IconButton onClick={onClose} size="large">
              <X className="w-5 h-5" />
            </IconButton>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === "orders"
                  ? "bg-brand-green text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Standard ({standardItems.length})
            </button>
            <button
              onClick={() => setActiveTab("preorders")}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === "preorders"
                  ? "bg-brand-green text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Pre-orders ({preorderItems.length})
            </button>
          </div>
        </Box>

        {/* Body */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            bgcolor: "#F9FAFB",
            p: 2,
            minHeight: 0,
          }}
        >
          {activeItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <h3
                className="text-lg font-medium text-gray-900 mb-2"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                {activeTab === "orders"
                  ? "Orders cart is empty"
                  : "No pre-orders yet"}
              </h3>
              <p className="text-gray-500 text-center text-sm">
                Add some items to get started
              </p>
            </div>
          ) : (
            <>
              {activeTab === "preorders" && (
                <div className="mb-3 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2.5 text-[11px] sm:text-xs text-orange-800">
                  <div className="flex gap-2">
                    <Info className="flex-shrink-0 w-4 h-4 text-orange-600" />
                    <div>
                      <p
                        className="font-semibold mb-0.5 uppercase tracking-wider"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        Pre-order Notice
                      </p>
                      <p>
                        These items ship separately as they become available.
                        Shipping is calculated per individual item.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl divide-y divide-gray-200">
                {activeItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </Box>

        {/* Footer */}
        {activeItems.length > 0 && (
          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              px: 2,
              py: 2,
              pb: isMobile ? "calc(16px + env(safe-area-inset-bottom))" : 2,
              bgcolor: "background.paper",
              position: "sticky",
              bottom: 0,
              zIndex: 10,
              boxShadow: isMobile ? "0 -2px 8px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {/* Breakdown for Pre-orders */}
            {activeTab === "preorders" && (
              <div className="space-y-1 mb-3 pt-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Items total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    Shipping{" "}
                    <span className="italic text-[10px] bg-gray-100 px-1 rounded">
                      (
                      {activeTab === "preorders"
                        ? `${totalItems} items × ${formatPrice(
                            PREORDER_SHIPPING_FEE
                          )}`
                        : "Consolidated"}
                      )
                    </span>
                  </span>
                  <span>{formatPrice(estimatedPreorderShipping)}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <span
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                {activeTab === "preorders"
                  ? "Total + Est. Shipping:"
                  : "Subtotal:"}
              </span>
              <div className="text-right">
                <span
                  className="text-xl font-bold text-brand-green"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  {formatPrice(
                    activeTab === "preorders"
                      ? totalPrice + estimatedPreorderShipping
                      : totalPrice
                  )}
                </span>
                {activeTab === "preorders" && (
                  <p className="text-[10px] text-gray-400 mt-1 italic">
                    Individual shipping applied
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white font-semibold rounded-full py-2 sm:py-3 text-sm"
                disabled={isLoading}
                onClick={handleCheckoutRedirect}
              >
                Checkout {activeTab === "preorders" ? "Pre-order" : "Orders"}
              </Button>
              <Button
                variant="outline"
                className="flex-shrink-0 border-gray-300 text-gray-500 hover:bg-gray-50 font-semibold rounded-full p-2.5 sm:p-3"
                disabled={isLoading}
                onClick={() => clearCart(activeTab)}
                aria-label="Clear Cart"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Box>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-[100]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
          </div>
        )}
      </Box>
    </SwipeableDrawer>
  );
};

export default CartSlider;
