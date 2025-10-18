import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, Calendar, Tag, ListFilter } from "lucide-react";
import { fetchBlogs, mediaUrl, type BlogEntity, type Paginated } from "@/api/blog.api";

interface BlogProps { onSearch?: (query: string) => void; }

const Blog: React.FC<BlogProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [blogs, setBlogs] = useState<BlogEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All Articles");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("Newest First");
  const sortRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchBlogs(page, pageSize)
      .then((res) => {
        if (!mounted) return;
        const next = Array.isArray(res?.data) ? res.data : [];
        setBlogs((prev) => (page === 1 ? next : [...prev, ...next]));
        const t = res?.meta?.pagination?.total || 0;
        setTotal(t);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [page]);

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

  // compute category + search + sort
  const filteredBlogs = React.useMemo(() => {
    let list = [...blogs];
    // category filter
    if (selectedCategory !== "All Articles") {
      list = list.filter((blog) => {
          const tags = Array.isArray(blog.tags)
            ? blog.tags as string[]
            : String(blog.tags || "")
                .split("#")
                .map((s) => s.trim())
                .filter(Boolean);
          return tags.some((tag) =>
            tag.toLowerCase().includes(selectedCategory.toLowerCase())
          );
        });
    }
    // search filter (title + description + tags)
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((b) => {
        const tags = (Array.isArray(b.tags) ? (b.tags as string[]) : [])
          .join(" ")
          .toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          (b.description || "").toLowerCase().includes(q) ||
          tags.includes(q)
        );
      });
    }
    // sort
    if (sortLabel === "Newest First") {
      list.sort((a, b) =>
        (b.publishedAt || "").localeCompare(a.publishedAt || "")
      );
    } else if (sortLabel === "Oldest First") {
      list.sort((a, b) =>
        (a.publishedAt || "").localeCompare(b.publishedAt || "")
      );
    } else if (sortLabel === "A-Z Title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [blogs, selectedCategory, query, sortLabel]);

  // removed demo posts now that API is connected

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
        {/* Search Bar and Filter Icon (Mobile) */}
          <div className="max-w-3xl mt-6">
          <div className="flex items-center gap-3">
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex items-center bg-white  rounded-xl overflow-hidden focus-within:border-[#4444B3] transition-colors"
            >
              <div className="pl-4 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="What blog content are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-3 text-base focus:outline-none bg-white"
              />
            </form>
            
            {/* Mobile Filter Icon */}
            <div className="md:hidden relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center justify-center w-12 h-12 bg-white border rounded-full transition-colors text-[#4444B3] border-[#4444B3]"
              >
                <ListFilter size={20} />
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

          {/* Filter Section in hero */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-2 gap-6">
          {/* Categories - Horizontally Scrollable */}
          <div 
            className="w-full md:flex-1 overflow-x-auto scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-2 pb-2" style={{ minWidth: 'min-content' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors border whitespace-nowrap flex-shrink-0 ${
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
          </div>

          {/* Sort Dropdown - Desktop Only */}
          <div className="hidden md:block relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 bg-white border rounded-full px-4 py-2 transition-colors text-sm text-[#4444B3] border-[#4444B3] whitespace-nowrap"
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
        <section
          className="w-full min-h-screen"
          style={{
            backgroundImage: 'url(/assets/general-background.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
                >
                  <div className="p-3">
                    <div className="w-full h-56 bg-gray-200 rounded-2xl"></div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="h-3 bg-gray-200 rounded mb-3 w-28"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="flex flex-wrap gap-2">
                      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-14"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: '\"League Spartan\", sans-serif' }}>No articles found</div>
              <p className="text-white/80 mb-6">Try another search or switch categories.</p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('All Articles'); setQuery(''); }}
                className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm hover:bg-gray-50"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredBlogs.slice(0, visibleCount).map((blog) => {
              const img = mediaUrl((blog.coverImage as any)?.data?.attributes?.url || (blog.coverImage as any)?.url);
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
                  <article className="bg-white rounded-3xl shadow-sm border border-gray-200">
                    <div className="p-3">
                      {img ? (
                        <img
                          src={img}
                          alt={blog.title}
                          className="w-full h-56 object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-brand-green/20 to-brand-purple/20 flex items-center justify-center rounded-2xl">
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight group-hover:text-brand-green transition-colors min-h-[56px] line-clamp-2" style={{ fontFamily: '"League Spartan", sans-serif' }}>
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
          </div>
          {/* Load More inside the background section */}
          {!loading && filteredBlogs.length > 0 && blogs.length < total && (
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-16 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-3 rounded-full text-white bg-[#4444B3] hover:opacity-90 transition-opacity"
                style={{ fontFamily: '\"League Spartan\", sans-serif' }}
              >
                Load More
              </button>
            </div>
          )}
        </section>

    </main>
  );
};

export default Blog;
