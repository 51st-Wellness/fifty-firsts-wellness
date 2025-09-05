import React, { useState } from "react";
import blog1 from "../assets/images/blog1.png";
import blog2 from "../assets/images/blog2.png";
import blog3 from "../assets/images/blog3.png";
import { Search } from "lucide-react";
import { MdOutlineExpandMore } from "react-icons/md";
import Footer from "../components/Footer";

const Blog = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <main className="px-4 sm:px-6 lg:px-12 relative min-h-screen pb-20 bg-gray-50">
      {/* Header Section */}
      <article className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start w-full gap-6 mt-6">
        {/* Left Content */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold">
            Wellness Blog
          </h1>
          <p className="text-sm sm:text-base text-[#475464] leading-relaxed">
            Explore thoughtfully curated wellness podcasts designed to nourish
            your body, calm your mind, and support your everyday self-care
            rituals.
          </p>
        </div>
      </article>

      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto flex items-center bg-white border rounded-full shadow-sm overflow-hidden mt-6 w-full"
      >
        <div className="pl-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search webinars..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 text-sm sm:text-base focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 sm:px-6 py-2 bg-indigo-600 text-white text-sm sm:text-base font-medium hover:bg-indigo-700 transition-all"
        >
          Search
        </button>
      </form>

      {/* Filter Section */}
      <article className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        {/* Categories */}
        <section className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 items-center">
          <div className="text-[#4444B3] border-[#4444B3] rounded-full border py-1 px-3 text-xs sm:text-sm font-medium">
            All
          </div>
          {["Healthy", "Social", "Psychology", "Health"].map((cat, i) => (
            <div
              key={i}
              className="text-xs sm:text-sm font-medium cursor-pointer hover:text-[#4444B3] transition"
            >
              {cat}
            </div>
          ))}
        </section>

        {/* Sort Dropdown */}
        <div className="flex gap-1.5 text-[#4444B3] border-[#4444B3] rounded-full border py-1 px-3 text-xs sm:text-sm cursor-pointer">
          Newest First
          <MdOutlineExpandMore className="mt-0.5 sm:mt-1 text-lg" />
        </div>
      </article>

      {/* Blog Section */}
      <article className="flex flex-col p-4 sm:p-6 w-full mt-6 items-center">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[blog1, blog2, blog3, blog1, blog2, blog3].map((img, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 border rounded-3xl p-4 hover:shadow-md transition"
            >
              {/* Responsive Image */}
              <img
                src={img}
                alt=""
                className="rounded-lg w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover"
              />

              <div className="text-xs sm:text-sm text-gray-500 font-semibold">
                March 4, 2025
              </div>
              <div className="text-base sm:text-lg lg:text-xl font-medium">
                10 Innovative workplace wellness tips: Unlocking Happiness at
                Work
              </div>
              <div className="text-sm sm:text-base text-[#667085]">
                Discover practical and creative ways to boost morale, reduce
                stress, and create a happier, healthier work environment. These
                10 wellness tips are designed to help you and your team thrive
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {["Wellness", "Mindfulness", "Workplace"].map((tag, i) => (
                  <div
                    key={i}
                    className="font-medium text-xs text-[#667085] rounded-full px-3 py-1 border bg-[#C7C7C729]"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Load More Button */}
        <button className="flex rounded-full text-white justify-center mt-6 px-6 py-2 text-center bg-[#4444B3] text-sm sm:text-base hover:bg-[#343494] transition">
          Load More
        </button>
      </article>

      <Footer />
    </main>
  );
};

export default Blog;
