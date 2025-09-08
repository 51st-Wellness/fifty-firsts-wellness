import React, { useState } from "react";
import blog1 from "../assets/images/blog1.png";
import blog2 from "../assets/images/blog2.png";
import blog3 from "../assets/images/blog3.png";
import { Search } from "lucide-react";
import { MdOutlineExpandMore } from "react-icons/md";
import Footer from "../components/Footer";

const Membership = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };
  const plans = {
    personal: [
      {
        id: "embrace",
        title: "Embrace - Personal",
        price: "$0",
        description: "New Starter / explorer in wellness",
        features: [
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
        ],
      },
      {
        id: "elevate",
        title: "Elevate - Personal",
        price: "$99",
        description: "All benefits in Embrace - Personal including",
        features: [
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
        ],
      },
    ],
    business: [
      {
        id: "starter",
        title: "Starter - Business",
        price: "$199",
        description: "For small teams starting out",
        features: [
          "Up to 10 users",
          "Priority email support",
          "10 GB storage",
          "Basic analytics",
          "Community access",
        ],
      },
      {
        id: "enterprise",
        title: "Enterprise - Business",
        price: "Custom",
        description: "For larger organizations",
        features: [
          "Unlimited users",
          "Dedicated support",
          "Unlimited storage",
          "Advanced analytics",
          "SLA guarantee",
        ],
      },
    ],
  };

  return (
    <main className="px-4 sm:px-6 lg:px-12 relative min-h-screen pb-20 bg-gray-50">
      {/* Header Section */}
      <article className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start w-full gap-6 mt-6">
        <div className="flex flex-col gap-4 w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
            Wellness Membership
          </h1>
          <p className="text-sm sm:text-base text-[#475464] leading-relaxed">
            Access exclusive downloads, in-depth guides, and extended podcast & webinar content created just for you.
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

        <div className="flex gap-1.5 text-[#4444B3] border-[#4444B3] rounded-full border py-1 px-3 text-xs sm:text-sm cursor-pointer">
          Newest First
          <MdOutlineExpandMore className="mt-0.5 sm:mt-1 text-lg" />
        </div>
      </article>

      {/* Blog Section */}
      <article className="flex flex-col p-4 sm:p-6 w-full mt-6 items-center">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[blog3, blog1, blog2, blog3, blog1, blog2].map((img, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 border rounded-3xl p-4 hover:shadow-md transition"
            >
              <img
                src={img}
                alt=""
                className="rounded-lg w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover"
              />
              <div className="text-xs sm:text-sm text-gray-500 font-semibold">
                March 4, 2025
              </div>
              <div className="text-base sm:text-lg lg:text-xl font-medium">
                10 Innovative workplace wellness tips: Unlocking Happiness at Work
              </div>
              <div className="text-sm sm:text-base text-[#667085]">
                Discover practical and creative ways to boost morale, reduce
                stress, and create a happier, healthier work environment.
              </div>
              <button className="flex w-fit rounded-full text-white justify-center mt-6 px-3 py-2 text-center bg-[#4444B3] text-sm sm:text-base hover:bg-[#343494] transition">
                Download
              </button>
            </div>
          ))}
        </section>
        <button className="flex rounded-full text-white justify-center mt-6 px-6 py-2 text-center bg-[#4444B3] text-sm sm:text-base hover:bg-[#343494] transition">
          Load More
        </button>
      </article>

      <section className="bg-[#6565CC] text-center py-12 mt-6 px-4">
        <div className="text-white flex flex-col gap-4 mb-10">
          <div className="text-sm uppercase">Pricing</div>
          <div className="text-3xl md:text-4xl font-medium">
            Unlock access to the contents when you go premium
          </div>
          <div className="text-base">
            Flexible plans and solutions for personal use and business of all sizes
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-white rounded-lg overflow-hidden w-full max-w-md">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 py-3 font-medium transition ${activeTab === "personal"
                ? "bg-[#0A8A7E] text-white"
                : "bg-white text-gray-800"
                }`}
            >
              Personal
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`flex-1 py-3 font-medium transition ${activeTab === "business"
                ? "bg-[#0A8A7E] text-white"
                : "bg-white text-gray-800"
                }`}
            >
              Business
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans[activeTab].map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <div className="text-3xl font-bold mb-1">{plan.price}</div>
                <div className="text-sm text-gray-500 mb-4">per month</div>
                <p className="font-medium mb-4">{plan.description}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="border-t pt-2 first:border-t-0 first:pt-0"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mt-6 w-full rounded-full bg-[#4444B3] text-white py-2 font-medium hover:bg-[#343494] transition">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Membership;
