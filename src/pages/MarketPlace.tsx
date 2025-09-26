import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import StarRating from "../components/StarRating";
import Footer from "../components/Footer";
import StoreItemCard from "../components/StoreItemCard";
import { fetchStoreItems } from "../api/marketplace.api";

interface StoreItem {
  productId?: string;
  id?: string;
  name?: string;
  price?: number;
  display?: {
    url?: string;
  };
  images?: string[];
}

interface MarketPlaceProps {
  onSearch?: (query: string) => void;
}

const MarketPlace: React.FC<MarketPlaceProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [openFilter, setOpenFilter] = useState<string | null>(null); // "product" | null
  const [items, setItems] = useState<StoreItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const loadItems = async (opts: any = {}) => {
    setLoading(true);
    try {
      const response = await fetchStoreItems({
        page: opts.page ?? page,
        limit: pageSize,
        search: opts.search ?? (query || undefined),
        isPublished: true,
      });
      
      if (response?.data) {
        const { items: newItems, pagination } = response.data;
        
        if (opts.reset) {
          setItems(newItems);
        } else {
          setItems((prev) => [...prev, ...newItems]);
        }
        setHasMore(Boolean(pagination?.hasMore));
      }
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    setPage(1);
    loadItems({ page: 1, search: query, reset: true });
  };

  useEffect(() => {
    loadItems({ page: 1, reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative min-h-screen pb-20">
      {/* Header Section */}
      <article className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start w-full gap-6 mt-6">
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
        <div className="text-[#4444B3] border-[#4444B3] rounded-full border py-1 px-3 text-sm font-medium">
          All
        </div>
        {[
          "Beauty",
          "Skincare",
          "Supplement",
          "Lifestyle",
          "Self-care",
          "Personal Growth",
          "Mental Health",
        ].map((cat, idx) => (
          <div
            key={idx}
            className="text-sm font-medium cursor-pointer hover:text-[#4444B3]"
          >
            {cat}
          </div>
        ))}
      </section>

      {/* Main Content */}
      <article className="w-full flex flex-col lg:flex-row justify-center gap-6">
        {/* Products */}
        <section className="flex flex-col p-4 lg:p-6 w-full lg:w-4/6 overflow-y-auto">
          <div className="text-2xl sm:text-3xl font-medium mb-6">
            Selected Products
          </div>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <StoreItemCard key={item.productId || item.id} item={item} />
            ))}
            {!loading && items.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                No products found
              </div>
            )}
          </section>
        </section>

        {/* Sidebar (desktop only) */}
        <section className="hidden lg:block w-full lg:w-2/6 bg-[#F9F9F9] p-4 lg:p-6 rounded-xl">
          {/* Product Range */}
          <article className="bg-[#F2F4F7] p-4 flex flex-col justify-center gap-4 mt-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="text-lg sm:text-xl font-medium">
                Product Range
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg font-medium text-[#4444B3]">
                <div className="py-1 px-3 border rounded-full border-[#4444B3]">
                  Clear
                </div>
                <div className="py-1 px-3 border rounded-full border-[#4444B3]">
                  Apply
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="flex gap-1 font-medium">
                <StarRating rating={4} /> & Above
              </span>
              <span className="flex gap-1 font-medium">
                <StarRating rating={3} /> & Above
              </span>
              <span className="flex gap-1 font-medium">
                <StarRating rating={2} /> & Above
              </span>
              <span className="flex gap-1 font-medium">
                <StarRating rating={1} /> & Above
              </span>
            </div>
          </article>
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
    </main>
  );
};

export default MarketPlace;
