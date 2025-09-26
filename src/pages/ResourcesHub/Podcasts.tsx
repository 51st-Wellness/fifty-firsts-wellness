import React, { useState } from "react";
import { Search } from "lucide-react";
import Footer from "../../components/Footer";
import { MdOutlineExpandMore, MdSlowMotionVideo } from "react-icons/md";
import podcast1 from "../../assets/images/podcast1.png";
import podcast2 from "../../assets/images/podcast2.png";
import podcast3 from "../../assets/images/podcast3.png";
import podcast4 from "../../assets/images/podcast4.png";
import podcast5 from "../../assets/images/podcast5.png";
import podcast6 from "../../assets/images/podcast6.png";
import { RiForward10Line } from "react-icons/ri";
import { BsCopy } from "react-icons/bs";
import { GrBackTen } from "react-icons/gr";

interface PodcastsProps {
  onSearch?: (query: string) => void;
}

const Podcasts: React.FC<PodcastsProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <main className="relative min-h-screen pb-20 bg-gray-50">
      {/* Header Section */}
      <article className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start w-full gap-6 mt-6">
        {/* Left Content */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold">
            Podcasts
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
        className="max-w-xl mx-auto flex items-center bg-white border rounded-full shadow-sm overflow-hidden mt-6 w-full"
      >
        <div className="pl-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search podcasts..."
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

      {/* Podcast Section */}
      <article className="flex flex-col p-4 sm:p-6 w-full mt-6 items-center">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[
            podcast1,
            podcast2,
            podcast3,
            podcast4,
            podcast5,
            podcast6,
            podcast1,
            podcast2,
            podcast3,
            podcast4,
          ].map((img, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 border rounded-3xl p-4 hover:shadow-md transition bg-white"
            >
              <img
                src={img}
                alt={`Podcast ${idx + 1}`}
                className="rounded-lg w-full h-40 sm:h-48 object-cover"
              />
              <div className="text-xs sm:text-sm text-gray-500 font-semibold">
                March 4, 2025
              </div>
              <div className="text-base sm:text-lg lg:text-xl font-medium line-clamp-2">
                Redefining Success in Life
              </div>
              <div className="text-sm sm:text-base text-[#667085] flex justify-between">
                <span>30:23</span>
                <span className="text-[#98A2B3]">Morning Talk</span>
              </div>

              {/* Controls */}
              <div className="mt-2 flex justify-between items-center">
                <button className="text-xl text-[#4444B3] hover:text-indigo-600">
                  <MdSlowMotionVideo />
                </button>
                <div className="flex items-center gap-3">
                  <button className="text-xl hover:text-indigo-600">
                    <RiForward10Line />
                  </button>
                  <button className="text-xl hover:text-indigo-600">
                    <GrBackTen />
                  </button>
                  <button className="text-xl hover:text-indigo-600">
                    <BsCopy />
                  </button>
                </div>
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

export default Podcasts;
