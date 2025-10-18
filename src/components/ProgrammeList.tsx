import React, { useState, useEffect, useCallback } from "react";
import { MdOutlineExpandMore } from "react-icons/md";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgrammeCard from "./ProgrammeCard";
import { Programme, fetchProgrammes } from "../api/programme.api";
import { categoryAPI } from "../api/category.api";
import type { Category } from "../types/category.types";
import SearchBar from "./ui/SearchBar";
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
  const navigate = useNavigate();
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

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
      setDebouncedQuery(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch categories on component mount
  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);

    try {
      const response = await categoryAPI.getAll({ service: "programme" });
      console.log("Programme categories response:", response);

      if (response?.data) {
        setCategories(response.data);
        setCategoriesError(null);
      } else {
        setCategoriesError("Failed to load categories");
        setCategories([]);
      }
    } catch (e: any) {
      console.error("Error loading programme categories:", e);
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
        search: debouncedQuery || undefined,
        categories: selectedCategory !== "All" ? [selectedCategory] : undefined,
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
    } catch (err: any) {
      console.error("Error fetching programmes:", err);

      setError("Failed to fetch programmes. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProgrammesData(1, false);
  }, [debouncedQuery, selectedCategory, sortBy, isPublished]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProgrammesData(nextPage, true);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setSortBy("newest");
  };

  // Category scroll functions
  const scrollCategories = (direction: "left" | "right") => {
    const container = document.getElementById("programme-categories-container");
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
    const container = document.getElementById("programme-categories-container");
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
            <SearchBar
              query={searchTerm}
              onQueryChange={setSearchTerm}
              placeholder="Search programmes..."
              className="mt-6"
            />
          </div>

          {/* Categories */}
          <section className="relative mb-6 pb-4 w-full">
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
              id="programme-categories-container"
              className="flex gap-3 items-center overflow-x-auto scrollbar-hide px-2 justify-center"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* All category */}
              <button
                onClick={() => handleCategoryChange("All")}
                className={`py-1 px-3 text-sm font-medium rounded-full border transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === "All"
                    ? "text-brand-green border-brand-green bg-brand-green/5"
                    : "text-gray-600 border-gray-300 hover:text-brand-green hover:border-brand-green"
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
                    onClick={() => handleCategoryChange(category.name)}
                    className={`py-1 px-3 text-sm font-medium rounded-full border transition-colors whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category.name
                        ? "text-brand-green border-brand-green bg-brand-green/5"
                        : "text-gray-600 border-gray-300 hover:text-brand-green hover:border-brand-green"
                    }`}
                  >
                    {category.name}
                  </button>
                ))
              )}
            </div>
          </section>

          {/* Sort Dropdown */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl sm:text-3xl font-medium">
              {debouncedQuery
                ? `Search results for "${debouncedQuery}"`
                : selectedCategory !== "All"
                ? `${selectedCategory} Programmes`
                : "All Programmes"}
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest" | "title")
                }
                className="appearance-none bg-white border border-brand-green text-brand-green rounded-full py-2 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
              <MdOutlineExpandMore className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-green pointer-events-none" />
            </div>
          </div>
        </>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="mb-4 text-sm text-gray-500">
          {programmes.length}{" "}
          {programmes.length === 1 ? "programme" : "programmes"} found
        </div>
      )}

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
            className="bg-brand-green text-white px-6 py-2 rounded-full hover:bg-brand-green-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
