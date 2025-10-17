import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, Calendar, Tag } from "lucide-react";
import martin1 from "../assets/images/martin1.png";
import martin2 from "../assets/images/martin2.png";
import martin3 from "../assets/images/martin3.png";
import martin4 from "../assets/images/martin4.png";

interface BlogProps { onSearch?: (query: string) => void; }

type LocalBlog = {
  id: string;
  title: string;
  description: string;
  publishedAt?: string;
  image: string;
  tags?: string[];
  slug?: string;
};

const Blog: React.FC<BlogProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [blogs, setBlogs] = useState<LocalBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Articles");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("Newest First");
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date().toISOString();
    setBlogs([
      { id: "d1", title: "10 Innovative workplace wellness tips: Unlocking Happiness at Work", description: "Discover practical and creative ways to boost morale, reduce stress, and create a happier, healthier work environment.", publishedAt: now, image: martin1, tags: ["Wellness", "Mindfulness", "Workplace"] },
      { id: "d2", title: "Practical wellness hacks you can start today", description: "Actionable tips to feel better and do better—starting now.", publishedAt: now, image: martin2, tags: ["Wellness", "Lifestyle", "Nutrition"] },
      { id: "d3", title: "Mindful breaks: restoring focus at work", description: "Short pauses that bring clarity and calm to your day.", publishedAt: now, image: martin3, tags: ["Mindfulness", "Focus", "Mental Health"] },
      { id: "d4", title: "Team activities that boost morale", description: "Build connection and energy with simple group practices.", publishedAt: now, image: martin4, tags: ["Team", "Workplace"] },
      { id: "d5", title: "Healthy routines for busy people", description: "Sustainable habits that work with your schedule.", publishedAt: now, image: martin2, tags: ["Habits", "Wellness", "Fitness"] },
      { id: "d6", title: "How to build a positive work culture", description: "Culture starts with care—here’s how to design it.", publishedAt: now, image: martin3, tags: ["Culture", "Workplace"] },
    ]);
  }, []);

  // Close sort menu on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
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

  const demoPosts = [
    { id: "d1", title: "10 Innovative workplace wellness tips: Unlocking Happiness at Work", image: martin1 },
    { id: "d2", title: "Practical wellness hacks you can start today", image: martin2 },
    { id: "d3", title: "Mindful breaks: restoring focus at work", image: martin3 },
    { id: "d4", title: "Team activities that boost morale", image: martin4 },
    { id: "d5", title: "Healthy routines for busy people", image: martin2 },
    { id: "d6", title: "How to build a positive work culture", image: martin3 },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-visible bg-[#F7F8FA]">
        <img
          src="/assets/Vector.svg"
          alt=""
          className="pointer-events-none select-none absolute right-0 top-0 w-40 sm:w-56 lg:w-64 opacity-90"
        />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-8">
          <h1
            className="text-[40px] sm:text-[48px] lg:text-[56px] leading-none font-semibold text-gray-900 mb-2"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Wellness Blog
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            Your space for mindful living, balance, and self-care.
          </p>
          {/* Search Bar */}
          <div className="max-w-3xl mt-6">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-xl overflow-hidden focus-within:border-[#4444B3] transition-colors"
          >
            <div className="pl-4 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="What blog content are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-3 text-base focus:outline-none"
            />
          </form>
          </div>

          {/* Filter Section in hero */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 mb-2 gap-6">
          {/* Categories */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
                  selectedCategory === cat
                    ? "text-[#4444B3] border-[#4444B3]"
                    : "text-gray-700 border-gray-300 hover:border-[#4444B3] hover:text-[#4444B3]"
                }`}
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 bg-white border rounded-full px-4 py-2 transition-colors text-sm text-[#4444B3] border-[#4444B3]"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              <span>{sortLabel}</span>
              <ChevronDown size={16} className={`transition-transform ${sortOpen ? "rotate-180" : "rotate-0"}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md border border-gray-100 z-50">
                {['Newest First','Oldest First','A-Z Title'].map((opt) => (
                  <button
                    key={opt}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortLabel===opt? 'text-[#4444B3]':'text-gray-700'}`}
                    onClick={() => { setSortLabel(opt); setSortOpen(false); }}
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </section>

        {/* Blog Articles */}
        {loading ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="animate-pulse">
                  <div className="w-full h-56 bg-gray-200 rounded-2xl"></div>
                  <div className="p-6">
                    <div className="h-3 bg-gray-200 rounded mb-3 w-28"></div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredBlogs.map((blog) => {
              const img = blog.image;
              let tags = Array.isArray(blog.tags)
                ? blog.tags
                : String(blog.tags || "")
                    .split("#")
                    .map((s) => s.trim())
                    .filter(Boolean);
              if (tags.length === 0) {
                tags = ["Wellness", "Mindfulness", "Workplace"];
              }

              return (
                <Link key={blog.id} to={`/blog/${blog.slug}`} className="group">
                  <article className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="p-3">
                      {img ? (
                        <img
                          src={img}
                          alt={blog.title}
                          className="w-full h-56 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-brand-green/20 to-brand-purple/20 flex items-center justify-center rounded-xl">
                          <div className="text-brand-green text-4xl font-heading">
                            {blog.title.charAt(0)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-6 pb-6">
                      {blog.publishedAt && (
                        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(blog.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight font-heading group-hover:text-brand-green transition-colors min-h-[56px] line-clamp-2">
                        {blog.title}
                      </h3>

                      {blog.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed font-primary line-clamp-3 min-h-[72px]">
                          {blog.description}
                        </p>
                      )}

                      {tags.length > 0 && (
                        <div className="flex flex-nowrap gap-2 mb-2 overflow-hidden">
                          {tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="text-gray-600 border border-gray-200 bg-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 font-primary whitespace-nowrap"
                            >
                              <Tag size={9} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div />
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 text-gray-600">No articles found for "{selectedCategory}".</div>
        )}
    </main>
  );
};

export default Blog;
