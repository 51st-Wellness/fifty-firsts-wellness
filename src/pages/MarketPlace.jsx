import React, { useState } from "react";
import { Search } from "lucide-react";
import diary from "../assets/images/diary.png";
import skincare from "../assets/images/skincare.png";
import bathtub from "../assets/images/bathtub.png";
import { CiShoppingCart } from "react-icons/ci";
import StarRating from "../components/StarRating";
import Footer from "../components/Footer";

const MarketPlace = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [openFilter, setOpenFilter] = useState(null); // "price" | "product" | null

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <main className="px-4 sm:px-6 lg:px-12 relative min-h-screen pb-20">
      {/* Header Section */}
      <article className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start w-full gap-6 mt-6">
        {/* Left Content */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 text-center md:text-left">
          <div className="text-3xl sm:text-4xl lg:text-6xl font-semibold">
            Shop
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
          onClick={() => setOpenFilter("price")}
          className="flex-1 py-2 bg-gray-100 rounded-lg font-medium"
        >
          Price Range
        </button>
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
            {Array.from({ length: 18 }, (_, idx) => {
              const images = [diary, skincare, bathtub];
              const img = images[idx % images.length];
              return (
                <article
                  key={idx}
                  className="flex border rounded-3xl p-4 flex-col"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-auto rounded-lg object-cover"
                  />
                  <div className="text-lg sm:text-xl mt-2">
                    Wellness Product Name
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-lg sm:text-2xl font-medium">
                      $22.50
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="line-through text-sm sm:text-base">
                        $32.50
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-[#229EFF] bg-[#E9F5FF] py-1 px-2 rounded">
                        -14%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={4.5} />
                    <span className="text-xs sm:text-sm text-gray-500">
                      (124 reviews)
                    </span>
                  </div>
                  <button className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-2 px-4 mt-4 text-sm sm:text-base">
                    <CiShoppingCart className="text-lg sm:text-xl" />
                    Add to Cart
                  </button>
                </article>
              );
            })}
          </section>
        </section>

        {/* Sidebar (desktop only) */}
        <section className="hidden lg:block w-full lg:w-2/6 bg-[#F9F9F9] p-4 lg:p-6 rounded-xl">
          {/* Price Range */}
          <article className="bg-[#F2F4F7] p-4 flex flex-col justify-center gap-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="text-lg sm:text-xl font-medium">Price Range</div>
              <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg font-medium text-[#4444B3]">
                <div className="py-1 px-3 border rounded-full border-[#4444B3]">
                  Clear
                </div>
                <div className="py-1 px-3 border rounded-full border-[#4444B3]">
                  Apply
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-3">
              <div className="font-semibold">Minimum Price</div>
              <div className="text-[#98A2B3] font-semibold text-lg">$10</div>
            </div>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-3">
              <div className="font-semibold">Maximum Price</div>
              <div className="text-[#98A2B3] font-semibold text-lg">$200</div>
            </div>
          </article>

          {/* Product Range */}
          <article className="bg-[#F2F4F7] p-4 flex flex-col justify-center gap-4 mt-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="text-lg sm:text-xl font-medium">Product Range</div>
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
        <button className="w-fit rounded-full text-white px-6 py-2 text-center bg-[#4444B3] text-sm sm:text-base hover:bg-[#343494] transition">
          Load More
        </button>
      </div>

      {/* Mobile Bottom Drawer */}
      {openFilter && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 lg:hidden p-6 shadow-lg rounded-t-2xl z-50 animate-slide-up">
          {openFilter === "price" && (
            <div>
              <h3 className="font-medium mb-3">Select Price Range</h3>
              <input type="range" className="w-full" />
            </div>
          )}
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

      <Footer />
    </main>
  );
};

export default MarketPlace;
