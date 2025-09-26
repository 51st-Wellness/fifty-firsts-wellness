import React from "react";
import leaf from "../../assets/images/leaf.png";
import { MdOutlineExpandMore } from "react-icons/md";
import meditate from "../../assets/images/meditate.png";
import stare from "../../assets/images/stare.png";
import sleep from "../../assets/images/sleep.png";

const PersonalWellnessProgrammes: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header Section */}
        <article className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start w-full gap-4 pt-20">
          {/* Left Content */}
          <div className="flex flex-col gap-4 w-full md:w-1/2 text-center md:text-left">
            <div className="text-2xl sm:text-4xl lg:text-6xl font-semibold">
              Personal Wellness Programmes
            </div>
            <div className="text-sm sm:text-base text-[#475464]">
              Choose a program designed to support your unique wellness goals —
              from reducing stress to building mindful routines, one step at a
              time.
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end w-full md:w-1/2">
            <img src={leaf} alt="leaf" className="w-24 sm:w-32 lg:w-40" />
          </div>
        </article>

        {/* Filter Section */}
        <article className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          {/* Categories */}
          <section className="flex flex-wrap justify-center sm:justify-start gap-3 items-center">
            <div className="text-[#4444B3] border-[#4444B3] rounded-full border py-1 px-3 text-sm font-medium">
              All
            </div>
            <div className="text-sm font-medium cursor-pointer">
              Stress Relief
            </div>
            <div className="text-sm font-medium cursor-pointer">
              Better Sleep
            </div>
            <div className="text-sm font-medium cursor-pointer">
              Mindfulness
            </div>
            <div className="text-sm font-medium cursor-pointer">Fitness</div>
            <div className="text-sm font-medium cursor-pointer">Nutrition</div>
          </section>

          {/* Sort Dropdown */}
          <div className="flex gap-1.5 text-[#4444B3] border-[#4444B3] rounded-full border py-1 px-3 text-sm cursor-pointer">
            Newest First
            <MdOutlineExpandMore className="mt-1 text-lg" />
          </div>
        </article>

        {/* Blog Section */}
        <article className="flex flex-col p-4 sm:p-6 w-full mt-6 items-center">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[
              meditate,
              stare,
              sleep,
              meditate,
              stare,
              sleep,
              meditate,
              stare,
              sleep,
            ].map((img, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 border rounded-3xl p-4 hover:shadow-md transition"
              >
                <img
                  src={img}
                  alt=""
                  className="rounded-lg w-full h-48 object-cover"
                />
                <div className="text-xs sm:text-sm text-gray-500 font-semibold">
                  March 4, 2025
                </div>
                <div className="text-base sm:text-lg lg:text-xl font-medium">
                  Stress Relief for Beginners
                </div>
                <div className="text-sm sm:text-base text-[#667085]">
                  Discover practical and creative ways to boost morale, reduce
                  stress, and create a happier, healthier work environment.
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
      </div>
    </main>
  );
};

export default PersonalWellnessProgrammes;
