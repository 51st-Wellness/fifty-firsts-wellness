import React from "react";
import { CiShoppingCart } from "react-icons/ci";
import StarRating from "./StarRating";
import type { StoreItem } from "../types/marketplace.types";

interface StoreItemCardProps {
  item: StoreItem;
  onAddToCart?: (item: StoreItem) => void;
}

// Reusable card for rendering a single store item
const StoreItemCard: React.FC<StoreItemCardProps> = ({ item, onAddToCart }) => {
  const imageUrl = item.display?.url || item.images?.[0] || ""; // pick cover image
  const title = item.name || "Product";
  const price = item.price ?? 0;

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
      <div className="flex items-center gap-2 mt-2">
        <StarRating rating={4.5} />
        <span className="text-xs sm:text-sm text-gray-500">(— reviews)</span>
      </div>
      <button
        onClick={() => onAddToCart && onAddToCart(item)}
        className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-2 px-4 mt-4 text-sm sm:text-base hover:bg-[#343494]"
      >
        <CiShoppingCart className="text-lg sm:text-xl" />
        Add to Cart
      </button>
    </article>
  );
};

export default StoreItemCard;
