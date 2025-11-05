import React, { useState } from "react";
import { ShoppingCart, Heart, Bell, Package } from "lucide-react";
import type { StoreItem } from "../types/marketplace.types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextProvider";
import NotificationOptIn from "./NotificationOptIn";
import { useNavigate } from "react-router-dom";
import Price from "./Price";

interface StoreItemCardProps {
  item: StoreItem;
  onAddToCart?: (item: StoreItem) => void;
}

// Reusable card for rendering a single store item
const StoreItemCard: React.FC<StoreItemCardProps> = ({ item, onAddToCart }) => {
  const imageUrl = item.display?.url || item.images?.[0] || ""; // pick cover image
  const title = item.name || "Product";
  const price = item.price ?? 0;

  const { isAuthenticated } = useAuth();
  const {
    addToCart,
    getItemQuantity,
    isInCart,
  } = useCart();
  const [itemLoading, setItemLoading] = useState(false);
  const navigate = useNavigate();
  const [notifyOpen, setNotifyOpen] = useState(false);

  const currentQuantity = getItemQuantity(item.productId);
  const inCart = isInCart(item.productId);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Could show a login prompt here
      return;
    }

    try {
      setItemLoading(true);
      await addToCart(item.productId, 1);

      // Call the optional onAddToCart callback if provided
      if (onAddToCart) {
        onAddToCart(item);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setItemLoading(false);
    }
  };

  const isComingSoon = (item as any)?.status === "coming_soon";
  const isOutOfStock = item.stock === 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening dialog when clicking on cart buttons
    if ((e.target as HTMLElement).closest(".cart-controls")) {
      return;
    }
    navigate(`/products/${item.productId}`);
  };

  // Calculate discount percentage if there's an old price
  const hasDiscount = item.oldPrice && item.oldPrice > price;
  const discountPercent = hasDiscount && item.oldPrice
    ? Math.round(((item.oldPrice - price) / item.oldPrice) * 100)
    : 0;

  return (
    <>
      <div 
        className="bg-white rounded-2xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleCardClick}
      >
        <div className="relative w-full h-40 sm:h-44 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {hasDiscount && (
            <div className="absolute left-2 top-2 bg-blue-100 text-blue-700 text-[10px] md:text-xs px-2 py-1 rounded-full font-semibold">
              -{discountPercent}%
            </div>
          )}

          {isComingSoon && (
            <div className="absolute right-2 top-2 bg-[#4444B3]/10 text-[#4444B3] text-[10px] md:text-xs px-2 py-1 rounded-full font-semibold">
              Pre‑order
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute right-2 top-2 bg-brand-green/10 text-brand-green text-[10px] md:text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <Bell className="w-3 h-3" /> Notify me
            </div>
          )}
        </div>
        
        <div className="p-2 md:p-4 flex flex-col">
          <h3 className="text-xs md:text-base font-normal text-gray-900 leading-snug line-clamp-2 font-primary min-h-[24px] md:min-h-[30px]">
            {title}
          </h3>
          
          <div className="mt-2 md:mt-4 flex items-center justify-between min-h-[20px] md:min-h-[28px]">
            <Price price={price} oldPrice={item.oldPrice} className="!text-base md:!text-2xl" />
          </div>
          
          <div className="mt-2 md:mt-3 flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600 min-h-[32px] md:min-h-[20px]">
            <span className="text-yellow-400 text-sm md:text-base">★★★★</span>
            <span className="text-gray-500 text-[10px] md:text-sm">(124 reviews)</span>
          </div>
          
          <div className="mt-2 md:mt-4 cart-controls flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {!isOutOfStock && (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={itemLoading || !isAuthenticated}
                className="inline-flex items-center gap-1 md:gap-2 bg-brand-green text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {itemLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                )}
                <span className="hidden md:inline">{itemLoading ? "Adding..." : "Add to Cart"}</span>
                <span className="md:hidden">{itemLoading ? "..." : "Add"}</span>
              </button>
            )}

            {isComingSoon && (
              <button
                type="button"
                className="inline-flex items-center gap-1 md:gap-2 border border-[#4444B3] text-[#4444B3] px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-semibold hover:bg-[#4444B3] hover:text-white transition-colors"
              >
                <Package className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">Pre‑Order</span>
                <span className="md:hidden">Pre‑Order</span>
              </button>
            )}

            {isOutOfStock && (
              <button
                type="button"
                onClick={() => setNotifyOpen(true)}
                className="inline-flex items-center gap-1 md:gap-2 border border-brand-green text-brand-green px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-semibold hover:bg-brand-green hover:text-white transition-colors"
                aria-label="Notify me when available"
              >
                <Bell className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">Notify me</span>
                <span className="md:hidden">Notify</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <NotificationOptIn item={item} isOpen={notifyOpen} onClose={() => setNotifyOpen(false)} />
    </>
  );
};

export default StoreItemCard;
