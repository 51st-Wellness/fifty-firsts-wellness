import React, { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { Check, Plus, Minus, Star, Eye, Tag } from "lucide-react";
import type { StoreItem } from "../types/marketplace.types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextProvider";
import StoreItemDialog from "./StoreItemDialog";

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
    updateCartItem,
    removeFromCart,
    getItemQuantity,
    isInCart,
    isLoading: globalLoading,
  } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      setJustAdded(true);

      // Reset the "just added" state after 2 seconds
      setTimeout(() => setJustAdded(false), 2000);

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

  const handleQuantityChange = async (newQuantity: number) => {
    try {
      setItemLoading(true);
      if (newQuantity <= 0) {
        await removeFromCart(item.productId);
      } else {
        await updateCartItem(item.productId, newQuantity);
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
    } finally {
      setItemLoading(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening dialog when clicking on cart buttons
    if ((e.target as HTMLElement).closest(".cart-controls")) {
      return;
    }
    setDialogOpen(true);
  };

  return (
    <>
      <article
        className="group relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border border-gray-200 rounded-3xl p-4 hover:shadow-2xl hover:scale-[1.02] hover:border-indigo-300 transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-300/50 flex flex-col h-full"
        onClick={handleCardClick}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/40 to-blue-100/40 rounded-full blur-3xl -z-0 group-hover:scale-150 transition-transform duration-500" />

        {/* Image Container - Fixed at top */}
        <div className="relative z-10 overflow-hidden rounded-2xl mb-3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 shadow-md group-hover:shadow-xl"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-md">
              <CiShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Featured Badge */}
          {item.isFeatured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2.5 py-1.5 rounded-full font-medium flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}

          {/* Stock Status */}
          <div className="absolute top-3 right-3">
            <div
              className={`text-xs px-2.5 py-1.5 rounded-full font-medium backdrop-blur-sm shadow-lg ${
                item.stock > 0
                  ? "bg-green-100/90 text-green-800"
                  : "bg-red-100/90 text-red-800"
              }`}
            >
              {item.stock > 0 ? "In stock" : "Out of stock"}
            </div>
          </div>
        </div>

        {/* Content - Flexible grow area */}
        <div className="relative z-10 flex flex-col gap-2 flex-1">
          {/* Categories */}
          {item.categories && item.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {item.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="text-[10px] font-medium text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {category}
                </span>
              ))}
              {item.categories.length > 2 && (
                <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  +{item.categories.length - 2}
                </span>
              )}
            </div>
          )}

          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
            {title}
          </h3>

          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Price and Cart Controls - Fixed at bottom */}
          <div className="mt-auto pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-indigo-600">
                ${price.toFixed(2)}
              </div>
            </div>

            {/* Cart Controls */}
            <div className="cart-controls" onClick={(e) => e.stopPropagation()}>
              {!inCart || currentQuantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={itemLoading || !isAuthenticated || item.stock === 0}
                  className={`w-full rounded-2xl text-white flex gap-2 items-center justify-center py-3 px-4 text-sm font-medium transition-all duration-200 ${
                    justAdded
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {itemLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : justAdded ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <CiShoppingCart className="w-4 h-4" />
                  )}
                  {justAdded ? "Added!" : "Add to Cart"}
                </button>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <button
                    onClick={() => handleQuantityChange(currentQuantity - 1)}
                    disabled={itemLoading}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <div className="text-sm font-semibold">
                      {currentQuantity}
                    </div>
                    <div className="text-xs text-gray-500">in cart</div>
                  </div>

                  <button
                    onClick={() => handleQuantityChange(currentQuantity + 1)}
                    disabled={itemLoading || currentQuantity >= item.stock}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Store Item Dialog */}
      <StoreItemDialog
        item={item}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default StoreItemCard;
