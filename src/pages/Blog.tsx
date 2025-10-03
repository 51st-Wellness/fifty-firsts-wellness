import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Calendar,
  User,
  ArrowRight,
  Tag,
  Clock,
} from "lucide-react";
import Footer from "../components/Footer";
import { fetchBlogs, mediaUrl, type BlogEntity } from "../api/blog.api";

interface BlogProps {
  onSearch?: (query: string) => void;
}

const Blog: React.FC<BlogProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [blogs, setBlogs] = useState<BlogEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Articles");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchBlogs(1, 12);
        setBlogs(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const categories = [
    "All Articles",
    "Wellness",
    "Mindfulness",
    "Nutrition",
    "Mental Health",
    "Fitness",
  ];

  const filteredBlogs =
    selectedCategory === "All Articles"
      ? blogs
      : blogs.filter((blog) => {
          const tags = Array.isArray(blog.tags)
            ? blog.tags
            : String(blog.tags || "")
                .split("#")
                .map((s) => s.trim())
                .filter(Boolean);
          return tags.some((tag) =>
            tag.toLowerCase().includes(selectedCategory.toLowerCase())
          );
        });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="py-16 px-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-heading">
            Wellness Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-primary">
            Explore thoughtfully curated wellness content designed to nourish
            your body, calm your mind, and support your everyday self-care
            rituals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden focus-within:border-brand-green transition-colors"
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
              className="px-8 py-4 bg-brand-green text-white font-semibold hover:bg-brand-green-dark transition-colors font-primary"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
          {/* Categories */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors font-primary ${
                  selectedCategory === cat
                    ? "bg-brand-green text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-brand-green/10 hover:border-brand-green"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 hover:border-brand-green transition-colors cursor-pointer">
            <span className="text-gray-700 font-medium font-primary">
              Newest First
            </span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>

        {/* Blog Articles */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 font-primary">
              Loading articles...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredBlogs.map((blog) => {
              const img =
                blog.coverImage?.url || blog.coverImage?.data?.attributes?.url;
              const tags = Array.isArray(blog.tags)
                ? blog.tags
                : String(blog.tags || "")
                    .split("#")
                    .map((s) => s.trim())
                    .filter(Boolean);

              return (
                <Link key={blog.id} to={`/blog/${blog.slug}`} className="group">
                  <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
                    <div className="relative">
                      {img ? (
                        <img
                          src={mediaUrl(img)}
                          alt={blog.title}
                          className="w-full h-52 object-cover"
                        />
                      ) : (
                        <div className="w-full h-52 bg-gradient-to-br from-brand-green/20 to-brand-purple/20 flex items-center justify-center">
                          <div className="text-brand-green text-4xl font-heading">
                            {blog.title.charAt(0)}
                          </div>
                        </div>
                      )}
                      {blog.publishedAt && (
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-xs font-semibold text-gray-700 px-3 py-1 rounded-full flex items-center gap-1 font-primary">
                          <Calendar size={12} />
                          {new Date(blog.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1 font-primary">
                          <Clock size={14} />5 min read
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight font-heading group-hover:text-brand-green transition-colors">
                        {blog.title}
                      </h3>

                      {blog.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed font-primary line-clamp-3">
                          {blog.description}
                        </p>
                      )}

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="bg-brand-green/10 text-brand-green text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 font-primary"
                            >
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                          {tags.length > 3 && (
                            <span className="text-xs text-gray-500 font-primary">
                              +{tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-brand-green font-semibold hover:text-brand-green-dark transition-colors flex items-center gap-2 font-primary">
                          Read More
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600 font-primary text-lg">
              No articles found for "{selectedCategory}". Try a different
              category.
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default Blog;
