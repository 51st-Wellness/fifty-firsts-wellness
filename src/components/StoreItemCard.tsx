import React, { useState } from "react";
import { ShoppingCart, Heart, Bell, Package } from "lucide-react";
import type { StoreItem } from "../types/marketplace.types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextProvider";
import NotificationOptIn from "./NotificationOptIn";
import { useNavigate } from "react-router-dom";
import Price from "./Price";
import { getStoreItemPricing } from "../utils/discounts";
import { preorderProduct } from "../api/marketplace.api";
import toast from "react-hot-toast";

interface StoreItemCardProps {
  item: StoreItem;
  onAddToCart?: (item: StoreItem) => void;
}

// Reusable card for rendering a single store item
const StoreItemCard: React.FC<StoreItemCardProps> = ({ item, onAddToCart }) => {
  const imageUrl = item.display?.url || item.images?.[0] || ""; // pick cover image
  const title = item.name || "Product";
  const pricing = getStoreItemPricing(item);
  const displayPrice = pricing.currentPrice ?? item.price ?? 0;
  const strikeThroughPrice = pricing.hasDiscount
    ? pricing.basePrice
    : item.oldPrice;

  const { isAuthenticated } = useAuth();
  const { addToCart, getItemQuantity, isInCart } = useCart();
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
        </div>

        <div className="p-2 md:p-4 flex flex-col flex-1">
          <h3
            className="text-base md:text-xl font-medium text-gray-900 leading-snug line-clamp-2 min-h-[38px] md:min-h-[44px]"
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

          <div className="mt-0 md:mt-0.5 flex flex-col md:flex-row md:items-center gap-0.5 md:gap-0.5 text-xs md:text-base text-gray-600 min-h-[16px] md:min-h-[14px]">
            <span className="text-yellow-400 text-sm md:text-lg">★★★★</span>
            <span className="text-gray-500 text-[10px] md:text-sm">
              (124 reviews)
            </span>
          </div>

          <div
            className="mt-auto pt-0.5 md:pt-2 cart-controls flex flex-wrap items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {!isComingSoon && !isOutOfStock && (
              <span className="relative group w-full">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={itemLoading || !isAuthenticated}
                  title={!isAuthenticated ? "Login required to add items to cart" : undefined}
                  className="w-full inline-flex items-center justify-center gap-1 md:gap-2 bg-brand-green text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {itemLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                  )}
                  <span className="hidden md:inline">{itemLoading ? "Adding..." : "Add to Cart"}</span>
                  <span className="md:hidden">{itemLoading ? "..." : "Add"}</span>
                </button>
                {!isAuthenticated && (
                  <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Login required
                  </div>
                )}
              </span>
            )}

            {(isComingSoon || isOutOfStock) && (
              <div className="w-full flex items-center justify-between gap-3">
                <span className="relative group flex-1">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!isAuthenticated) return;
                      try {
                        await preorderProduct(item.productId);
                        toast.success("Pre‑order placed");
                      } catch (e) {
                        toast.error("Failed to place pre‑order");
                      }
                    }}
                    disabled={!isAuthenticated}
                    title={!isAuthenticated ? "Login required to pre‑order" : undefined}
                    className="w-full inline-flex items-center justify-center gap-1 md:gap-2 bg-brand-green text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Package className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden md:inline">Pre‑Order</span>
                    <span className="md:hidden">Pre‑Order</span>
                  </button>
                  {!isAuthenticated && (
                    <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Login required
                    </div>
                  )}
                </span>
                <span className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) return;
                      setNotifyOpen(true);
                    }}
                    disabled={!isAuthenticated}
                    title={!isAuthenticated ? "Login required to be notified" : undefined}
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
