import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs, mediaUrl, type BlogEntity } from "../api/blog.api";

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogEntity[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-heading">
            Wellness Blog
          </h1>
          <p className="text-gray-600 mt-3 font-primary">
            Your space for mindful living, balance, and self-care.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-heading">
            Wellness Blog
          </h1>
          <p className="text-gray-600 mt-3 font-primary">
            Your space for mindful living, balance, and self-care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((b) => {
            const img =
              b.coverImage?.url || b.coverImage?.data?.attributes?.url;
            return (
              <Link key={b.id} to={`/blog/${b.slug}`} className="group">
                <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
                  <div className="relative">
                    {img ? (
                      <img
                        src={mediaUrl(img)}
                        alt={b.title}
                        className="w-full h-52 object-cover"
                      />
                    ) : (
                      <div className="w-full h-52 bg-gradient-to-br from-brand-green/20 to-brand-purple/20 flex items-center justify-center">
                        <div className="text-brand-green text-4xl font-heading">
                          {b.title.charAt(0)}
                        </div>
                      </div>
                    )}
                    {b.publishedAt && (
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-xs font-semibold text-gray-700 px-3 py-1 rounded-full flex items-center gap-1 font-primary">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {new Date(b.publishedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1 font-primary">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        5 min read
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight font-heading group-hover:text-brand-green transition-colors">
                      {b.title}
                    </h3>

                    {b.description && (
                      <p className="text-gray-600 mb-4 leading-relaxed font-primary line-clamp-3">
                        {b.description}
                      </p>
                    )}
                    {(() => {
                      const tags = Array.isArray(b.tags)
                        ? b.tags
                        : String(b.tags || "")
                            .split("#")
                            .map((s) => s.trim())
                            .filter(Boolean);
                      return tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tags.slice(0, 3).map((t, i) => (
                            <span
                              key={i}
                              className="bg-brand-green/10 text-brand-green text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 font-primary"
                            >
                              <svg
                                className="w-2.5 h-2.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {t}
                            </span>
                          ))}
                          {tags.length > 3 && (
                            <span className="text-xs text-gray-500 font-primary">
                              +{tags.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : null;
                    })()}

                    <div className="flex items-center justify-between">
                      <span className="text-brand-green font-semibold hover:text-brand-green-dark transition-colors flex items-center gap-2 font-primary">
                        Read More
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
