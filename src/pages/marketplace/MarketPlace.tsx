import React, { useEffect, useMemo, useState, useCallback } from "react";
import { AlertCircle, RefreshCw, Search, ChevronDown } from "lucide-react";
import Footer from "../../components/Footer";
import StoreItemCard from "../../components/StoreItemCard";
import MarketplaceHeader from "../../components/marketplace/MarketplaceHeader";
import MarketplaceFilters from "../../components/marketplace/MarketplaceFilters";
import { fetchStoreItems } from "../../api/marketplace.api";
import { categoryAPI } from "../../api/category.api";
import type { StoreItem as StoreItemType } from "../../types/marketplace.types";
import type { Category } from "../../types/category.types";
import type { ReviewSummary } from "../../types/review.types";
import { getStoreItemPricing } from "../../utils/discounts";
import { useGlobalDiscount } from "../../context/GlobalDiscountContext";
import { useNumberInput } from "../../hooks/useNumberInput";

// Using shared StoreItem type from types to match API response

interface MarketPlaceProps {
  onSearch?: (query: string) => void;
}

const formatCurrency = (value: number, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value ?? 0);

const MarketPlace: React.FC<MarketPlaceProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [items, setItems] = useState<StoreItemType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [priceDropdownOpen, setPriceDropdownOpen] = useState<boolean>(false);
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState<boolean>(false);
  const { globalDiscount } = useGlobalDiscount();

  // Number input handlers for min/max price
  const minPriceInput = useNumberInput({
    value: minPrice,
    onChange: setMinPrice,
    allowDecimals: true,
    decimalPlaces: 2,
    min: 0,
  });

  const maxPriceInput = useNumberInput({
    value: maxPrice,
    onChange: setMaxPrice,
    allowDecimals: true,
    decimalPlaces: 2,
    min: 0,
  });
  const globalDiscountActive =
    globalDiscount?.isActive &&
    globalDiscount.type !== "NONE" &&
    (globalDiscount.value ?? 0) > 0;

  // Category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

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

  // Load items from the backend using current filters and pagination
  const ratingThreshold = useMemo(() => {
    if (selectedRating === "4+") return 4;
    if (selectedRating === "3+") return 3;
    if (selectedRating === "2+") return 2;
    if (selectedRating === "1+") return 1;
    return 0;
  }, [selectedRating]);

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
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          minRating: ratingThreshold || undefined,
        };

        console.log("Loading items with params:", params);

        const response = await fetchStoreItems(params);

        // console.log("Response:", response.data);
        const { items: newItems, pagination } = response.data!;

        // Always treat results as a single page when filters/page change
        setItems(newItems || []);
        setHasMore(Boolean(pagination?.hasMore));
        setHasPrev(Boolean(pagination?.hasPrev));
        setError(null);
      } catch (e: any) {
        console.error("Error loading items:", e);
        const errorMessage =
          e?.response?.data?.message || e?.message || "Network error occurred";
        setError(errorMessage);
        setItems([]);
        setHasMore(false);
        setHasPrev(false);
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      pageSize,
      debouncedQuery,
      selectedCategory,
      minPrice,
      maxPrice,
      ratingThreshold,
    ]
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

  return (
    <main className="relative min-h-screen pb-0 bg-[#F7F8FA]">
      {/* Hero Section */}
      <section className="relative w-full">
        <img
          src="/assets/Vector.svg"
          alt="Decoration"
          className="pointer-events-none select-none absolute right-0 top-0 w-40 sm:w-48 md:w-56 lg:w-64"
        />
        <MarketplaceHeader
          title="Shop"
          description="Explore thoughtfully curated wellness products designed to nourish your body, calm your mind, and support your everyday self-care rituals."
          globalDiscountActive={globalDiscountActive ?? false}
          globalDiscount={globalDiscount}
          searchQuery={query}
          onSearchChange={setQuery}
          onSearchSubmit={handleSubmit}
          formatCurrency={formatCurrency}
        />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Mobile Filter Buttons - Below Search Bar */}
          <MarketplaceFilters
            minPrice={minPrice}
            maxPrice={maxPrice}
            minPriceInput={minPriceInput}
            maxPriceInput={maxPriceInput}
            onMinPriceClear={() => setMinPrice(0)}
            onMaxPriceClear={() => setMaxPrice(0)}
            onPriceApply={() => loadItems({ page: 1, reset: true })}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            onRatingClear={() => setSelectedRating("all")}
            onRatingApply={() => loadItems({ page: 1, reset: true })}
            priceDropdownOpen={priceDropdownOpen}
            ratingDropdownOpen={ratingDropdownOpen}
            onPriceDropdownClose={() => setPriceDropdownOpen(false)}
            onRatingDropdownClose={() => setRatingDropdownOpen(false)}
            onPriceDropdownOpen={() => setPriceDropdownOpen(true)}
            onRatingDropdownOpen={() => setRatingDropdownOpen(true)}
          />

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
                  {items.map((item) => {
                    // Create ReviewSummary from store item data (already includes averageRating and reviewCount)
                    const reviewSummary: ReviewSummary | undefined =
                      item.averageRating !== undefined &&
                      item.reviewCount !== undefined &&
                      item.reviewCount > 0
                        ? {
                            averageRating: item.averageRating,
                            reviewCount: item.reviewCount,
                            ratingBreakdown: {
                              5: 0,
                              4: 0,
                              3: 0,
                              2: 0,
                              1: 0,
                            },
                          }
                        : undefined;

                    return (
                      <StoreItemCard
                        reviewSummary={reviewSummary}
                        key={item.productId || item.name}
                        item={item}
                      />
                    );
                  })}
                </div>
              )}

              {/* Load More Button */}
              {!loading && items.length > 0 && hasMore && (
                <div className="pt-10 flex items-center justify-center">
                  <button
                    type="button"
                    disabled={loading || !hasMore}
                    onClick={async () => {
                      if (!hasMore) return;
                      const nextPage = page + 1;
                      setPage(nextPage);
                      setLoading(true);
                      setError(null);
                      try {
                        const params = {
                          page: nextPage,
                          limit: pageSize,
                          search: debouncedQuery || undefined,
                          isPublished: true,
                          category: selectedCategory !== "All" ? selectedCategory : undefined,
                          minPrice: minPrice || undefined,
                          maxPrice: maxPrice || undefined,
                          minRating: ratingThreshold || undefined,
                        };
                        const response = await fetchStoreItems(params);
                        const { items: newItems, pagination } = response.data!;
                        // Append new items instead of replacing
                        setItems((prevItems) => [...prevItems, ...(newItems || [])]);
                        setHasMore(Boolean(pagination?.hasMore));
                        setHasPrev(Boolean(pagination?.hasPrev));
                      } catch (e: any) {
                        console.error("Error loading more items:", e);
                        const errorMessage =
                          e?.response?.data?.message || e?.message || "Network error occurred";
                        setError(errorMessage);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="px-6 py-3 rounded-full text-white bg-brand-purple hover:bg-brand-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    {loading ? "Loading..." : "Load more"}
                  </button>
                </div>
              )}
            </div>

            {/* Filters Section - Right (Sticky) - Hidden on Mobile */}
            <MarketplaceFilters
              minPrice={minPrice}
              maxPrice={maxPrice}
              minPriceInput={minPriceInput}
              maxPriceInput={maxPriceInput}
              onMinPriceClear={() => setMinPrice(0)}
              onMaxPriceClear={() => setMaxPrice(0)}
              onPriceApply={() => loadItems({ page: 1, reset: true })}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              onRatingClear={() => setSelectedRating("all")}
              onRatingApply={() => loadItems({ page: 1, reset: true })}
              priceDropdownOpen={priceDropdownOpen}
              ratingDropdownOpen={ratingDropdownOpen}
              onPriceDropdownClose={() => setPriceDropdownOpen(false)}
              onRatingDropdownClose={() => setRatingDropdownOpen(false)}
              onPriceDropdownOpen={() => setPriceDropdownOpen(true)}
              onRatingDropdownOpen={() => setRatingDropdownOpen(true)}
            />
          </div>
        </div>
      </section>

      {/* Mobile modals are handled inside MarketplaceFilters component */}

      <Footer />
    </main>
  );
};

export default MarketPlace;
