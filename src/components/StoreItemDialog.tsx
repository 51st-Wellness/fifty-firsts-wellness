import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Star,
  Package,
  Tag,
} from "lucide-react";
import type { StoreItem } from "../types/marketplace.types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextProvider";
import { fetchStoreItemById } from "../api/marketplace.api";

interface StoreItemDialogProps {
  item: StoreItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const StoreItemDialog: React.FC<StoreItemDialogProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { isAuthenticated } = useAuth();
  const {
    addToCart,
    updateCartItem,
    removeFromCart,
    getItemQuantity,
    isInCart,
  } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState<StoreItem | null>(item);
  const [loading, setLoading] = useState(false);

  // Fetch item by ID when dialog opens or item changes
  useEffect(() => {
    if (isOpen && item?.productId) {
      const fetchItem = async () => {
        try {
          setLoading(true);
          const response = await fetchStoreItemById(item.productId);
          if (response.data) {
            setCurrentItem(response.data);
          } else {
            setCurrentItem(item);
          }
        } catch (error) {
          console.error("Failed to fetch store item:", error);
          // Fallback to prop item if fetch fails
          setCurrentItem(item);
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    } else if (!isOpen) {
      setCurrentItem(null);
    } else {
      setCurrentItem(item);
    }
  }, [isOpen, item?.productId]);

  if (!isOpen || !currentItem) return null;

  // Derive cart type from item state so updates target the correct cart bucket.
  const dialogCartType = useMemo(
    () =>
      Boolean(currentItem.preOrderEnabled) && (currentItem.stock ?? 0) <= 0
        ? "preorders"
        : "orders",
    [currentItem.preOrderEnabled, currentItem.stock]
  );
  const imageUrl = currentItem.display?.url || currentItem.images?.[0] || "";
  const currentQuantity = getItemQuantity(currentItem.productId, dialogCartType);
  const inCart = isInCart(currentItem.productId, dialogCartType);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return;

    try {
      setItemLoading(true);
      await addToCart(currentItem.productId, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
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
        await removeFromCart(currentItem.productId, dialogCartType);
      } else {
        await updateCartItem(currentItem.productId, newQuantity, dialogCartType);
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
    } finally {
      setItemLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                {loading ? (
                  <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={currentItem.name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Featured Badge */}
                {currentItem.isFeatured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Featured
                  </div>
                )}

                {/* Stock Status */}
                <div className="absolute top-4 right-4">
                  <div className="bg-green-100/90 text-green-800 text-sm px-3 py-1.5 rounded-full font-medium backdrop-blur-sm shadow-lg">
                    {currentItem.stock > 0 ? `${currentItem.stock} in stock` : "Out of stock"}
                  </div>
                </div>
              </div>

              {/* Additional Images */}
              {currentItem.images && currentItem.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {currentItem.images.slice(1, 5).map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={img}
                        alt={`${currentItem.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentItem.name}
                </h1>
                <div className="text-4xl font-bold text-indigo-600">
                  £{currentItem.price.toFixed(2)}
                </div>
              </div>

              {/* Categories */}
              {currentItem.categories && currentItem.categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {currentItem.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {currentItem.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Product Info */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Product Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Stock:</span>
                    <span className="ml-2 font-medium">
                      {currentItem.stock > 0
                        ? `${currentItem.stock} available`
                        : "Out of stock"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 font-medium">
                      {currentItem.isPublished ? "Available" : "Coming Soon"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cart Actions */}
              <div className="space-y-4">
                {!inCart || currentQuantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={
                      itemLoading || !isAuthenticated || currentItem.stock === 0
                    }
                    className={`w-full rounded-2xl text-white flex gap-3 items-center justify-center py-4 px-6 text-lg font-medium transition-all duration-200 ${
                      justAdded
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {itemLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : justAdded ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <ShoppingCart className="w-6 h-6" />
                    )}
                    {justAdded ? "Added to Cart!" : "Add to Cart"}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <button
                        onClick={() =>
                          handleQuantityChange(currentQuantity - 1)
                        }
                        disabled={itemLoading}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>

                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {currentQuantity}
                        </div>
                        <div className="text-sm text-gray-500">in cart</div>
                      </div>

                      <button
                        onClick={() =>
                          handleQuantityChange(currentQuantity + 1)
                        }
                        disabled={itemLoading || currentQuantity >= currentItem.stock}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleQuantityChange(currentQuantity + 1)}
                      disabled={itemLoading || currentQuantity >= currentItem.stock}
                      className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex gap-3 items-center justify-center py-4 px-6 text-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-6 h-6" />
                      Add Another
                    </button>
                  </div>
                )}

                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 text-center">
                    Please log in to add items to your cart
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreItemDialog;
