import React, { useState, useEffect } from "react";
import { MdOutlineExpandMore } from "react-icons/md";
import { Search, Filter } from "lucide-react";
import ProgrammeCard from "./ProgrammeCard";
import { Programme, fetchProgrammes } from "../api/programme.api";
import Loader from "./Loader";

interface ProgrammeListProps {
  showFilters?: boolean;
  limit?: number;
  categories?: string[];
  isPublished?: boolean;
}

const ProgrammeList: React.FC<ProgrammeListProps> = ({
  showFilters = true,
  limit,
  categories: initialCategories,
  isPublished = true,
}) => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategories || []
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Available categories (you might want to fetch these from an API)
  const availableCategories = [
    "Stress Relief",
    "Better Sleep",
    "Mindfulness",
    "Fitness",
    "Nutrition",
    "Mental Health",
    "Meditation",
    "Yoga",
    "Wellness",
    "Workplace",
  ];

  const fetchProgrammesData = async (
    pageNum: number = 1,
    append: boolean = false
  ) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page: pageNum,
        limit: limit || 12,
        isPublished,
        search: searchTerm || undefined,
        categories:
          selectedCategories.length > 0 ? selectedCategories : undefined,
      };

      const response = await fetchProgrammes(params);
      const { items, pagination } = response.data.data;

      if (append) {
        setProgrammes((prev) => [...prev, ...items]);
      } else {
        setProgrammes(items);
      }

      setHasMore(pagination.hasMore);
      setError(null);
    } catch (err) {
      setError("Failed to fetch programmes. Please try again.");
      console.error("Error fetching programmes:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProgrammesData(1, false);
  }, [searchTerm, selectedCategories, sortBy, isPublished]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProgrammesData(nextPage, true);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => fetchProgrammesData(1, false)}
          className="bg-[#4444B3] text-white px-4 py-2 rounded-full hover:bg-[#343494] transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showFilters && (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search programmes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4444B3] focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Filter className="w-4 h-4" />
                Categories:
              </div>

              <button
                onClick={() => setSelectedCategories([])}
                className={`text-sm font-medium px-3 py-1 rounded-full border transition ${
                  selectedCategories.length === 0
                    ? "text-[#4444B3] border-[#4444B3] bg-[#4444B3]/5"
                    : "text-gray-600 border-gray-300 hover:border-[#4444B3] hover:text-[#4444B3]"
                }`}
              >
                All
              </button>

              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`text-sm font-medium px-3 py-1 rounded-full border transition ${
                    selectedCategories.includes(category)
                      ? "text-[#4444B3] border-[#4444B3] bg-[#4444B3]/5"
                      : "text-gray-600 border-gray-300 hover:border-[#4444B3] hover:text-[#4444B3]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest" | "title")
                }
                className="appearance-none bg-white border border-[#4444B3] text-[#4444B3] rounded-full py-2 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4444B3] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
              <MdOutlineExpandMore className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4444B3] pointer-events-none" />
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 || searchTerm) && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="bg-[#4444B3] text-white text-xs px-2 py-1 rounded-full">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="bg-[#4444B3] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {category}
                  <button
                    onClick={() => handleCategoryToggle(category)}
                    className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        {programmes.length === 0
          ? "No programmes found"
          : `Showing ${programmes.length} programme${
              programmes.length !== 1 ? "s" : ""
            }`}
      </div>

      {/* Programme Grid */}
      {programmes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {programmes.map((programme) => (
            <ProgrammeCard key={programme.productId} programme={programme} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            No programmes match your criteria
          </div>
          <button
            onClick={clearFilters}
            className="text-[#4444B3] hover:underline"
          >
            Clear filters to see all programmes
          </button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && programmes.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-[#4444B3] text-white px-6 py-2 rounded-full hover:bg-[#343494] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgrammeList;
