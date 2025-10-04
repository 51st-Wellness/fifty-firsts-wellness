import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Footer from "../components/Footer";
import StoreItemCard from "../components/StoreItemCard";
import { fetchStoreItems } from "../api/marketplace.api";
import { categoryAPI } from "../api/category.api";
import type { StoreItem as StoreItemType } from "../types/marketplace.types";
import type { Category } from "../types/category.types";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoryScrollPosition, setCategoryScrollPosition] =
    useState<number>(0);

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
    [page, pageSize, debouncedQuery]
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
  }, [debouncedQuery, selectedCategory, loadItems]);

  // Category scroll functions
  const scrollCategories = (direction: "left" | "right") => {
    const container = document.getElementById("categories-container");
    if (container) {
      const scrollAmount = 200;
      const newPosition =
        direction === "left"
          ? Math.max(0, categoryScrollPosition - scrollAmount)
          : categoryScrollPosition + scrollAmount;

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setCategoryScrollPosition(newPosition);
    }
  };

  // Check if scroll buttons should be visible
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  useEffect(() => {
    const container = document.getElementById("categories-container");
    if (container) {
      const checkScrollButtons = () => {
        setShowLeftScroll(categoryScrollPosition > 0);
        setShowRightScroll(
          categoryScrollPosition < container.scrollWidth - container.clientWidth
        );
      };

      checkScrollButtons();
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, [categoryScrollPosition, categories]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header Section */}
        <article className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start w-full gap-6 pt-20">
          {/* Left Content */}
          <div className="flex flex-col gap-4 w-full md:w-1/2 text-center md:text-left">
            <div className="text-3xl sm:text-4xl lg:text-6xl font-semibold">
              Marketplace
            </div>
            <div className="text-sm sm:text-base text-[#475464]">
              Explore thoughtfully curated wellness products designed to nourish
              your body, calm your mind, and support your everyday self-care
              rituals.
            </div>
          </div>
        </article>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto flex items-center bg-white border rounded-full shadow-sm overflow-hidden mt-6"
        >
          <div className="pl-4 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="What product are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 text-sm sm:text-base focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white text-sm sm:text-base font-medium hover:bg-indigo-700 transition-all"
          >
            Search
          </button>
        </form>

        {/* Categories */}
        <section className="relative mt-6 pb-4 w-full">
          {/* Scroll buttons for desktop */}
          {showLeftScroll && (
            <button
              onClick={() => scrollCategories("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
          )}

          {showRightScroll && (
            <button
              onClick={() => scrollCategories("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          )}

          {/* Categories container */}
          <div
            id="categories-container"
            className="flex gap-3 items-center overflow-x-auto scrollbar-hide px-2 justify-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* All category */}
            <button
              onClick={() => setSelectedCategory("All")}
              className={`py-1 px-3 text-sm font-medium rounded-full border transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedCategory === "All"
                  ? "text-[#4444B3] border-[#4444B3] bg-[#4444B3]/5"
                  : "text-gray-600 border-gray-300 hover:text-[#4444B3] hover:border-[#4444B3]"
              }`}
            >
              All
            </button>

            {/* Dynamic categories */}
            {categoriesLoading ? (
              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-gray-200 rounded-full animate-pulse flex-shrink-0"
                  />
                ))}
              </div>
            ) : categoriesError ? (
              <div className="text-red-500 text-sm">
                Failed to load categories
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`py-1 px-3 text-sm font-medium rounded-full border transition-colors whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category.name
                      ? "text-[#4444B3] border-[#4444B3] bg-[#4444B3]/5"
                      : "text-gray-600 border-gray-300 hover:text-[#4444B3] hover:border-[#4444B3]"
                  }`}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </section>

        {/* Main Content */}
        <article className="w-full flex justify-center">
          {/* Products */}
          <section className="flex flex-col p-4 lg:p-6 w-full max-w-7xl overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl sm:text-3xl font-medium">
                {debouncedQuery
                  ? `Search results for "${debouncedQuery}"`
                  : selectedCategory !== "All"
                  ? `${selectedCategory} Products`
                  : "All Products"}
              </div>
              {!loading && !error && (
                <div className="text-sm text-gray-500">
                  {items.length} {items.length === 1 ? "product" : "products"}{" "}
                  found
                </div>
              )}
            </div>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading && items.length === 0 ? (
                <div className="col-span-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, idx) => (
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
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-12">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Failed to load products
                    </h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                      onClick={() => loadItems({ page: 1, reset: true })}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <StoreItemCard
                      key={item.productId || item.name}
                      item={item}
                    />
                  ))}
                  {!loading && items.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-12">
                      <p>No products found</p>
                      <p className="text-sm mt-2">
                        Try adjusting your search or check back later
                      </p>
                    </div>
                  )}
                </>
              )}
            </section>
          </section>
        </article>

        {/* Load More Button */}
        <div className="flex justify-center mt-8 pb-8">
          <button
            disabled={!hasMore || loading}
            onClick={async () => {
              const next = page + 1;
              setPage(next);
              await loadItems({ page: next });
            }}
            className="w-fit rounded-full text-white px-6 py-2 text-center bg-[#4444B3] text-sm sm:text-base hover:bg-[#343494] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Loading...
              </div>
            ) : hasMore ? (
              "Load More"
            ) : (
              "No more items"
            )}
          </button>
        </div>

        {/* <Footer /> */}
      </div>
    </main>
  );
};

export default MarketPlace;
