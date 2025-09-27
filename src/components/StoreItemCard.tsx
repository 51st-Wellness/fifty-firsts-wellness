import React, { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { Check, Plus, Minus } from "lucide-react";
import type { StoreItem } from "../types/marketplace.types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextProvider";

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
    isLoading,
  } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const currentQuantity = getItemQuantity(item.productId);
  const inCart = isInCart(item.productId);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Could show a login prompt here
      return;
    }

    try {
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
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(item.productId);
    } else {
      await updateCartItem(item.productId, newQuantity);
    }
  };

  return (
    <article className="flex border rounded-3xl p-4 flex-col hover:shadow-md transition-shadow">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto rounded-lg object-cover"
        />
      ) : (
        <div className="w-full aspect-video bg-gray-100 rounded-lg" />
      )}
      <div className="text-lg sm:text-xl mt-2 line-clamp-2">{title}</div>
      <div className="flex justify-between mt-2 items-center">
        <div className="text-lg sm:text-2xl font-medium">
          ${price.toFixed(2)}
        </div>
        <div className="flex gap-3 items-center">
          <div className="text-xs sm:text-sm font-medium text-[#229EFF] bg-[#E9F5FF] py-1 px-2 rounded">
            In stock
          </div>
        </div>
      </div>

      {/* Cart Controls */}
      {!inCart || currentQuantity === 0 ? (
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !isAuthenticated}
          className={`rounded-full text-white flex gap-2 items-center py-2 px-4 mt-4 text-sm sm:text-base transition-all duration-200 ${
            justAdded
              ? "bg-green-600 hover:bg-green-700"
              : "bg-[#4444B3] hover:bg-[#343494]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : justAdded ? (
            <Check className="text-lg sm:text-xl" />
          ) : (
            <CiShoppingCart className="text-lg sm:text-xl" />
          )}
          {justAdded ? "Added!" : "Add to Cart"}
        </button>
      ) : (
        <div className="flex items-center justify-between mt-4 p-2 bg-gray-50 rounded-full">
          <button
            onClick={() => handleQuantityChange(currentQuantity - 1)}
            disabled={isLoading}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white border hover:bg-gray-100 disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="text-sm font-medium px-4">
            {currentQuantity} in cart
          </span>

          <button
            onClick={() => handleQuantityChange(currentQuantity + 1)}
            disabled={isLoading}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white border hover:bg-gray-100 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </article>
  );
};

export default StoreItemCard;
