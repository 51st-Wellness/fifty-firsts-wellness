import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import StoreItemCard from "./StoreItemCard";
import { fetchStoreItems } from "../api/marketplace.api";
import type { StoreItem } from "../types/marketplace.types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextProvider";
import { ResponseStatus } from "../types/response.types";

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

        if (response?.status === ResponseStatus.SUCCESS && response?.data) {
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

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (item: StoreItem) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      await addToCart(item.productId, 1);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
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
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
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
          <div key={item.productId} className="relative">
            <StoreItemCard item={item} onAddToCart={handleAddToCart} />
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
              Featured
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
