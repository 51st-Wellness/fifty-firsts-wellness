import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import StoreItemCard from "./StoreItemCard";
import { fetchStoreItems } from "../api/marketplace.api";
import type { StoreItem } from "../types/marketplace.types";

interface FeaturedProductsProps {
  limit?: number;
  showTitle?: boolean;
  showDescription?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  limit = 8,
  showTitle = true,
  showDescription = true,
}) => {
  const [featuredItems, setFeaturedItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchStoreItems({
          page: 1,
          limit,
          isFeatured: true,
          isPublished: true,
        });

        if (response?.status?.toLowerCase() === "success" && response?.data) {
          setFeaturedItems(response.data.items || []);
        } else {
          setError(response?.message || "Failed to load featured products");
        }
      } catch (e: any) {
        console.error("Error loading featured items:", e);
        setError(
          e?.response?.data?.message || e?.message || "Network error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedItems();
  }, [limit]);

  const handleAddToCart = (item: StoreItem) => {
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", item);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 rounded-3xl">
        <div className="text-center mb-16">
          {showTitle && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured Products
            </h2>
          )}
          {showDescription && (
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our curated selection of wellness products designed to
              support your health and well-being journey.
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 rounded-3xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">
            Unable to load featured products at this time.
          </p>
        </div>
      </section>
    );
  }

  if (featuredItems.length === 0) {
    return (
      <section className="py-20 bg-gray-50 rounded-3xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            No featured products available at this time.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 rounded-3xl">
      <div className="text-center mb-16">
        {showTitle && (
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>
        )}
        {showDescription && (
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our curated selection of wellness products designed to
            support your health and well-being journey.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {featuredItems.map((item) => (
          <div
            key={item.productId}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative mb-4">
              {item.display?.url || item.images?.[0] ? (
                <img
                  src={item.display?.url || item.images?.[0]}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Featured
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.name}
            </h3>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#229EFF] bg-[#E9F5FF] py-1 px-2 rounded">
                In stock
              </div>
            </div>

            <button
              onClick={() => handleAddToCart(item)}
              className="w-full bg-brand-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
