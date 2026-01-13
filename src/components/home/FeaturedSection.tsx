import React, { useEffect, useState, useRef } from "react";
import { ShoppingCart, Heart, Loader } from "lucide-react";
import { fetchStoreItems } from "../../api/marketplace.api";
import type { StoreItem } from "../../types/marketplace.types";
import { useNavigate } from "react-router-dom";
import { getStoreItemPricing } from "../../utils/discounts";
import Price from "../Price";
import LazyImage from "../ui/LazyImage";

const FeaturedSection: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
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
          // Filter out products that are out of stock AND don't allow true pre-order
          const items = (response.data.items || []).filter((it: StoreItem) => {
            const stock = it.stock ?? 0;
            const canPreOrder =
              Boolean((it as any).preOrderEnabled) && stock < 1;
            const isOutOfStock = stock === 0;
            // Hide products that are out of stock and don't allow pre-order when out of stock
            return !(isOutOfStock && !canPreOrder);
          });
          setFeaturedItems(items);
        }
      } catch (error) {
        console.error("Error loading featured items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedItems();
  }, []);

  // Auto-scroll functionality for mobile carousel
  useEffect(() => {
    // Only auto-scroll on mobile (when items exist and we're showing carousel)
    if (featuredItems.length <= 1 || isPaused) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      return;
    }

    // Set up auto-scroll interval
    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Loop back to 0 when reaching the end
        return prevIndex === featuredItems.length - 1 ? 0 : prevIndex + 1;
      });
    }, 3500); // 3.5 seconds

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [featuredItems.length, isPaused]);

  const handleCardClick = (item: StoreItem) => {
    const imageUrl = item.display?.url || item.images?.[0] || "";
    navigate(`/products/${item.productId}`, {
      state: { cover: imageUrl, images: item.images },
    });
  };

  // Swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true); // Pause auto-scroll when user starts touching
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      // Resume auto-scroll if no swipe was detected
      setIsPaused(false);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < featuredItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    
    // Resume auto-scroll after a short delay
    setTimeout(() => {
      setIsPaused(false);
    }, 1000);
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
            <p className="text-white text-lg">
              No featured products available at this time.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Grid Layout */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredItems.slice(0, 4).map((item) => {
                const imageUrl = item.display?.url || item.images?.[0] || "";
                const pricing = getStoreItemPricing(item);
                const hasReviews = item.reviews && item.reviews.length > 0;
                const averageRating = hasReviews
                  ? item.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                    item.reviews.length
                  : 0;

                return (
                  <div
                    key={item.productId}
                    className="bg-white rounded-2xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleCardClick(item)}
                  >
                    <div className="relative w-full h-40 sm:h-44 bg-gray-100 rounded-xl overflow-hidden">
                      {imageUrl ? (
                        <LazyImage
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
                      <h3 className="text-base font-normal text-gray-900 leading-snug line-clamp-2 font-primary h-[48px] flex items-start">
                        {item.name}
                      </h3>
                      <div className="mt-4 flex items-center justify-between min-h-[28px]">
                        <Price
                          price={pricing.currentPrice ?? item.price ?? 0}
                          oldPrice={
                            pricing.hasDiscount
                              ? pricing.basePrice
                              : item.oldPrice
                          }
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 min-h-[20px]">
                        {hasReviews ? (
                          <span className="text-gray-600">
                            {averageRating.toFixed(1)} ({item.reviews.length}{" "}
                            review{item.reviews.length !== 1 ? "s" : ""})
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

            {/* Mobile Swipeable Carousel */}
            <div className="sm:hidden">
              <div
                ref={carouselRef}
                className="relative overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {featuredItems.slice(0, 4).map((item) => {
                    const imageUrl = item.display?.url || item.images?.[0] || "";
                    const pricing = getStoreItemPricing(item);
                    const hasReviews = item.reviews && item.reviews.length > 0;
                    const averageRating = hasReviews
                      ? item.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                        item.reviews.length
                      : 0;

                    return (
                      <div
                        key={item.productId}
                        className="w-full flex-shrink-0 px-2"
                      >
                        <div
                          className="bg-white rounded-2xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => handleCardClick(item)}
                        >
                          <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden">
                            {imageUrl ? (
                              <LazyImage
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
                            <h3 className="text-base font-normal text-gray-900 leading-snug line-clamp-2 font-primary h-[48px] flex items-start">
                              {item.name}
                            </h3>
                            <div className="mt-4 flex items-center justify-between min-h-[28px]">
                              <Price
                                price={pricing.currentPrice ?? item.price ?? 0}
                                oldPrice={
                                  pricing.hasDiscount
                                    ? pricing.basePrice
                                    : item.oldPrice
                                }
                              />
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 min-h-[20px]">
                              {hasReviews ? (
                                <span className="text-gray-600">
                                  {averageRating.toFixed(1)} ({item.reviews.length}{" "}
                                  review{item.reviews.length !== 1 ? "s" : ""})
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
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Dots Indicator */}
              {featuredItems.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {featuredItems.slice(0, 4).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setIsPaused(true);
                        // Resume auto-scroll after clicking a dot
                        setTimeout(() => {
                          setIsPaused(false);
                        }, 1000);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-brand-green w-6"
                          : "bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;
