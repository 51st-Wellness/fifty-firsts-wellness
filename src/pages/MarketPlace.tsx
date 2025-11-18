import React, { useEffect, useMemo, useState, useCallback } from "react";
import { AlertCircle, RefreshCw, Search, ChevronDown } from "lucide-react";
import Footer from "../components/Footer";
import StoreItemCard from "../components/StoreItemCard";
import { fetchStoreItems } from "../api/marketplace.api";
import { categoryAPI } from "../api/category.api";
import { getProductReviewSummaries } from "../api/review.api";
import type { StoreItem as StoreItemType } from "../types/marketplace.types";
import type { Category } from "../types/category.types";
import type { ReviewSummary } from "../types/review.types";
import { getStoreItemPricing } from "../utils/discounts";

// Using shared StoreItem type from types to match API response

interface MarketPlaceProps {
  onSearch?: (query: string) => void;
}

const MarketPlace: React.FC<MarketPlaceProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [items, setItems] = useState<StoreItemType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewSummaries, setReviewSummaries] = useState<
    Record<string, ReviewSummary>
  >({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<number>(10);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [priceDropdownOpen, setPriceDropdownOpen] = useState<boolean>(false);
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState<boolean>(false);

  // Category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  // Demo items to showcase discount/preorder/notify states
  const demoItems = useMemo<StoreItemType[]>(
    () => [
      {
        productId: "demo-preorder-1" as any,
        name: "Mindful Tea Set",
        price: 34.99,
        oldPrice: 49.99,
        display: {
          url: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80",
        } as any,
        images: [
          "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80",
          "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=800&q=80",
        ],
        stock: 50,
        // custom field consumed in card
        // @ts-ignore
        status: "coming_soon",
      },
      {
        productId: "demo-notify-1" as any,
        name: "Aromatherapy Candle",
        price: 14.99,
        oldPrice: 24.99,
        display: {
          url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
        } as any,
        images: [
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
        ],
        stock: 0,
      },
      {
        productId: "demo-discount-1" as any,
        name: "Yoga Mat Pro",
        price: 29.99,
        oldPrice: 59.99,
        display: {
          url: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80",
        } as any,
        images: [
          "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80",
        ],
        stock: 0,
      },
    ],
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch categories on component mount
  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);

    try {
      const response = await categoryAPI.getAll({ service: "store" });
      console.log("Categories response:", response);

      if (response?.data) {
        setCategories(response.data);
        setCategoriesError(null);
      } else {
        setCategoriesError("Failed to load categories");
        setCategories([]);
      }
    } catch (e: any) {
      console.error("Error loading categories:", e);
      const errorMessage =
        e?.response?.data?.message || e?.message || "Failed to load categories";
      setCategoriesError(errorMessage);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadItems = useCallback(
    async (opts: any = {}) => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: opts.page ?? page,
          limit: pageSize,
          search: opts.search ?? (debouncedQuery || undefined),
          isPublished: true,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
        };

        console.log("Loading items with params:", params);

        const response = await fetchStoreItems(params);

        const { items: newItems, pagination } = response.data!;

        if (opts.reset) {
          setItems(newItems || []);
        } else {
          setItems((prev) => [...prev, ...(newItems || [])]);
        }
        setHasMore(Boolean(pagination?.hasMore));
        setError(null);

        // Fetch review summaries for the loaded items
        if (newItems && newItems.length > 0) {
          try {
            const productIds = newItems.map((item) => item.productId);
            const summariesRes = await getProductReviewSummaries(productIds);
            if (
              (summariesRes.status === "SUCCESS" ||
                summariesRes.status === "success") &&
              summariesRes.data
            ) {
              setReviewSummaries((prev) => ({
                ...prev,
                ...summariesRes.data,
              }));
            }
          } catch (e) {
            // Silently fail - reviews are not critical for listing
            console.error("Failed to load review summaries:", e);
          }
        }
      } catch (e: any) {
        console.error("Error loading items:", e);
        const errorMessage =
          e?.response?.data?.message || e?.message || "Network error occurred";
        setError(errorMessage);
        if (opts.reset) {
          setItems([]);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, debouncedQuery, selectedCategory]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    setPage(1);
    loadItems({ page: 1, search: query, reset: true });
  };

  // Load items when debounced query or category changes (also handles initial load)
  useEffect(() => {
    setPage(1);
    loadItems({ page: 1, reset: true });
  }, [debouncedQuery, selectedCategory]);

  // Client-side filtering for demo: filter by price and rating threshold
  const ratingThreshold = useMemo(() => {
    if (selectedRating === "4+") return 4;
    if (selectedRating === "3+") return 3;
    if (selectedRating === "2+") return 2;
    if (selectedRating === "1+") return 1;
    return 0;
  }, [selectedRating]);

  const getItemRating = (item: StoreItemType) => 4; // placeholder until backend provides rating

  const filteredItems = useMemo(() => {
    const combined = [...demoItems, ...items];
    return combined.filter((it) => {
      const currentPrice = getStoreItemPricing(it).currentPrice ?? 0;
      const withinPrice = currentPrice >= minPrice && currentPrice <= maxPrice;
      const meetsRating = getItemRating(it) >= ratingThreshold;
      return withinPrice && meetsRating;
    });
  }, [demoItems, items, minPrice, maxPrice, ratingThreshold]);

  return (
    <main className="relative min-h-screen pb-0 bg-[#F7F8FA]">
      {/* Hero Section */}
      <section className="relative w-full">
        <img
          src="/assets/Vector.svg"
          alt="Decoration"
          className="pointer-events-none select-none absolute right-0 top-0 w-40 sm:w-48 md:w-56 lg:w-64"
        />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-16">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-3"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Marketplace
          </h1>
          <p className="text-sm sm:text-base text-[#475464] leading-relaxed max-w-3xl">
            Explore thoughtfully curated wellness products designed to nourish
            your body, calm your mind, and support your everyday self-care
            rituals.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl">
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-white rounded-xl overflow-hidden focus-within:border-brand-green transition-colors"
            >
              <div className="pl-4 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="What product are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-3 text-base focus:outline-none bg-white"
              />
            </form>
          </div>

          {/* Mobile Filter Buttons - Below Search Bar */}
          <div className="mt-4 flex gap-2 md:hidden">
            <button
              onClick={() => setPriceDropdownOpen(true)}
              className="px-4 py-2 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors flex items-center gap-2"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Price Range
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => setRatingDropdownOpen(true)}
              className="px-4 py-2 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors flex items-center gap-2"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Product Rating
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Categories */}
          <div className="mt-6">
            <div className="flex-1">
              <div
                className="w-full overflow-x-auto scrollbar-hide"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div
                  className="flex gap-2 pb-2"
                  style={{ minWidth: "min-content" }}
                >
                  {/* All category */}
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`px-4 py-1.5 rounded-full text-sm transition-colors border whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === "All"
                        ? "text-brand-green border-brand-green"
                        : "text-gray-700 border-gray-300 hover:border-brand-green hover:text-brand-green"
                    }`}
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    All
                  </button>

                  {/* Dynamic categories */}
                  {categoriesLoading ? (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-20 bg-gray-200 rounded-full animate-pulse flex-shrink-0"
                        />
                      ))}
                    </>
                  ) : categoriesError ? (
                    <div className="text-red-500 text-sm">
                      Failed to load categories
                    </div>
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`px-4 py-1.5 rounded-full text-sm transition-colors border whitespace-nowrap flex-shrink-0 ${
                          selectedCategory === category.name
                            ? "text-brand-green border-brand-green"
                            : "text-gray-700 border-gray-300 hover:border-brand-green hover:text-brand-green"
                        }`}
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        {category.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section with Background */}
      <section
        className="w-full"
        style={{
          backgroundImage: "url(/assets/general-background.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-8">
          {/* Two Column Layout: Products (Left) + Filters (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Products Section - Left (3 columns) */}
            <div className="lg:col-span-3">
              {loading && items.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
                    >
                      <div className="p-3">
                        <div className="w-full h-48 bg-gray-200 rounded-2xl"></div>
                      </div>
                      <div className="px-6 pb-6">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="py-20 text-center">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3
                      className="text-lg font-semibold text-white mb-2"
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      Failed to load products
                    </h3>
                    <p className="text-white/80 mb-4">{error}</p>
                    <button
                      onClick={() => loadItems({ page: 1, reset: true })}
                      className="bg-white text-brand-green px-6 py-2 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </button>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="py-20 text-center">
                  <div
                    className="text-2xl font-semibold text-white mb-2"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    No products found
                  </div>
                  <p className="text-white/80 mb-6">
                    Try a different search or switch categories.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All");
                      setQuery("");
                    }}
                    className="px-4 py-2 rounded-full bg-brand-green-light text-white text-sm hover:bg-brand-green-light/80"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredItems.map((item) => (
                    <StoreItemCard
                      reviewSummary={reviewSummaries[item.productId]}
                      key={item.productId || item.name}
                      item={item}
                    />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {!loading && items.length > 0 && hasMore && (
                <div className="pt-10 flex justify-center">
                  <button
                    disabled={!hasMore || loading}
                    onClick={async () => {
                      const next = page + 1;
                      setPage(next);
                      await loadItems({ page: next });
                    }}
                    className="px-6 py-3 rounded-full text-white bg-brand-green hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Loading...
                      </div>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Filters Section - Right (Sticky) - Hidden on Mobile */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                  {/* Price Range */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="text-base font-semibold text-gray-900"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        Price Range
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setMinPrice(10);
                            setMaxPrice(200);
                          }}
                          className="px-2 py-1.5 rounded-full border border-brand-green text-brand-green text-xs hover:bg-brand-green/5 transition-colors"
                          style={{ fontFamily: '"League Spartan", sans-serif' }}
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => loadItems({ page: 1, reset: true })}
                          className="px-2 py-1.5 rounded-full border border-brand-green text-brand-green text-xs hover:bg-brand-green/5 transition-colors"
                          style={{ fontFamily: '"League Spartan", sans-serif' }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-2xl p-3">
                        <div className="text-xs text-gray-600 mb-1">
                          Minimum Price
                        </div>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) =>
                            setMinPrice(Number(e.target.value) || 0)
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                        />
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-3">
                        <div className="text-xs text-gray-600 mb-1">
                          Maximum Price
                        </div>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) =>
                            setMaxPrice(Number(e.target.value) || 0)
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Rating */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="text-base font-semibold text-gray-900"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        Product Rating
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRating("all")}
                          className="px-2 py-1.5 rounded-full border border-brand-green text-brand-green text-xs hover:bg-brand-green/5 transition-colors"
                          style={{ fontFamily: '"League Spartan", sans-serif' }}
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => loadItems({ page: 1, reset: true })}
                          className="px-2 py-1.5 rounded-full border border-brand-green text-brand-green text-xs hover:bg-brand-green/5 transition-colors"
                          style={{ fontFamily: '"League Spartan", sans-serif' }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { value: "4+", label: "& Above", stars: 4 },
                        { value: "3+", label: "& Above", stars: 3 },
                        { value: "2+", label: "& Above", stars: 2 },
                        { value: "1+", label: "& Above", stars: 1 },
                      ].map((rating) => (
                        <label
                          key={rating.value}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="rating"
                            value={rating.value}
                            checked={selectedRating === rating.value}
                            onChange={(e) => setSelectedRating(e.target.value)}
                            className="w-5 h-5 text-brand-green accent-brand-green cursor-pointer"
                          />
                          <div className="flex items-center">
                            {[...Array(rating.stars)].map((_, i) => (
                              <svg
                                key={i}
                                className="w-4 h-4 fill-[#FFA500]"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                            {[...Array(5 - rating.stars)].map((_, i) => (
                              <svg
                                key={`empty-${i}`}
                                className="w-4 h-4 fill-gray-200"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                            <span className="text-sm text-gray-700 ml-1">
                              {rating.label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Sheet Modal - Price Range */}
      {priceDropdownOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPriceDropdownOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up">
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Price Range
              </h3>
              <button
                onClick={() => setPriceDropdownOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-3">
                <div className="text-xs text-gray-600 mb-1">Minimum Price</div>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                />
              </div>
              <div className="bg-gray-50 rounded-2xl p-3">
                <div className="text-xs text-gray-600 mb-1">Maximum Price</div>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setMinPrice(10);
                    setMaxPrice(200);
                    setPriceDropdownOpen(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    loadItems({ page: 1, reset: true });
                    setPriceDropdownOpen(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet Modal - Product Rating */}
      {ratingDropdownOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setRatingDropdownOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up">
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Product Rating
              </h3>
              <button
                onClick={() => setRatingDropdownOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 mb-6">
              {[
                { value: "4+", label: "& Above", stars: 4 },
                { value: "3+", label: "& Above", stars: 3 },
                { value: "2+", label: "& Above", stars: 2 },
                { value: "1+", label: "& Above", stars: 1 },
              ].map((rating) => (
                <label
                  key={rating.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rating-mobile"
                    value={rating.value}
                    checked={selectedRating === rating.value}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-5 h-5 text-brand-green accent-brand-green cursor-pointer"
                  />
                  <div className="flex items-center">
                    {[...Array(rating.stars)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-[#FFA500]"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    {[...Array(5 - rating.stars)].map((_, i) => (
                      <svg
                        key={`empty-${i}`}
                        className="w-5 h-5 fill-gray-200"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-700 ml-2">
                      {rating.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedRating("all");
                  setRatingDropdownOpen(false);
                }}
                className="flex-1 px-4 py-3 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Clear
              </button>
              <button
                onClick={() => {
                  loadItems({ page: 1, reset: true });
                  setRatingDropdownOpen(false);
                }}
                className="flex-1 px-4 py-3 rounded-full border border-brand-green text-sm hover:bg-brand-green/5 transition-colors"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default MarketPlace;
