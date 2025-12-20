import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchStoreItemById } from "../../api/marketplace.api";
import type { StoreItem } from "../../types/marketplace.types";
import NotificationOptIn from "../../components/NotificationOptIn";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContextProvider";
import Price from "../../components/Price";
import StoreItemCard from "../../components/StoreItemCard";
import { fetchStoreItems } from "../../api/marketplace.api";
import SubmitReviewModal from "../../components/SubmitReviewModal";
import AllReviewsModal from "../../components/AllReviewsModal";
import { getStoreItemPricing } from "../../utils/discounts";
import { useGlobalDiscount } from "../../context/GlobalDiscountContext";
import toast from "react-hot-toast";
import { getProductReviews, getProductReviewSummary } from "../../api/review.api";
import type { ProductReview, ReviewSummary } from "../../types/review.types";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import ProductInfoSection from "../../components/product/ProductInfoSection";

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

  // Fetch related products by category (fetched last, after product and reviews)
  useEffect(() => {
    (async () => {
      // Wait for product to load and reviews to finish loading
      if (!item || !productId || loadingReviews) return;
      
      // Get the first category from the product's categories array
      const productCategory = item.categories && item.categories.length > 0 
        ? item.categories[0] 
        : null;
      
      // Only fetch if product has a category
      if (!productCategory) {
        setRelatedProducts([]);
        return;
      }

      try {
        const relatedRes = await fetchStoreItems({
          limit: 5, // Fetch 5 to account for filtering out current product
          isPublished: true,
          category: productCategory,
        });
        
        // Filter out current product and limit to 4
        setRelatedProducts(
          relatedRes.data?.items
            ?.filter((p) => p.productId !== productId)
            .slice(0, 4) || []
        );
      } catch (error) {
        console.error("Failed to load related products:", error);
        setRelatedProducts([]);
      }
    })();
  }, [item, productId, loadingReviews]);

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
  const rawProductUsage = (item as any).productUsage?.trim() || defaultUsage;
  const rawProductBenefits =
    (item as any).productBenefits?.trim() || defaultBenefits;
  const splitToLines = (value: string) =>
    value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  const productUsageLines = splitToLines(rawProductUsage);
  const productBenefitsLines = splitToLines(rawProductBenefits);
  // Use listType from item if available, otherwise infer from line count
  const getIsList = (
    lines: string[],
    listType?: "paragraph" | "list"
  ): boolean => {
    if (listType === "list") return true;
    if (listType === "paragraph") return false;
    // Fallback: infer from line count (for backward compatibility)
    return lines.length > 1;
  };
  const productUsageIsList = getIsList(
    productUsageLines,
    (item as any).productUsageListType
  );
  const productBenefitsIsList = getIsList(
    productBenefitsLines,
    (item as any).productBenefitsListType
  );
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
        {/* Left Column - Desktop: Image Gallery, Ingredients */}
        {/* Mobile: Gallery first */}
        <div className="order-1 lg:order-1">
          {/* Image Gallery */}
          <ProductImageGallery
            images={allImages}
            selectedIndex={selectedImageIndex}
            productName={item.name}
            onImageSelect={handleImageChange}
            imageFade={imageFade}
          />

          {/* Product Ingredients - Desktop only (mobile moved below) */}
          {hasIngredients && (
            <div className="hidden lg:block">
              <h2
                className="text-xl font-semibold text-gray-900 mb-4"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Product Ingredients
              </h2>
              <ul className="list-disc list-outside text-gray-600 space-y-1 pl-5">
                {productIngredients.map((ingredient, idx) => (
                  <li key={`${ingredient}-${idx}`}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column - Desktop: Product Info, Description, Usage */}
        {/* Mobile: Product Info, Description, Usage, then Benefits, Ingredients */}
        <div className="order-2 lg:order-2">
          {/* Product Info */}
          <ProductInfoSection
            name={item.name}
            displayPrice={displayPrice}
            strikePrice={strikePrice}
            hasDiscount={pricing.hasDiscount}
            averageRating={averageRating}
            reviewCount={reviewCount}
            isFeatured={item.isFeatured}
            stock={item.stock}
            description={descriptionContent}
            quantity={quantity}
            maxQuantity={item.stock > 0 ? item.stock : 1}
            onQuantityChange={(newQuantity: number) => {
              const maxQty = item.stock > 0 ? item.stock : 1;
              setQuantity(Math.min(maxQty, Math.max(1, newQuantity)));
            }}
            onAddToCart={() => addToCart(item.productId, quantity)}
            isAuthenticated={isAuthenticated}
            stockAvailable={item.stock > 0}
          />

          {/* Product Usage */}
          <div className="mb-8 order-3 lg:order-2">
            <h2
              className="text-xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Product Usage
            </h2>
            {productUsageIsList ? (
              <ul className="list-disc list-outside text-gray-600 space-y-1 pl-5">
                {productUsageLines.map((line, idx) => (
                  <li key={`usage-${idx}`}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 leading-relaxed">
                {productUsageLines[0] || rawProductUsage}
              </p>
            )}
          </div>

          {/* Product Benefits (desktop only; mobile version below) */}
          <div className="order-4 lg:order-3 hidden lg:block">
            <h2
              className="text-xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Product Benefits
            </h2>
            {productBenefitsIsList ? (
              <ul className="list-disc list-outside text-gray-600 space-y-1 pl-5">
                {productBenefitsLines.map((line, idx) => (
                  <li key={`benefit-${idx}`}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 leading-relaxed">
                {productBenefitsLines[0] || rawProductBenefits}
              </p>
            )}
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
            {productBenefitsIsList ? (
              <ul className="list-disc list-outside text-gray-600 space-y-1 pl-5">
                {productBenefitsLines.map((line, idx) => (
                  <li key={`benefit-mobile-${idx}`}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 leading-relaxed">
                {productBenefitsLines[0] || rawProductBenefits}
              </p>
            )}
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
              <ul className="list-disc list-outside text-gray-600 space-y-1 pl-5">
                {productIngredients.map((ingredient, idx) => (
                  <li key={`mobile-${ingredient}-${idx}`}>{ingredient}</li>
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
