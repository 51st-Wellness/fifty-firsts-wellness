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
import { preorderProduct } from "../api/marketplace.api";
import toast from "react-hot-toast";

const formatCurrency = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value ?? 0);

const formatPreOrderDate = (value?: string | Date | null) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

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
  const preOrderDepositAmount = Number(
    (item as any).preOrderDepositAmount ?? 0
  );
  const preOrderFulfillmentDate = (item as any).preOrderFulfillmentDate;
  const preOrderStart = (item as any).preOrderStart;
  const preOrderEnd = (item as any).preOrderEnd;

  const isPreOrderWindowActive = useMemo(() => {
    if (!preOrderEnabled) return false;
    const now = new Date();
    const startDate = preOrderStart ? new Date(preOrderStart) : null;
    const endDate = preOrderEnd ? new Date(preOrderEnd) : null;
    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    return true;
  }, [preOrderEnabled, preOrderStart, preOrderEnd]);

  const preOrderDueNowPerUnit = useMemo(() => {
    if (!preOrderEnabled) return 0;
    return preOrderDepositAmount > 0 ? preOrderDepositAmount : displayPrice;
  }, [preOrderEnabled, preOrderDepositAmount, displayPrice]);

  const preOrderBalancePerUnit = Math.max(
    displayPrice - preOrderDueNowPerUnit,
    0
  );

  const formattedFulfillmentDate = useMemo(
    () => formatPreOrderDate(preOrderFulfillmentDate),
    [preOrderFulfillmentDate]
  );

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
  const showAddToCart = !preOrderEnabled && !isComingSoon && !isOutOfStock;
  const showLegacyPreOrderBlock =
    !preOrderEnabled && (isComingSoon || isOutOfStock);

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
          {preOrderEnabled && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase text-brand-green shadow-sm">
              <Package className="w-3 h-3" />
              Pre-order
            </span>
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

          {preOrderEnabled && (
            <div className="mt-1.5 rounded-xl bg-brand-green/5 border border-dashed border-brand-green/40 p-2 text-[11px] text-gray-600">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-gray-500">
                <span>Pay today</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(preOrderDueNowPerUnit)}
                </span>
              </div>
              {preOrderBalancePerUnit > 0 && (
                <div className="flex items-center justify-between text-[10px] text-gray-500 mt-0.5">
                  <span>Balance on dispatch</span>
                  <span>{formatCurrency(preOrderBalancePerUnit)}</span>
                </div>
              )}
              {formattedFulfillmentDate && (
                <p className="mt-1 text-[10px] text-gray-500">
                  Est. ships {formattedFulfillmentDate}
                </p>
              )}
              {!isPreOrderWindowActive && (
                <p className="mt-1 text-[10px] text-amber-600 font-medium">
                  Pre-order window closed — notifications only.
                </p>
              )}
            </div>
          )}

          {reviewSummary && reviewSummary.reviewCount > 0 && (
            <div className="mt-2 md:mt-3 flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-xs md:text-base text-gray-600 min-h-[28px] md:min-h-[20px]">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      i < Math.round(reviewSummary.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-[10px] md:text-sm">
                ({reviewSummary.reviewCount}{" "}
                {reviewSummary.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <div
            className="mt-auto pt-0.5 md:pt-2 cart-controls flex flex-wrap items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {preOrderEnabled ? (
              <div className="w-full space-y-2">
                <span className="relative group block">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!isAuthenticated || !isPreOrderWindowActive) return;
                      try {
                        await preorderProduct(item.productId);
                        toast.success("Pre-order placed");
                      } catch (e) {
                        toast.error("Failed to place pre-order");
                      }
                    }}
                    disabled={!isAuthenticated || !isPreOrderWindowActive}
                    title={
                      !isAuthenticated
                        ? "Login required to pre-order"
                        : !isPreOrderWindowActive
                        ? "Pre-order window inactive"
                        : undefined
                    }
                    className="w-full inline-flex items-center justify-center gap-1 md:gap-2 bg-brand-green text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Package className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden md:inline">
                      {isPreOrderWindowActive
                        ? "Pre-order now"
                        : "Pre-orders closed"}
                    </span>
                    <span className="md:hidden">
                      {isPreOrderWindowActive ? "Pre-order" : "Closed"}
                    </span>
                  </button>
                  {!isAuthenticated && (
                    <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Login required
                    </div>
                  )}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500">
                    Deposit due today:{" "}
                    <strong className="text-gray-900">
                      {formatCurrency(preOrderDueNowPerUnit)}
                    </strong>
                  </span>
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

            {showLegacyPreOrderBlock && (
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
                    title={
                      !isAuthenticated
                        ? "Login required to pre‑order"
                        : undefined
                    }
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
