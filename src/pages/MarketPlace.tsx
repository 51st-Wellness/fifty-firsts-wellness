import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Search, AlertCircle, RefreshCw } from "lucide-react";
import Footer from "../components/Footer";
import StoreItemCard from "../components/StoreItemCard";
import { fetchStoreItems } from "../api/marketplace.api";
import type { StoreItem as StoreItemType } from "../types/marketplace.types";

// Using shared StoreItem type from types to match API response

interface MarketPlaceProps {
  onSearch?: (query: string) => void;
}

const MarketPlace: React.FC<MarketPlaceProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [openFilter, setOpenFilter] = useState<string | null>(null); // "product" | null
  const [items, setItems] = useState<StoreItemType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

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
        };

        console.log("Loading items with params:", params);

        const response = await fetchStoreItems(params);
        console.log("API Response:", response);

        // Check if response is successful
        if (response?.status?.toLowerCase() === "success" && response?.data) {
          const { items: newItems, pagination } = response.data;
          console.log("New items:", newItems, "Pagination:", pagination);

          if (opts.reset) {
            setItems(newItems || []);
          } else {
            setItems((prev) => [...prev, ...(newItems || [])]);
          }
          setHasMore(Boolean(pagination?.hasMore));
          setError(null);
        } else {
          console.warn("API returned non-success response:", response);
          setError(response?.message || "Failed to load products");
          if (opts.reset) {
            setItems([]);
          }
          setHasMore(false);
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

        {/* Mobile Filter Buttons (under search bar) */}
        <div className="mt-4 flex gap-3 lg:hidden">
          <button
            onClick={() => setOpenFilter("product")}
            className="flex-1 py-2 bg-gray-100 rounded-lg font-medium"
          >
            Product Range
          </button>
        </div>

        {/* Categories */}
        <section className="flex flex-wrap justify-center sm:justify-start gap-3 items-center mt-6 pb-4">
          {[
            "All",
            "Beauty",
            "Skincare",
            "Supplement",
            "Lifestyle",
            "Self-care",
            "Personal Growth",
            "Mental Health",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1 px-3 text-sm font-medium rounded-full border transition-colors ${
                selectedCategory === cat
                  ? "text-[#4444B3] border-[#4444B3] bg-[#4444B3]/5"
                  : "text-gray-600 border-gray-300 hover:text-[#4444B3] hover:border-[#4444B3]"
              }`}
            >
              {cat}
            </button>
          ))}
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
                <div className="col-span-full text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-500">Loading products...</p>
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
            {loading ? "Loading..." : hasMore ? "Load More" : "No more items"}
          </button>
        </div>

        {/* Mobile Bottom Drawer */}
        {openFilter && (
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 lg:hidden p-6 shadow-lg rounded-t-2xl z-50 animate-slide-up">
            {openFilter === "product" && (
              <div>
                <h3 className="font-medium mb-3">Select Product Range</h3>
                <ul className="space-y-3">
                  <li>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" /> Skincare
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" /> Wellness
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" /> Bath
                    </label>
                  </li>
                </ul>
              </div>
            )}
            {/* Drawer Actions */}
            <div className="flex justify-between mt-6 gap-3">
              <button
                onClick={() => setOpenFilter(null)}
                className="flex-1 py-2 bg-gray-100 rounded-lg font-medium"
              >
                Clear
              </button>
              <button
                onClick={() => setOpenFilter(null)}
                className="flex-1 py-2 bg-[#4444B3] text-white rounded-lg font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* <Footer /> */}
      </div>
    </main>
  );
};

export default MarketPlace;
