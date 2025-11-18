import React, { useEffect, useState } from "react";
import { ShoppingCart, Heart, Loader } from "lucide-react";
import { fetchStoreItems } from "../../api/marketplace.api";
import type { StoreItem } from "../../types/marketplace.types";
import { useNavigate } from "react-router-dom";
import { getStoreItemPricing } from "../../utils/discounts";
import Price from "../Price";

const FeaturedSection: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeaturedItems = async () => {
      setLoading(true);
      try {
        const response = await fetchStoreItems({
          page: 1,
          limit: 4,
          isFeatured: true,
          isPublished: true,
        });

        if (response?.status?.toLowerCase() === "success" && response?.data) {
          setFeaturedItems(response.data.items || []);
        }
      } catch (error) {
        console.error("Error loading featured items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedItems();
  }, []);

  const handleCardClick = (item: StoreItem) => {
    const imageUrl = item.display?.url || item.images?.[0] || "";
    navigate(`/products/${item.productId}`, {
      state: { cover: imageUrl, images: item.images },
    });
  };

  return (
    <section className="relative z-0 w-full pt-48 sm:pt-56 lg:-mt-48 md:-mt-60 pb-24 sm:pb-28 bg-[#580F41]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2
            className="text-white text-3xl sm:text-4xl font-normal"
            style={{ fontFamily: '"Lilita One", sans-serif' }}
          >
            Wellness Products
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto mt-2 rounded-full" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : featuredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">No featured products available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredItems.slice(0, 4).map((item) => {
              const imageUrl = item.display?.url || item.images?.[0] || "";
              const pricing = getStoreItemPricing(item);
              const hasReviews = item.reviews && item.reviews.length > 0;
              const averageRating = hasReviews
                ? item.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / item.reviews.length
                : 0;

              return (
                <div
                  key={item.productId}
                  className="bg-white rounded-2xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="relative w-full h-40 sm:h-44 bg-gray-100 rounded-xl overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingCart className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="text-base font-normal text-gray-900 leading-snug line-clamp-2 font-primary min-h-[30px]">
                      {item.name}
                    </h3>
                    <div className="mt-4 flex items-center justify-between min-h-[28px]">
                      <Price
                        price={pricing.currentPrice ?? item.price ?? 0}
                        oldPrice={pricing.hasDiscount ? pricing.basePrice : item.oldPrice}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 min-h-[20px]">
                      {hasReviews ? (
                        <span className="text-gray-600">
                          {averageRating.toFixed(1)} ({item.reviews.length} review{item.reviews.length !== 1 ? "s" : ""})
                        </span>
                      ) : (
                        <span className="text-gray-500">NO REVIEWS YET</span>
                      )}
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(item);
                        }}
                        className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors w-full justify-center"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        View Product
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;


