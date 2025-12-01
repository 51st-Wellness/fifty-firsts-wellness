import React, { useMemo, useState } from "react";
import { ShoppingCart, Heart, Bell, Package, Star } from "lucide-react";
import type { StoreItem } from "../types/marketplace.types";
import type { ReviewSummary } from "../types/review.types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextProvider";
import NotificationOptIn from "./NotificationOptIn";
import { useNavigate } from "react-router-dom";
import Price from "./Price";
import { getStoreItemPricing } from "../utils/discounts";
import { useGlobalDiscount } from "../context/GlobalDiscountContext";
import toast from "react-hot-toast";

interface StoreItemCardProps {
  item: StoreItem;
  reviewSummary?: ReviewSummary;
  onAddToCart?: (item: StoreItem) => void;
}

// Reusable card for rendering a single store item
const StoreItemCard: React.FC<StoreItemCardProps> = ({
  item,
  reviewSummary,
  onAddToCart,
}) => {
  const imageUrl = item.display?.url || item.images?.[0] || ""; // pick cover image
  const title = item.name || "Product";
  const { globalDiscount } = useGlobalDiscount();
  const pricing = getStoreItemPricing(item, { globalDiscount });
  const displayPrice = pricing.currentPrice ?? item.price ?? 0;
  const strikeThroughPrice = pricing.hasDiscount
    ? pricing.basePrice
    : item.oldPrice;

  const { isAuthenticated } = useAuth();
  const { addToCart, getItemQuantity, isInCart } = useCart();
  const [itemLoading, setItemLoading] = useState(false);
  const navigate = useNavigate();
  const [notifyOpen, setNotifyOpen] = useState(false);

  const preOrderEnabled = Boolean((item as any).preOrderEnabled);
  const canPreOrder = preOrderEnabled && (item.stock ?? 0) <= 0;

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
  const isOutOfStock = (item.stock ?? 0) === 0;
  const showAddToCart = !canPreOrder && !isComingSoon && !isOutOfStock;
  const showNotifyOnly = !canPreOrder && (isComingSoon || isOutOfStock);

  const handlePreOrder = async () => {
    if (!isAuthenticated || !canPreOrder) return;

    try {
      setItemLoading(true);
      await addToCart(item.productId, 1);
      // Success toast is already shown by CartContext
    } catch (error) {
      console.error("Failed to add pre-order item to cart:", error);
      // Error toast is already shown by CartContext
    } finally {
      setItemLoading(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening dialog when clicking on cart buttons
    if ((e.target as HTMLElement).closest(".cart-controls")) {
      return;
    }
    navigate(`/products/${item.productId}`, {
      state: { cover: imageUrl, images: item.images },
    });
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow flex flex-col h-full"
        onClick={handleCardClick}
      >
        <div className="relative w-full h-40 sm:h-44 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
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
          {canPreOrder && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase text-brand-green shadow-sm">
              <Package className="w-3 h-3" />
              Pre-order
            </span>
          )}
          {!canPreOrder && isOutOfStock && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-gray-900/80 px-3 py-1 text-[10px] font-semibold uppercase text-white shadow-sm">
              <ShoppingCart className="w-3 h-3 text-white" />
              Out of Stock
            </span>
          )}
        </div>

        <div className="p-2 md:p-4 flex flex-col flex-1">
          <h3
            className="text-base md:text-xl font-medium text-gray-900 leading-snug line-clamp-2 h-[38px] md:h-[56px] flex items-start"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            {title}
          </h3>

          <div className="mt-0 flex items-center justify-between min-h-[12px] md:min-h-[16px]">
            <Price
              price={displayPrice}
              oldPrice={strikeThroughPrice}
              priceClassName="text-lg md:text-xl font-semibold"
              oldPriceClassName="text-xs md:text-sm"
              badgeClassName="text-[10px] md:text-xs px-1.5 py-0.5"
            />
          </div>

          {item.stock !== undefined && (
            <div className={`mt-0.5 text-[10px] md:text-xs ${
              (item.stock ?? 0) <= 0 
                ? "text-red-500 font-medium" 
                : "text-gray-500"
            }`}>
              {(item.stock ?? 0) <= 0 
                ? "Out of stock" 
                : `${item.stock} ${item.stock === 1 ? "item" : "items"} in stock`}
            </div>
          )}

          <div className="mt-1 md:mt-1.5 flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-xs md:text-base text-gray-600 min-h-[28px] md:min-h-[20px]">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => {
                const averageRating = reviewSummary?.averageRating ?? 0;
                const hasRating = i < Math.round(averageRating);
                return (
                  <Star
                    key={i}
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      hasRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-gray-500 text-[10px] md:text-sm">
              ({reviewSummary?.reviewCount ?? 0}{" "}
              {(reviewSummary?.reviewCount ?? 0) === 1 ? "review" : "reviews"})
            </span>
          </div>

          <div
            className="mt-auto pt-0.5 md:pt-2 cart-controls flex flex-wrap items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {canPreOrder ? (
              <div className="w-full flex items-center gap-2">
                <span className="relative group flex-1">
                  <button
                    type="button"
                    onClick={handlePreOrder}
                    disabled={!isAuthenticated || !canPreOrder || itemLoading}
                    title={
                      !isAuthenticated
                        ? "Login required to pre-order"
                        : undefined
                    }
                    className="w-full inline-flex items-center justify-center gap-1 md:gap-2 bg-brand-green text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {itemLoading ? (
                      <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Package className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                    <span className="hidden md:inline">
                      {itemLoading ? "Adding..." : "Pre-order now"}
                    </span>
                    <span className="md:hidden">
                      {itemLoading ? "..." : "Pre-order"}
                    </span>
                  </button>
                  {!isAuthenticated && (
                    <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Login required
                    </div>
                  )}
                </span>
                <span className="relative group flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) return;
                      setNotifyOpen(true);
                    }}
                    disabled={!isAuthenticated}
                    title={
                      !isAuthenticated
                        ? "Login required to be notified"
                        : undefined
                    }
                    className="inline-flex items-center justify-center bg-white border border-brand-green text-brand-green w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-brand-green hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Notify me when available"
                  >
                    <Bell className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  {!isAuthenticated && (
                    <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Login required
                    </div>
                  )}
                </span>
              </div>
            ) : showAddToCart ? (
              <span className="relative group w-full">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={itemLoading || !isAuthenticated}
                  title={
                    !isAuthenticated
                      ? "Login required to add items to cart"
                      : undefined
                  }
                  className="w-full inline-flex items-center justify-center gap-1 md:gap-2 bg-brand-green text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {itemLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                  )}
                  <span className="hidden md:inline">
                    {itemLoading ? "Adding..." : "Add to Cart"}
                  </span>
                  <span className="md:hidden">
                    {itemLoading ? "..." : "Add"}
                  </span>
                </button>
                {!isAuthenticated && (
                  <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Login required
                  </div>
                )}
              </span>
            ) : null}

            {showNotifyOnly && (
              <div className="w-full flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled
                  className="flex-1 inline-flex items-center justify-center gap-1 md:gap-2 bg-gray-400 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-semibold cursor-not-allowed"
                >
                  <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden md:inline">Out of Stock</span>
                  <span className="md:hidden">Out of Stock</span>
                </button>
                <span className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) return;
                      setNotifyOpen(true);
                    }}
                    disabled={!isAuthenticated}
                    title={
                      !isAuthenticated
                        ? "Login required to be notified"
                        : undefined
                    }
                    className="inline-flex items-center justify-center bg-white border border-brand-green text-brand-green w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-brand-green hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Notify me when available"
                  >
                    <Bell className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  {!isAuthenticated && (
                    <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Login required
                    </div>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <NotificationOptIn
        item={item}
        isOpen={notifyOpen}
        onClose={() => setNotifyOpen(false)}
      />
    </>
  );
};

export default StoreItemCard;
