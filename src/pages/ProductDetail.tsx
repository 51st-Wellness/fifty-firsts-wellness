import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchStoreItemById } from "../api/marketplace.api";
import type { StoreItem } from "../types/marketplace.types";
import NotificationOptIn from "../components/NotificationOptIn";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextProvider";
import Price from "../components/Price";
import StoreItemCard from "../components/StoreItemCard";
import { fetchStoreItems } from "../api/marketplace.api";
import SubmitReviewModal from "../components/SubmitReviewModal";
import AllReviewsModal from "../components/AllReviewsModal";
import { getStoreItemPricing } from "../utils/discounts";
import { useGlobalDiscount } from "../context/GlobalDiscountContext";
import toast from "react-hot-toast";
import { getProductReviews, getProductReviewSummary } from "../api/review.api";
import type { ProductReview, ReviewSummary } from "../types/review.types";

const ProductDetail: React.FC = () => {
  const { productId } = useParams();
  const [item, setItem] = useState<StoreItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageFade, setImageFade] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Ensure quantity doesn't exceed stock when item changes
  useEffect(() => {
    if (item && item.stock !== undefined) {
      const maxStock = item.stock > 0 ? item.stock : 1;
      setQuantity((prev) => Math.min(prev, maxStock));
    }
  }, [item]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewCarouselIndex, setReviewCarouselIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<StoreItem[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(
    null
  );
  const [loadingReviews, setLoadingReviews] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { globalDiscount } = useGlobalDiscount();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const res = await fetchStoreItemById(productId);
        setItem(res.data!);
        setSelectedImageIndex(0);
        setImageFade(true);
        document.title = `${
          res.data?.name ?? "Product"
        } • Fifty Firsts Wellness`;

        // Fetch related products
        const relatedRes = await fetchStoreItems({
          limit: 4,
          isPublished: true,
        });
        setRelatedProducts(
          relatedRes.data?.items
            ?.filter((p) => p.productId !== productId)
            .slice(0, 4) || []
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  // Fetch reviews for the product
  useEffect(() => {
    (async () => {
      if (!productId) return;
      try {
        setLoadingReviews(true);
        const [reviewsRes, summaryRes] = await Promise.all([
          getProductReviews(productId, { limit: 10 }),
          getProductReviewSummary(productId),
        ]);

        if (reviewsRes.status === "success" && reviewsRes.data?.reviews) {
          setReviews(reviewsRes.data.reviews);
        }

        if (summaryRes.status === "success" && summaryRes.data) {
          setReviewSummary(summaryRes.data);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    })();
  }, [productId]);

  // Auto-advance reviews carousel every 10 seconds
  useEffect(() => {
    if (reviews.length <= 2) return; // Don't auto-advance if 2 or fewer reviews

    const maxIndex = Math.ceil(reviews.length / 2) - 1;
    const interval = setInterval(() => {
      setReviewCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [reviews.length]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <h1
            className="text-xl font-semibold text-gray-900 mb-2"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Product not found
          </h1>
          <p className="text-gray-600 mb-6">
            The item you’re looking for may have been moved or is unavailable.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-green text-white font-semibold hover:bg-brand-green-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>
      </main>
    );
  }

  // Use display image as main image, and item.images as additional images
  // Similar to how ManagementMarketplace handles it
  const displayImage = item.display?.url || "";
  const additionalImages = item.images || [];
  
  // Combine display image with additional images, ensuring display image is first
  // Always include all images, even if display image is in the additional images array
  const allImages = displayImage 
    ? [displayImage, ...additionalImages.filter(img => img && img !== displayImage && img.trim() !== "")]
    : additionalImages.filter(img => img && img.trim() !== "");
  
  const mainImage = allImages[selectedImageIndex] || displayImage || additionalImages[0] || "";

  // Handle image transition with fade effect
  const handleImageChange = (index: number) => {
    if (index === selectedImageIndex) return;
    setImageFade(false);
    setTimeout(() => {
      setSelectedImageIndex(index);
      setImageFade(true);
    }, 150);
  };

  const defaultDescription =
    "We're here to help! Whether you have a question about our services, need assistance with your wellness journey, or want to learn more about what we offer, our team is ready to assist you.";
  const defaultUsage =
    "Follow the included instructions for best results. This product is designed for daily use and can be incorporated into your wellness routine. Store in a cool, dry place and keep away from direct sunlight.";
  const defaultBenefits =
    "This product offers numerous benefits including improved wellness, enhanced daily routines, and a sense of calm and balance. Our carefully curated selection ensures you receive the highest quality items designed to support your holistic health journey.";

  const descriptionContent = item.description?.trim() || defaultDescription;
  const productUsage = (item as any).productUsage?.trim() || defaultUsage;
  const productBenefits =
    (item as any).productBenefits?.trim() || defaultBenefits;
  const productIngredients =
    ((item as any).productIngredients as string[] | undefined)?.filter(
      (ingredient) =>
        typeof ingredient === "string" && ingredient.trim().length > 0
    ) || [];
  const hasIngredients = productIngredients.length > 0;
  const pricing = getStoreItemPricing(item, { globalDiscount });
  const displayPrice = pricing.currentPrice ?? item.price ?? 0;
  const strikePrice = pricing.hasDiscount ? pricing.basePrice : item.oldPrice;

  const averageRating = reviewSummary?.averageRating || 0;
  const reviewCount = reviewSummary?.reviewCount || reviews.length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Desktop: Image Gallery, Benefits, Ingredients */}
        {/* Mobile: Gallery first */}
        <div className="order-1 lg:order-1">
          {/* Image Gallery */}
          <div className="mb-8 lg:mb-8">
            <div className="bg-white rounded-2xl overflow-hidden mb-4 relative" style={{ aspectRatio: "1", minHeight: "250px", maxHeight: "350px" }}>
              <style>{`
                @media (min-width: 768px) {
                  .product-image-container {
                    min-height: 400px !important;
                    max-height: 600px !important;
                  }
                }
              `}</style>
              <div className="product-image-container" style={{ aspectRatio: "1", minHeight: "250px", maxHeight: "350px", position: "relative", width: "100%" }}>
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    style={{ 
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      opacity: imageFade ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out"
                    }}
                    key={selectedImageIndex}
                  />
                ) : (
                  <div className="h-full bg-gray-100 flex items-center justify-center" style={{ minHeight: "250px" }}>
                    <ShoppingCart className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleImageChange(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-brand-green"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${item.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Ingredients - Desktop only (mobile moved below) */}
          {hasIngredients && (
            <div className="hidden lg:block">
              <h2
                className="text-xl font-semibold text-gray-900 mb-4"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Product Ingredients
              </h2>
              <ul className="space-y-2 text-gray-600">
                {productIngredients.map((ingredient, idx) => (
                  <li key={`${ingredient}-${idx}`}>• {ingredient}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column - Desktop: Product Info, Description, Usage */}
        {/* Mobile: Product Info, Description, Usage, then Benefits, Ingredients */}
        <div className="order-2 lg:order-2">
          {/* Product Info */}
          <div className="mb-8 order-2 lg:order-1">
            <h1
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              {item.name}
            </h1>

            {/* Price & Discount */}
            <div className="flex items-center gap-3 mb-4">
              <Price price={displayPrice} oldPrice={strikePrice} />
              {pricing.hasDiscount && (
                <span className="px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-semibold">
                  Save {pricing.discountPercent}%
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
              {item.isFeatured && (
                <span className="px-3 py-1 rounded-full bg-[#4444B3]/10 text-[#4444B3] text-xs font-semibold">
                  Featured
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Amount in stock: {item.stock}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {descriptionContent}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-medium">
                  {quantity}
                </span>
                <span className="relative group">
                  <button
                    onClick={() => {
                      const maxQuantity = item.stock && item.stock > 0 ? item.stock : Infinity;
                      setQuantity(Math.min(maxQuantity, quantity + 1));
                    }}
                    disabled={item.stock !== undefined && item.stock > 0 && quantity >= item.stock}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      item.stock !== undefined && item.stock > 0 && quantity >= item.stock
                        ? `Only ${item.stock} ${item.stock === 1 ? "item" : "items"} available in stock`
                        : undefined
                    }
                  >
                    +
                  </button>
                  {item.stock !== undefined && item.stock > 0 && quantity >= item.stock && (
                    <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      Only {item.stock} {item.stock === 1 ? "item" : "items"} available in stock
                    </div>
                  )}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => addToCart(item.productId, quantity)}
                disabled={!isAuthenticated || item.stock === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-green text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              {/* Note: Reviews can only be submitted from order history for verified purchases */}
            </div>
          </div>

          {/* Product Usage */}
          <div className="mb-8 order-3 lg:order-2">
            <h2
              className="text-xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Product Usage
            </h2>
            <p className="text-gray-600 leading-relaxed">{productUsage}</p>
          </div>

          {/* Product Benefits */}
          <div className="order-4 lg:order-3">
            <h2
              className="text-xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Product Benefits
            </h2>
            <p className="text-gray-600 leading-relaxed">{productBenefits}</p>
          </div>
        </div>

        {/* Mobile: Benefits and Ingredients after Usage */}
        <div className="lg:hidden order-5">
          {/* Product Benefits */}
          <div className="mb-8">
            <h2
              className="text-xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Product Benefits
            </h2>
            <p className="text-gray-600 leading-relaxed">{productBenefits}</p>
          </div>

          {/* Product Ingredients */}
          {hasIngredients && (
            <div>
              <h2
                className="text-xl font-semibold text-gray-900 mb-4"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Product Ingredients
              </h2>
              <ul className="space-y-2 text-gray-600">
                {productIngredients.map((ingredient, idx) => (
                  <li key={`mobile-${ingredient}-${idx}`}>• {ingredient}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section - Horizontal Scrolling Carousel */}
      {reviewCount > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-semibold text-gray-900"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Customer Reviews
            </h2>
          </div>

          {loadingReviews ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-green border-t-transparent"></div>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="relative">
              {/* Reviews Carousel */}
              <div className="overflow-hidden">
                <div
                  className="flex gap-4 transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${reviewCarouselIndex * 100}%)`,
                  }}
                >
                  {/* Group reviews into slides: 1 per slide on mobile, 2 per slide on desktop */}
                  {Array.from({ length: Math.ceil(reviews.length / 2) }).map(
                    (_, slideIndex) => {
                      const slideReviews = reviews.slice(
                        slideIndex * 2,
                        slideIndex * 2 + 2
                      );
                      return (
                        <div
                          key={slideIndex}
                          className="flex-shrink-0 w-full flex gap-4"
                        >
                          {slideReviews.length > 0
                            ? slideReviews.map((review) => (
                                <div
                                  key={review.id}
                                  className="flex-shrink-0 w-full md:w-[calc(50%-0.5rem)] bg-white border border-gray-200 rounded-xl p-4"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900">
                                      {review.author.name || "Anonymous"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        review.createdAt
                                      ).toLocaleDateString("en-GB", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                    {review.comment || ""}
                                  </p>
                                </div>
                              ))
                            : null}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Navigation Dots */}
              {reviews.length > 2 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {Array.from({ length: Math.ceil(reviews.length / 2) }).map(
                    (_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setReviewCarouselIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === reviewCarouselIndex
                            ? "bg-brand-green"
                            : "bg-gray-300"
                        }`}
                        aria-label={`Go to review page ${idx + 1}`}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Related Products */}
      <section>
        <h2
          className="text-2xl font-semibold text-gray-900 mb-6"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Related Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <StoreItemCard key={product.productId} item={product} />
          ))}
        </div>
      </section>

      {/* Note: Review submission is only available from order history for verified purchases */}
    </main>
  );
};

export default ProductDetail;
