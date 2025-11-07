import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchStoreItemById } from "../api/marketplace.api";
import type { StoreItem } from "../types/marketplace.types";
import NotificationOptIn from "../components/NotificationOptIn";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextProvider";
import Price from "../components/Price";
import StoreItemCard from "../components/StoreItemCard";
import { fetchStoreItems } from "../api/marketplace.api";
import SubmitReviewModal from "../components/SubmitReviewModal";
import toast from "react-hot-toast";

const ProductDetail: React.FC = () => {
  const { productId } = useParams();
  const [item, setItem] = useState<StoreItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewCarouselIndex, setReviewCarouselIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<StoreItem[]>([]);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const res = await fetchStoreItemById(productId);
        setItem(res.data!);
        document.title = `${res.data?.name ?? "Product"} • Fifty Firsts Wellness`;
        
        // Fetch related products
        const relatedRes = await fetchStoreItems({ limit: 4, isPublished: true });
        setRelatedProducts(relatedRes.data?.items?.filter(p => p.productId !== productId).slice(0, 4) || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  // Auto-advance reviews carousel every 10 seconds - must be before any early returns
  useEffect(() => {
    const interval = setInterval(() => {
      const maxIndex = Math.ceil(4 / 2) - 1; // 4 reviews, 2 per slide
      setReviewCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

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
          <h1 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: '"League Spartan", sans-serif' }}>Product not found</h1>
          <p className="text-gray-600 mb-6">The item you’re looking for may have been moved or is unavailable.</p>
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

  // Use same image logic as StoreItemCard and also fall back to navigation state
  const state = (location as any)?.state as { cover?: string; images?: string[] } | undefined;
  const imageUrl = item.display?.url || item.images?.[0] || state?.cover || "";
  const images = item.images && item.images.length
    ? item.images
    : (state?.images && state.images.length ? state.images : (item.display?.url ? [item.display.url] : (state?.cover ? [state.cover] : [])));
  const mainImage = images[selectedImageIndex] || imageUrl || "";

  // Demo reviews data
  const reviews = [
    {
      id: "1",
      author: "Maria Jacobs",
      rating: 5,
      comment: "This is 10/10 super amazing. Lorem ipsum dolor sit amet, consectetur adipiscing elit. The quality is outstanding and I would definitely recommend this to everyone!",
      date: "12 May, 2025",
      verified: true,
    },
    {
      id: "2",
      author: "John Smith",
      rating: 5,
      comment: "Absolutely love this product! It exceeded my expectations in every way. The packaging was beautiful and the product itself is fantastic.",
      date: "8 May, 2025",
      verified: true,
    },
    {
      id: "3",
      author: "Sarah Williams",
      rating: 4,
      comment: "Great product overall. The quality is good and it arrived quickly. Would purchase again.",
      date: "5 May, 2025",
      verified: false,
    },
    {
      id: "4",
      author: "David Brown",
      rating: 5,
      comment: "Perfect! Exactly as described. Highly recommend this product to anyone looking for quality items.",
      date: "1 May, 2025",
      verified: true,
    },
  ];

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const handleReviewSubmit = (review: { rating: number; comment: string }) => {
    toast.success("Thank you for your review!");
    // Here you would typically send the review to the backend
    console.log("Review submitted:", review);
  };

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
            <div className="bg-white rounded-2xl overflow-hidden mb-4">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={item.name}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="h-96 bg-gray-100 flex items-center justify-center">
                  <ShoppingCart className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
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

          {/* Product Benefits - Desktop only (mobile moved below) */}
          <div className="mb-8 hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Product Benefits
            </h2>
            <p className="text-gray-600 leading-relaxed">
              This product offers numerous benefits including improved wellness, enhanced daily routines, and a sense of calm and balance. Our carefully curated selection ensures you receive the highest quality items designed to support your holistic health journey.
            </p>
          </div>

          {/* Product Ingredients - Desktop only (mobile moved below) */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Product Ingredients
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Natural and organic ingredients</li>
              <li>• Ethically sourced materials</li>
              <li>• No harmful chemicals</li>
              <li>• Sustainable production methods</li>
              <li>• Cruelty-free certified</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Desktop: Product Info, Description, Usage */}
        {/* Mobile: Product Info, Description, Usage, then Benefits, Ingredients */}
        <div className="order-2 lg:order-2">
          {/* Product Info */}
          <div className="mb-8 order-2 lg:order-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              {item.name}
            </h1>

            {/* Price & Discount */}
            <div className="flex items-center gap-3 mb-4">
              <Price price={item.price} oldPrice={item.oldPrice} />
            </div>

            {/* Rating */}
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
              <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
            </div>

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
              {item.description || "We're here to help! Whether you have a question about our services, need assistance with your wellness journey, or want to learn more about what we offer, our team is ready to assist you."}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
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
              <span className="relative group flex-1">
                <button
                  onClick={() => setReviewModalOpen(true)}
                  disabled={!isAuthenticated}
                  title={!isAuthenticated ? "Login required to submit a review" : undefined}
                  className="w-full inline-flex items-center justify-center gap-2 border border-brand-green text-brand-green px-6 py-3 rounded-full font-semibold hover:bg-brand-green/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
                {!isAuthenticated && (
                  <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Login required
                  </div>
                )}
              </span>
            </div>
          </div>

          {/* Product Description */}
          <div className="mb-8 order-3 lg:order-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Product Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We're here to help! Whether you have a question about our services, need assistance with your wellness journey, or want to learn more about what we offer, our team is ready to assist you. Reach out to us through any of the channels below, and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* Product Usage */}
          <div className="order-4 lg:order-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Product Usage
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Follow the included instructions for best results. This product is designed for daily use and can be incorporated into your wellness routine. Store in a cool, dry place and keep away from direct sunlight.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We're here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you.
            </p>
          </div>
        </div>

        {/* Mobile: Benefits and Ingredients after Usage */}
        <div className="lg:hidden order-5">
          {/* Product Benefits */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Product Benefits
            </h2>
            <p className="text-gray-600 leading-relaxed">
              This product offers numerous benefits including improved wellness, enhanced daily routines, and a sense of calm and balance. Our carefully curated selection ensures you receive the highest quality items designed to support your holistic health journey.
            </p>
          </div>

          {/* Product Ingredients */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Product Ingredients
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Natural and organic ingredients</li>
              <li>• Ethically sourced materials</li>
              <li>• No harmful chemicals</li>
              <li>• Sustainable production methods</li>
              <li>• Cruelty-free certified</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section - Horizontal Scrolling Carousel */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            Customer Reviews
          </h2>
        </div>

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
              {Array.from({ length: Math.ceil(reviews.length / 2) }).map((_, slideIndex) => {
                const slideReviews = reviews.slice(slideIndex * 2, slideIndex * 2 + 2);
                return (
                  <div key={slideIndex} className="flex-shrink-0 w-full flex gap-4">
                    {slideReviews.length > 0 ? (
                      slideReviews.map((review) => (
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
                          <span className="font-semibold text-gray-900">{review.author}</span>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">{review.comment}</p>
                        {review.verified && (
                          <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            Verified Purchase
                          </span>
                        )}
                        </div>
                      ))
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(reviews.length / 2) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setReviewCarouselIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === reviewCarouselIndex ? "bg-brand-green" : "bg-gray-300"
                }`}
                aria-label={`Go to review page ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6" style={{ fontFamily: '"League Spartan", sans-serif' }}>
          Related Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <StoreItemCard key={product.productId} item={product} />
          ))}
        </div>
      </section>

      {/* Submit Review Modal */}
      <SubmitReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productName={item.name}
        onSubmit={handleReviewSubmit}
      />
    </main>
  );
};

export default ProductDetail;
