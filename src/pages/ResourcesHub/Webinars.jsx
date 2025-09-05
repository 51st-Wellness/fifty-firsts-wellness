import React, { useState } from "react";
import { MdOutlineExpandMore } from "react-icons/md";
import { Search } from "lucide-react";
import Footer from "../../components/Footer";
import webinar from "../../assets/images/webinars.png";
import { GoClock } from "react-icons/go";
import { LuCalendarDays } from "react-icons/lu";

const Webinars = ({ onSearch }) => {
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
            Webinars
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

      {/* Webinar Section */}
      <article className="flex flex-col p-4 sm:p-6 w-full mt-6 items-center">
        <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {Array(9)
            .fill(webinar)
            .map((img, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-3 border rounded-3xl p-4 hover:shadow-md transition bg-white"
              >
                <img
                  src={img}
                  alt={`Webinar ${idx + 1}`}
                  className="rounded-lg w-full h-40 sm:h-48 object-cover"
                />
                <div className="text-base sm:text-lg lg:text-xl font-medium line-clamp-2">
                  Finding Stillness in a Busy and Exhausting World
                </div>

                <p className="text-xs sm:text-sm text-gray-500 line-clamp-3">
                  Learn daily rituals to ease anxiety and improve sleep. Learn
                  daily rituals to ease anxiety and improve sleep.
                </p>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-3 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <LuCalendarDays /> June 25
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GoClock /> 6 PM WAT
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="text-[#229EFF] rounded-full border-[#229EFF] border py-1 px-2 bg-[#229EFF1A] text-xs sm:text-sm">
                      Limited Slots
                    </div>
                    <div className="text-[#00D743] rounded-full border-[#00D743] border py-1 px-2 bg-[#00D7431A] text-xs sm:text-sm">
                      Upcoming
                    </div>
                  </div>

                  <div className="font-medium text-xs sm:text-sm">
                    Host: Francis Maria
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

export default Webinars;
