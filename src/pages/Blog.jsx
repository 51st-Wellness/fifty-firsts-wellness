import React, { useState } from "react";
import blog1 from "../assets/images/blog1.png";
import blog2 from "../assets/images/blog2.png";
import blog3 from "../assets/images/blog3.png";
import {
  Search,
  ChevronDown,
  Calendar,
  User,
  ArrowRight,
  Tag,
} from "lucide-react";
import Footer from "../components/Footer";

const Blog = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="py-16 px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Wellness Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore thoughtfully curated wellness content designed to nourish
            your body, calm your mind, and support your everyday self-care
            rituals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden focus-within:border-indigo-500 transition-colors"
          >
            <div className="pl-6 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-4 text-lg focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
          {/* Categories */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold">
              All Articles
            </button>
            {[
              "Wellness",
              "Mindfulness",
              "Nutrition",
              "Mental Health",
              "Fitness",
            ].map((cat, i) => (
              <button
                key={i}
                className="bg-white text-gray-700 px-6 py-2 rounded-full font-semibold border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 hover:border-indigo-300 transition-colors cursor-pointer">
            <span className="text-gray-700 font-medium">Newest First</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>

        {/* Blog Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              img: blog1,
              title:
                "10 Innovative Workplace Wellness Tips: Unlocking Happiness at Work",
              excerpt:
                "Discover practical and creative ways to boost morale, reduce stress, and create a happier, healthier work environment.",
              date: "March 4, 2025",
              author: "Dr. Sarah Johnson",
              readTime: "5 min read",
              tags: ["Wellness", "Mindfulness", "Workplace"],
            },
            {
              img: blog2,
              title:
                "The Science of Stress Management: Evidence-Based Techniques",
              excerpt:
                "Learn about the latest research on stress reduction and practical techniques you can implement today for better mental health.",
              date: "March 1, 2025",
              author: "Dr. Michael Chen",
              readTime: "7 min read",
              tags: ["Stress", "Research", "Mental Health"],
            },
            {
              img: blog3,
              title: "Building Self-Compassion: A Path to Mental Wellness",
              excerpt:
                "Explore the transformative power of self-compassion and how it can improve your overall mental health and well-being.",
              date: "February 28, 2025",
              author: "Dr. Emily Davis",
              readTime: "6 min read",
              tags: ["Self-Care", "Mental Health", "Compassion"],
            },
            {
              img: blog1,
              title: "Nutrition for Mental Health: Foods That Boost Your Mood",
              excerpt:
                "Discover the connection between nutrition and mental health, and learn which foods can help improve your mood and cognitive function.",
              date: "February 25, 2025",
              author: "Dr. Lisa Rodriguez",
              readTime: "8 min read",
              tags: ["Nutrition", "Mental Health", "Wellness"],
            },
            {
              img: blog2,
              title: "The Power of Morning Routines: Starting Your Day Right",
              excerpt:
                "Learn how to create an effective morning routine that sets you up for success and improves your overall well-being throughout the day.",
              date: "February 22, 2025",
              author: "Dr. James Wilson",
              readTime: "4 min read",
              tags: ["Productivity", "Wellness", "Routine"],
            },
            {
              img: blog3,
              title: "Digital Detox: Reclaiming Your Mental Space",
              excerpt:
                "Understand the impact of digital overload on your mental health and learn practical strategies for a healthy relationship with technology.",
              date: "February 20, 2025",
              author: "Dr. Anna Thompson",
              readTime: "6 min read",
              tags: ["Digital Wellness", "Mental Health", "Technology"],
            },
          ].map((article, idx) => (
            <article
              key={idx}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="relative">
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-3 py-1 rounded-full flex items-center gap-1">
                  <Calendar size={12} />
                  {article.date}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    {article.author}
                  </div>
                  <div>{article.readTime}</div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors flex items-center gap-2">
                  Read More
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl">
            Load More Articles
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Blog;
