import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import Price from "../Price";

interface ProductInfoSectionProps {
  name: string;
  displayPrice: number;
  hasDiscount: boolean;
  averageRating: number;
  reviewCount: number;
  stock: number;
  description: string;
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  isAuthenticated: boolean;
  stockAvailable: boolean;
  strikePrice?: number;
  isFeatured?: boolean;
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  name,
  displayPrice,
  strikePrice,
  hasDiscount,
  averageRating,
  reviewCount,
  isFeatured,
  stock,
  description,
  quantity,
  maxQuantity,
  onQuantityChange,
  onAddToCart,
  isAuthenticated,
  stockAvailable,
}) => {
  return (
    <div className="mb-8 order-2 lg:order-1">
      <h1
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        {name}
      </h1>

      {/* Price & Discount */}
      <div className="flex items-center gap-3 mb-4">
        <Price price={displayPrice} oldPrice={strikePrice} />
        {hasDiscount && (
          <span className="px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-semibold">
            Save {Math.round(((strikePrice! - displayPrice) / strikePrice!) * 100)}%
          </span>
        )}
      </div>

      {/* Rating */}
      {reviewCount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
        </div>
      )}

      {/* Tags */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {isFeatured && (
          <span className="px-3 py-1 rounded-full bg-[#4444B3]/10 text-[#4444B3] text-xs font-semibold">
            Featured
          </span>
        )}
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          Amount in stock: {stock}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

      {/* Quantity Selector */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <div className="relative inline-flex items-center group">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="px-3 py-1.5 rounded-l-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            −
          </button>
          <span className="px-4 py-1.5 border-t border-b border-gray-300 bg-white text-gray-900 font-semibold min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="px-3 py-1.5 rounded-r-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
          {stock !== undefined && stock > 0 && quantity >= stock && (
            <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
              Only {stock} {stock === 1 ? "item" : "items"} available in stock
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <button
          onClick={onAddToCart}
          disabled={!isAuthenticated || !stockAvailable}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-green text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductInfoSection;

